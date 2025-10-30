-- Enable Row Level Security for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Events policies
CREATE POLICY "Public events are viewable by everyone" ON public.events
  FOR SELECT USING (is_public = true OR auth.uid() = owner_user_id);

CREATE POLICY "Users can create events" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Users can update their own events" ON public.events
  FOR UPDATE USING (auth.uid() = owner_user_id);

CREATE POLICY "Users can delete their own events" ON public.events
  FOR DELETE USING (auth.uid() = owner_user_id);

-- Vendors policies
CREATE POLICY "Verified vendors are viewable by everyone" ON public.vendors
  FOR SELECT USING (verification_status = 'verified' OR auth.uid() = owner_user_id);

CREATE POLICY "Users can create vendor profiles" ON public.vendors
  FOR INSERT WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Users can update their own vendor profiles" ON public.vendors
  FOR UPDATE USING (auth.uid() = owner_user_id);

CREATE POLICY "Users can delete their own vendor profiles" ON public.vendors
  FOR DELETE USING (auth.uid() = owner_user_id);

-- Vendor packages policies
CREATE POLICY "Packages are viewable if vendor is viewable" ON public.vendor_packages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.vendors 
      WHERE vendors.id = vendor_packages.vendor_id 
      AND (vendors.verification_status = 'verified' OR vendors.owner_user_id = auth.uid())
    )
  );

CREATE POLICY "Vendor owners can manage their packages" ON public.vendor_packages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.vendors 
      WHERE vendors.id = vendor_packages.vendor_id 
      AND vendors.owner_user_id = auth.uid()
    )
  );

-- Vendor bookings policies
CREATE POLICY "Users can view their own bookings" ON public.vendor_bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = vendor_bookings.order_id 
      AND orders.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.vendors 
      WHERE vendors.id = vendor_bookings.vendor_id 
      AND vendors.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create bookings" ON public.vendor_bookings
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own bookings or vendors can update their bookings" ON public.vendor_bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = vendor_bookings.order_id 
      AND orders.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.vendors 
      WHERE vendors.id = vendor_bookings.vendor_id 
      AND vendors.owner_user_id = auth.uid()
    )
  );

-- Tickets policies
CREATE POLICY "Tickets are viewable if event is viewable" ON public.tickets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = tickets.event_id 
      AND (events.is_public = true OR events.owner_user_id = auth.uid())
    )
  );

CREATE POLICY "Event owners can manage their tickets" ON public.tickets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = tickets.event_id 
      AND events.owner_user_id = auth.uid()
    )
  );

-- Orders policies
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view their own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for their orders" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Ticket issues policies
CREATE POLICY "Users can view their own ticket issues" ON public.ticket_issues
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = ticket_issues.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Event owners can view ticket issues for their events" ON public.ticket_issues
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      JOIN public.events e ON e.id = o.event_id
      WHERE o.id = ticket_issues.order_id 
      AND e.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create ticket issues" ON public.ticket_issues
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Reviews policies
CREATE POLICY "Reviews are publicly viewable" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Saved vendors policies
CREATE POLICY "Users can view their own saved vendors" ON public.saved_vendors
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save vendors" ON public.saved_vendors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their saved vendors" ON public.saved_vendors
  FOR DELETE USING (auth.uid() = user_id);

-- Event domains policies
CREATE POLICY "Event domains are viewable if event is viewable" ON public.event_domains
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = event_domains.event_id 
      AND (events.is_public = true OR events.owner_user_id = auth.uid())
    )
  );

CREATE POLICY "Event owners can manage their domains" ON public.event_domains
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = event_domains.event_id 
      AND events.owner_user_id = auth.uid()
    )
  );

-- Event settings policies
CREATE POLICY "Event settings are viewable if event is viewable" ON public.event_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = event_settings.event_id 
      AND (events.is_public = true OR events.owner_user_id = auth.uid())
    )
  );

CREATE POLICY "Event owners can manage their settings" ON public.event_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = event_settings.event_id 
      AND events.owner_user_id = auth.uid()
    )
  );

-- Guests policies
CREATE POLICY "Event owners can view their event guests" ON public.guests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = guests.event_id 
      AND events.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Event owners can manage their event guests" ON public.guests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = guests.event_id 
      AND events.owner_user_id = auth.uid()
    )
  );
