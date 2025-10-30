
-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  starts_at TIMESTAMP WITH TIME ZONE,
  location TEXT,
  capacity INTEGER,
  category TEXT,
  cover_image_path TEXT,
  slug TEXT,
  published BOOLEAN DEFAULT false,
  owner_user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendors table
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
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
  owner_user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendor_packages table
CREATE TABLE public.vendor_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tickets table
CREATE TABLE public.tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  quantity_total INTEGER NOT NULL,
  quantity_sold INTEGER DEFAULT 0,
  sales_start_at TIMESTAMP WITH TIME ZONE,
  sales_end_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  status TEXT NOT NULL DEFAULT 'pending',
  provider TEXT,
  provider_ref TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendor_bookings table
CREATE TABLE public.vendor_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  package_id UUID REFERENCES public.vendor_packages(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'NGN',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create saved_vendors table
CREATE TABLE public.saved_vendors (
  user_id UUID NOT NULL,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, vendor_id)
);

-- Create event_domains table
CREATE TABLE public.event_domains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  domain_name TEXT NOT NULL UNIQUE,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event_settings table
CREATE TABLE public.event_settings (
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE PRIMARY KEY,
  theme TEXT,
  colors JSONB,
  seo JSONB,
  public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ticket_issues table
CREATE TABLE public.ticket_issues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  qr_svg_path TEXT,
  status TEXT NOT NULL DEFAULT 'valid',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  checked_in_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all tables
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_issues ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events
CREATE POLICY "Users can view published events" ON public.events FOR SELECT USING (published = true);
CREATE POLICY "Users can view their own events" ON public.events FOR SELECT USING (auth.uid() = owner_user_id);
CREATE POLICY "Users can create their own events" ON public.events FOR INSERT WITH CHECK (auth.uid() = owner_user_id);
CREATE POLICY "Users can update their own events" ON public.events FOR UPDATE USING (auth.uid() = owner_user_id);
CREATE POLICY "Users can delete their own events" ON public.events FOR DELETE USING (auth.uid() = owner_user_id);

-- RLS Policies for vendors
CREATE POLICY "Anyone can view vendors" ON public.vendors FOR SELECT USING (true);
CREATE POLICY "Users can create their own vendors" ON public.vendors FOR INSERT WITH CHECK (auth.uid() = owner_user_id);
CREATE POLICY "Users can update their own vendors" ON public.vendors FOR UPDATE USING (auth.uid() = owner_user_id);
CREATE POLICY "Users can delete their own vendors" ON public.vendors FOR DELETE USING (auth.uid() = owner_user_id);

-- RLS Policies for vendor_packages
CREATE POLICY "Anyone can view active vendor packages" ON public.vendor_packages FOR SELECT USING (active = true);
CREATE POLICY "Vendor owners can manage their packages" ON public.vendor_packages FOR ALL USING (
  EXISTS (SELECT 1 FROM public.vendors WHERE vendors.id = vendor_packages.vendor_id AND vendors.owner_user_id = auth.uid())
);

-- RLS Policies for tickets
CREATE POLICY "Anyone can view active tickets for published events" ON public.tickets FOR SELECT USING (
  active = true AND EXISTS (SELECT 1 FROM public.events WHERE events.id = tickets.event_id AND events.published = true)
);
CREATE POLICY "Event owners can manage their tickets" ON public.tickets FOR ALL USING (
  EXISTS (SELECT 1 FROM public.events WHERE events.id = tickets.event_id AND events.owner_user_id = auth.uid())
);

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update their own orders" ON public.orders FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- RLS Policies for order_items
CREATE POLICY "Users can view their order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR orders.user_id IS NULL))
);
CREATE POLICY "Users can create order items for their orders" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR orders.user_id IS NULL))
);

-- RLS Policies for vendor_bookings
CREATE POLICY "Event owners can view bookings for their events" ON public.vendor_bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.events WHERE events.id = vendor_bookings.event_id AND events.owner_user_id = auth.uid())
);
CREATE POLICY "Vendor owners can view their bookings" ON public.vendor_bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.vendors WHERE vendors.id = vendor_bookings.vendor_id AND vendors.owner_user_id = auth.uid())
);
CREATE POLICY "Event owners can create bookings" ON public.vendor_bookings FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.events WHERE events.id = vendor_bookings.event_id AND events.owner_user_id = auth.uid())
);
CREATE POLICY "Event owners can update bookings for their events" ON public.vendor_bookings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.events WHERE events.id = vendor_bookings.event_id AND events.owner_user_id = auth.uid())
);

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create their own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for saved_vendors
CREATE POLICY "Users can view their saved vendors" ON public.saved_vendors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save vendors" ON public.saved_vendors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsave vendors" ON public.saved_vendors FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for event_domains
CREATE POLICY "Event owners can manage their domains" ON public.event_domains FOR ALL USING (
  EXISTS (SELECT 1 FROM public.events WHERE events.id = event_domains.event_id AND events.owner_user_id = auth.uid())
);

-- RLS Policies for event_settings
CREATE POLICY "Anyone can view public event settings" ON public.event_settings FOR SELECT USING (public = true);
CREATE POLICY "Event owners can view their event settings" ON public.event_settings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.events WHERE events.id = event_settings.event_id AND events.owner_user_id = auth.uid())
);
CREATE POLICY "Event owners can manage their event settings" ON public.event_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.events WHERE events.id = event_settings.event_id AND events.owner_user_id = auth.uid())
);

-- RLS Policies for ticket_issues
CREATE POLICY "Users can view their ticket issues" ON public.ticket_issues FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = ticket_issues.order_id 
    AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
  )
);
CREATE POLICY "Event owners can view ticket issues for their events" ON public.ticket_issues FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    JOIN public.events e ON e.id = o.event_id
    WHERE o.id = ticket_issues.order_id AND e.owner_user_id = auth.uid()
  )
);

-- Create indexes for better performance
CREATE INDEX idx_events_owner_user_id ON public.events(owner_user_id);
CREATE INDEX idx_events_published ON public.events(published);
CREATE INDEX idx_vendors_owner_user_id ON public.vendors(owner_user_id);
CREATE INDEX idx_vendors_category ON public.vendors(category);
CREATE INDEX idx_tickets_event_id ON public.tickets(event_id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_event_id ON public.orders(event_id);
CREATE INDEX idx_reviews_vendor_id ON public.reviews(vendor_id);
CREATE INDEX idx_vendor_bookings_event_id ON public.vendor_bookings(event_id);
CREATE INDEX idx_vendor_bookings_vendor_id ON public.vendor_bookings(vendor_id);
