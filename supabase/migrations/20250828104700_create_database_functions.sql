-- Database functions for analytics and business logic

-- Function to get ticket sales analytics
CREATE OR REPLACE FUNCTION get_ticket_sales_analytics(event_id UUID)
RETURNS TABLE (
  date DATE,
  tickets_sold BIGINT,
  revenue NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(o.created_at) as date,
    SUM(oi.quantity) as tickets_sold,
    SUM(oi.price * oi.quantity) as revenue
  FROM orders o
  JOIN order_items oi ON o.id = oi.order_id
  WHERE o.event_id = get_ticket_sales_analytics.event_id
    AND o.status = 'paid'
  GROUP BY DATE(o.created_at)
  ORDER BY date;
END;
$$ LANGUAGE plpgsql;

-- Function to get revenue analytics
CREATE OR REPLACE FUNCTION get_revenue_analytics(event_id UUID)
RETURNS TABLE (
  total_revenue NUMERIC,
  ticket_revenue NUMERIC,
  vendor_revenue NUMERIC,
  refunded_amount NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(CASE WHEN o.status = 'paid' THEN o.total_amount END), 0) as total_revenue,
    COALESCE(SUM(CASE WHEN o.status = 'paid' AND oi.id IS NOT NULL THEN oi.price * oi.quantity END), 0) as ticket_revenue,
    COALESCE(SUM(CASE WHEN o.status = 'paid' AND vb.id IS NOT NULL THEN vp.price END), 0) as vendor_revenue,
    COALESCE(SUM(CASE WHEN o.status = 'refunded' THEN o.refund_amount END), 0) as refunded_amount
  FROM orders o
  LEFT JOIN order_items oi ON o.id = oi.order_id
  LEFT JOIN vendor_bookings vb ON o.id = vb.order_id
  LEFT JOIN vendor_packages vp ON vb.package_id = vp.id
  WHERE o.event_id = get_revenue_analytics.event_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get attendee analytics
CREATE OR REPLACE FUNCTION get_attendee_analytics(event_id UUID)
RETURNS TABLE (
  total_attendees BIGINT,
  checked_in BIGINT,
  pending_checkin BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(oi.quantity), 0) as total_attendees,
    COALESCE(COUNT(ti.id) FILTER (WHERE ti.checked_in_at IS NOT NULL), 0) as checked_in,
    COALESCE(COUNT(ti.id) FILTER (WHERE ti.checked_in_at IS NULL), 0) as pending_checkin
  FROM orders o
  JOIN order_items oi ON o.id = oi.order_id
  LEFT JOIN ticket_issues ti ON o.id = ti.order_id
  WHERE o.event_id = get_attendee_analytics.event_id
    AND o.status = 'paid';
END;
$$ LANGUAGE plpgsql;

-- Function to get top selling tickets
CREATE OR REPLACE FUNCTION get_top_tickets(event_id UUID)
RETURNS TABLE (
  ticket_id UUID,
  ticket_type TEXT,
  quantity_sold BIGINT,
  revenue NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id as ticket_id,
    t.type as ticket_type,
    SUM(oi.quantity) as quantity_sold,
    SUM(oi.price * oi.quantity) as revenue
  FROM tickets t
  JOIN order_items oi ON t.id = oi.ticket_id
  JOIN orders o ON oi.order_id = o.id
  WHERE t.event_id = get_top_tickets.event_id
    AND o.status = 'paid'
  GROUP BY t.id, t.type
  ORDER BY quantity_sold DESC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql;

-- Function to search vendors with filters
CREATE OR REPLACE FUNCTION search_vendors(
  search_query TEXT DEFAULT '',
  filters JSONB DEFAULT '{}'::JSONB
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  category TEXT,
  location TEXT,
  verification_status TEXT,
  avg_rating NUMERIC,
  review_count BIGINT,
  min_price NUMERIC
) AS $$
DECLARE
  category_filter TEXT;
  location_filter TEXT;
  min_price_filter NUMERIC;
  max_price_filter NUMERIC;
  min_rating_filter NUMERIC;
  verified_only BOOLEAN;
BEGIN
  -- Extract filters
  category_filter := filters->>'category';
  location_filter := filters->>'location';
  min_price_filter := (filters->>'min_price')::NUMERIC;
  max_price_filter := (filters->>'max_price')::NUMERIC;
  min_rating_filter := (filters->>'min_rating')::NUMERIC;
  verified_only := (filters->>'verified_only')::BOOLEAN;

  RETURN QUERY
  SELECT 
    v.id,
    v.name,
    v.description,
    v.category,
    v.location,
    v.verification_status,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(r.id) as review_count,
    COALESCE(MIN(vp.price), 0) as min_price
  FROM vendors v
  LEFT JOIN reviews r ON v.id = r.vendor_id
  LEFT JOIN vendor_packages vp ON v.id = vp.vendor_id
  WHERE 
    (search_query = '' OR 
     v.name ILIKE '%' || search_query || '%' OR 
     v.description ILIKE '%' || search_query || '%' OR
     v.category ILIKE '%' || search_query || '%')
    AND (category_filter IS NULL OR v.category = category_filter)
    AND (location_filter IS NULL OR v.location ILIKE '%' || location_filter || '%')
    AND (NOT verified_only OR v.verification_status = 'verified')
  GROUP BY v.id, v.name, v.description, v.category, v.location, v.verification_status
  HAVING 
    (min_rating_filter IS NULL OR COALESCE(AVG(r.rating), 0) >= min_rating_filter)
    AND (min_price_filter IS NULL OR COALESCE(MIN(vp.price), 0) >= min_price_filter)
    AND (max_price_filter IS NULL OR COALESCE(MIN(vp.price), 0) <= max_price_filter)
  ORDER BY avg_rating DESC, review_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to handle profile creation trigger
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'regular')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate ticket issues when order is paid
CREATE OR REPLACE FUNCTION generate_ticket_issues()
RETURNS TRIGGER AS $$
BEGIN
  -- Only generate tickets when status changes to 'paid'
  IF OLD.status != 'paid' AND NEW.status = 'paid' THEN
    INSERT INTO ticket_issues (order_id, ticket_id, issue_code, attendee_name, attendee_email)
    SELECT 
      NEW.id,
      oi.ticket_id,
      'TPEC-' || UPPER(LEFT(MD5(RANDOM()::TEXT), 8)),
      p.full_name,
      p.email
    FROM order_items oi
    JOIN auth.users u ON NEW.user_id = u.id
    JOIN profiles p ON u.id = p.id
    WHERE oi.order_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update vendor ratings
CREATE OR REPLACE FUNCTION update_vendor_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Recalculate average rating for the vendor
  UPDATE vendors 
  SET avg_rating = (
    SELECT AVG(rating) 
    FROM reviews 
    WHERE vendor_id = COALESCE(NEW.vendor_id, OLD.vendor_id)
  )
  WHERE id = COALESCE(NEW.vendor_id, OLD.vendor_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

DROP TRIGGER IF EXISTS on_order_status_change ON orders;
CREATE TRIGGER on_order_status_change
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_ticket_issues();

DROP TRIGGER IF EXISTS on_review_change ON reviews;
CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_vendor_rating();
