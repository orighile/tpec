
-- Add role enum to profiles table
ALTER TYPE IF EXISTS app_role ADD VALUE IF NOT EXISTS 'organizer';
ALTER TYPE IF EXISTS app_role ADD VALUE IF NOT EXISTS 'vendor';

-- If app_role doesn't exist, create it
DO $$ BEGIN
  CREATE TYPE app_role AS ENUM ('organizer', 'vendor', 'admin', 'regular');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add role column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role app_role DEFAULT 'regular';

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  starts_at TIMESTAMPTZ,
  location TEXT,
  capacity INTEGER,
  category TEXT,
  cover_image_path TEXT,
  slug TEXT UNIQUE,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create vendors table (enhanced from existing vendor types)
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  location TEXT,
  price_range TEXT,
  verified BOOLEAN DEFAULT false,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  about TEXT,
  cover_image_path TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create vendor_packages table
CREATE TABLE IF NOT EXISTS public.vendor_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create vendor_bookings table
CREATE TABLE IF NOT EXISTS public.vendor_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  package_id UUID REFERENCES public.vendor_packages(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'canceled')) DEFAULT 'pending',
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'NGN',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'general', 'vip', 'early-bird', etc.
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  quantity_total INTEGER NOT NULL,
  quantity_sold INTEGER DEFAULT 0,
  sales_start_at TIMESTAMPTZ DEFAULT now(),
  sales_end_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  status TEXT CHECK (status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
  provider TEXT, -- 'paystack', 'flutterwave'
  provider_ref TEXT, -- external transaction reference
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create ticket_issues table (actual ticket instances)
CREATE TABLE IF NOT EXISTS public.ticket_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
  code TEXT UNIQUE NOT NULL, -- unique ticket code
  qr_svg_path TEXT, -- path to QR code in storage
  status TEXT CHECK (status IN ('valid', 'checked_in', 'refunded')) DEFAULT 'valid',
  created_at TIMESTAMPTZ DEFAULT now(),
  checked_in_at TIMESTAMPTZ
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(vendor_id, user_id) -- one review per user per vendor
);

-- Create saved_vendors table
CREATE TABLE IF NOT EXISTS public.saved_vendors (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, vendor_id)
);

-- Create event_domains table
CREATE TABLE IF NOT EXISTS public.event_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  domain_name TEXT UNIQUE NOT NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create event_settings table
CREATE TABLE IF NOT EXISTS public.event_settings (
  event_id UUID PRIMARY KEY REFERENCES public.events(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'default',
  colors JSONB DEFAULT '{}',
  seo JSONB DEFAULT '{}',
  public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events
CREATE POLICY "Public can read published events" ON public.events
  FOR SELECT USING (published = true);

CREATE POLICY "Owners can manage their events" ON public.events
  FOR ALL USING (auth.uid() = owner_user_id);

-- RLS Policies for vendors
CREATE POLICY "Public can read vendors" ON public.vendors
  FOR SELECT USING (true);

CREATE POLICY "Owners can manage their vendors" ON public.vendors
  FOR ALL USING (auth.uid() = owner_user_id);

-- RLS Policies for vendor_packages
CREATE POLICY "Public can read active packages" ON public.vendor_packages
  FOR SELECT USING (active = true);

CREATE POLICY "Vendor owners can manage packages" ON public.vendor_packages
  FOR ALL USING (
    auth.uid() IN (
      SELECT owner_user_id FROM public.vendors WHERE id = vendor_id
    )
  );

-- RLS Policies for vendor_bookings
CREATE POLICY "Event owners can create bookings" ON public.vendor_bookings
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT owner_user_id FROM public.events WHERE id = event_id
    )
  );

CREATE POLICY "Involved parties can view bookings" ON public.vendor_bookings
  FOR SELECT USING (
    auth.uid() IN (
      SELECT owner_user_id FROM public.events WHERE id = event_id
      UNION
      SELECT owner_user_id FROM public.vendors WHERE id = vendor_id
    )
  );

CREATE POLICY "Involved parties can update bookings" ON public.vendor_bookings
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT owner_user_id FROM public.events WHERE id = event_id
      UNION
      SELECT owner_user_id FROM public.vendors WHERE id = vendor_id
    )
  );

-- RLS Policies for tickets
CREATE POLICY "Public can read active tickets for published events" ON public.tickets
  FOR SELECT USING (
    active = true AND event_id IN (
      SELECT id FROM public.events WHERE published = true
    )
  );

CREATE POLICY "Event owners can manage tickets" ON public.tickets
  FOR ALL USING (
    auth.uid() IN (
      SELECT owner_user_id FROM public.events WHERE id = event_id
    )
  );

-- RLS Policies for orders
CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Order owners and event owners can view orders" ON public.orders
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() IN (
      SELECT owner_user_id FROM public.events WHERE id = event_id
    )
  );

CREATE POLICY "System can update orders via webhook" ON public.orders
  FOR UPDATE USING (true);

-- RLS Policies for order_items
CREATE POLICY "Order owners and event owners can view order items" ON public.order_items
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.orders WHERE id = order_id
      UNION
      SELECT e.owner_user_id FROM public.orders o 
      JOIN public.events e ON e.id = o.event_id 
      WHERE o.id = order_id
    )
  );

CREATE POLICY "System can insert order items" ON public.order_items
  FOR INSERT WITH CHECK (true);

-- RLS Policies for ticket_issues
CREATE POLICY "Ticket holders and event owners can view tickets" ON public.ticket_issues
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.orders WHERE id = order_id
      UNION
      SELECT e.owner_user_id FROM public.orders o 
      JOIN public.events e ON e.id = o.event_id 
      WHERE o.id = order_id
    )
  );

CREATE POLICY "System can manage ticket issues" ON public.ticket_issues
  FOR ALL USING (true);

-- RLS Policies for reviews
CREATE POLICY "Public can read reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for saved_vendors
CREATE POLICY "Users can manage their saved vendors" ON public.saved_vendors
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for event_domains
CREATE POLICY "Event owners can manage domains" ON public.event_domains
  FOR ALL USING (
    auth.uid() IN (
      SELECT owner_user_id FROM public.events WHERE id = event_id
    )
  );

CREATE POLICY "Public can read verified domains" ON public.event_domains
  FOR SELECT USING (verified_at IS NOT NULL);

-- RLS Policies for event_settings
CREATE POLICY "Event owners can manage settings" ON public.event_settings
  FOR ALL USING (
    auth.uid() IN (
      SELECT owner_user_id FROM public.events WHERE id = event_id
    )
  );

CREATE POLICY "Public can read public settings" ON public.event_settings
  FOR SELECT USING (public = true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_owner ON public.events(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_events_published ON public.events(published);
CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);
CREATE INDEX IF NOT EXISTS idx_vendors_owner ON public.vendors(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_category ON public.vendors(category);
CREATE INDEX IF NOT EXISTS idx_vendor_packages_vendor ON public.vendor_packages(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_bookings_event ON public.vendor_bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_vendor_bookings_vendor ON public.vendor_bookings(vendor_id);
CREATE INDEX IF NOT EXISTS idx_tickets_event ON public.tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_event ON public.orders(event_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_ticket_issues_order ON public.ticket_issues(order_id);
CREATE INDEX IF NOT EXISTS idx_ticket_issues_code ON public.ticket_issues(code);
CREATE INDEX IF NOT EXISTS idx_reviews_vendor ON public.reviews(vendor_id);
CREATE INDEX IF NOT EXISTS idx_saved_vendors_user ON public.saved_vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_event_domains_domain ON public.event_domains(domain_name);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('event-images', 'event-images', true),
  ('vendor-images', 'vendor-images', true),
  ('tickets', 'tickets', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for event-images
CREATE POLICY "Public can view event images" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-images');

CREATE POLICY "Event owners can upload event images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'event-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for vendor-images
CREATE POLICY "Public can view vendor images" ON storage.objects
  FOR SELECT USING (bucket_id = 'vendor-images');

CREATE POLICY "Vendor owners can upload vendor images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'vendor-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for tickets (private QR codes)
CREATE POLICY "Ticket holders can view their tickets" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'tickets' AND
    auth.uid() IN (
      SELECT o.user_id 
      FROM public.orders o
      JOIN public.ticket_issues ti ON ti.order_id = o.id
      WHERE ti.qr_svg_path = name
    )
  );

CREATE POLICY "System can create ticket QR codes" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'tickets');

-- Function to generate unique ticket codes
CREATE OR REPLACE FUNCTION generate_ticket_code() RETURNS TEXT AS $$
BEGIN
  RETURN upper(substring(gen_random_uuid()::text from 1 for 8));
END;
$$ LANGUAGE plpgsql;

-- Function to update ticket quantity sold
CREATE OR REPLACE FUNCTION update_ticket_quantity() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.tickets 
    SET quantity_sold = quantity_sold + NEW.quantity
    WHERE id = NEW.ticket_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.tickets 
    SET quantity_sold = quantity_sold - OLD.quantity
    WHERE id = OLD.ticket_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update ticket quantities
CREATE TRIGGER update_ticket_quantity_trigger
  AFTER INSERT OR DELETE ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION update_ticket_quantity();

-- Function to generate ticket issues after order payment
CREATE OR REPLACE FUNCTION create_ticket_issues() RETURNS TRIGGER AS $$
DECLARE
  item RECORD;
  i INTEGER;
BEGIN
  -- Only create tickets when order status changes to 'paid'
  IF NEW.status = 'paid' AND OLD.status != 'paid' THEN
    FOR item IN 
      SELECT ticket_id, quantity 
      FROM public.order_items 
      WHERE order_id = NEW.id
    LOOP
      -- Create individual ticket issues for each quantity
      FOR i IN 1..item.quantity LOOP
        INSERT INTO public.ticket_issues (order_id, ticket_id, code)
        VALUES (NEW.id, item.ticket_id, generate_ticket_code());
      END LOOP;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create ticket issues when order is paid
CREATE TRIGGER create_ticket_issues_trigger
  AFTER UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION create_ticket_issues();
