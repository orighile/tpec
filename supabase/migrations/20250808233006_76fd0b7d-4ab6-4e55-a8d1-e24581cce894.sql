
-- Critical fixes for DB Schema + RLS Migration

-- Ensure pgcrypto extension for UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create app_role enum if missing (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE app_role AS ENUM ('organizer','vendor','admin','regular');
  END IF;
END $$;

-- Ensure all enum values exist (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON t.oid=e.enumtypid WHERE t.typname='app_role' AND e.enumlabel='organizer') THEN
    ALTER TYPE app_role ADD VALUE 'organizer';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON t.oid=e.enumtypid WHERE t.typname='app_role' AND e.enumlabel='vendor') THEN
    ALTER TYPE app_role ADD VALUE 'vendor';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON t.oid=e.enumtypid WHERE t.typname='app_role' AND e.enumlabel='admin') THEN
    ALTER TYPE app_role ADD VALUE 'admin';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON t.oid=e.enumtypid WHERE t.typname='app_role' AND e.enumlabel='regular') THEN
    ALTER TYPE app_role ADD VALUE 'regular';
  END IF;
END $$;

-- Add role column to profiles if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role app_role DEFAULT 'regular';

-- Create status enums for stricter typing
CREATE TYPE IF NOT EXISTS order_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE IF NOT EXISTS booking_status AS ENUM ('pending', 'confirmed', 'canceled');
CREATE TYPE IF NOT EXISTS ticket_issue_status AS ENUM ('valid', 'checked_in', 'refunded');
CREATE TYPE IF NOT EXISTS currency_type AS ENUM ('NGN', 'USD');

-- Drop existing tables to recreate with proper types
DROP TABLE IF EXISTS public.event_settings CASCADE;
DROP TABLE IF EXISTS public.event_domains CASCADE;
DROP TABLE IF EXISTS public.saved_vendors CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.ticket_issues CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.tickets CASCADE;
DROP TABLE IF EXISTS public.vendor_bookings CASCADE;
DROP TABLE IF EXISTS public.vendor_packages CASCADE;
DROP TABLE IF EXISTS public.vendors CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;

-- Create tables with proper constraints and types
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  starts_at TIMESTAMPTZ,
  location TEXT,
  capacity INTEGER CHECK (capacity > 0),
  category TEXT,
  cover_image_path TEXT,
  slug TEXT UNIQUE,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.vendors (
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

CREATE TABLE public.vendor_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) CHECK (price >= 0) NOT NULL,
  currency currency_type DEFAULT 'NGN',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.vendor_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  package_id UUID REFERENCES public.vendor_packages(id) ON DELETE SET NULL,
  status booking_status DEFAULT 'pending',
  amount DECIMAL(10,2) CHECK (amount >= 0),
  currency currency_type DEFAULT 'NGN',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  price DECIMAL(10,2) CHECK (price >= 0) NOT NULL,
  currency currency_type DEFAULT 'NGN',
  quantity_total INTEGER CHECK (quantity_total >= 0) NOT NULL,
  quantity_sold INTEGER CHECK (quantity_sold >= 0) DEFAULT 0,
  sales_start_at TIMESTAMPTZ DEFAULT now(),
  sales_end_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) CHECK (amount >= 0) NOT NULL,
  currency currency_type DEFAULT 'NGN',
  status order_status DEFAULT 'pending',
  provider TEXT,
  provider_ref TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER CHECK (quantity > 0) NOT NULL,
  unit_price DECIMAL(10,2) CHECK (unit_price >= 0) NOT NULL,
  total_price DECIMAL(10,2) CHECK (total_price >= 0) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.ticket_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  qr_svg_path TEXT,
  status ticket_issue_status DEFAULT 'valid',
  created_at TIMESTAMPTZ DEFAULT now(),
  checked_in_at TIMESTAMPTZ
);

CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(vendor_id, user_id)
);

CREATE TABLE public.saved_vendors (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, vendor_id)
);

CREATE TABLE public.event_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  domain_name TEXT UNIQUE NOT NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.event_settings (
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
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to recreate with proper WITH CHECK clauses
DROP POLICY IF EXISTS "Public can read published events" ON public.events;
DROP POLICY IF EXISTS "Owners can manage their events" ON public.events;
DROP POLICY IF EXISTS "Public can read vendors" ON public.vendors;
DROP POLICY IF EXISTS "Owners can manage their vendors" ON public.vendors;
DROP POLICY IF EXISTS "Public can read active packages" ON public.vendor_packages;
DROP POLICY IF EXISTS "Vendor owners can manage packages" ON public.vendor_packages;
DROP POLICY IF EXISTS "Event owners can create bookings" ON public.vendor_bookings;
DROP POLICY IF EXISTS "Involved parties can view bookings" ON public.vendor_bookings;
DROP POLICY IF EXISTS "Involved parties can update bookings" ON public.vendor_bookings;
DROP POLICY IF EXISTS "Public can read active tickets for published events" ON public.tickets;
DROP POLICY IF EXISTS "Event owners can manage tickets" ON public.tickets;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Order owners and event owners can view orders" ON public.orders;
DROP POLICY IF EXISTS "System can update orders via webhook" ON public.orders;
DROP POLICY IF EXISTS "Order owners and event owners can view order items" ON public.order_items;
DROP POLICY IF EXISTS "System can insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Ticket holders and event owners can view tickets" ON public.ticket_issues;
DROP POLICY IF EXISTS "System can manage ticket issues" ON public.ticket_issues;
DROP POLICY IF EXISTS "Public can read reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can manage their saved vendors" ON public.saved_vendors;
DROP POLICY IF EXISTS "Event owners can manage domains" ON public.event_domains;
DROP POLICY IF EXISTS "Public can read verified domains" ON public.event_domains;
DROP POLICY IF EXISTS "Event owners can manage settings" ON public.event_settings;
DROP POLICY IF EXISTS "Public can read public settings" ON public.event_settings;

-- Corrected RLS Policies with proper WITH CHECK clauses

-- Events policies
CREATE POLICY "Public can read published events" ON public.events
  FOR SELECT USING (published = true);

CREATE POLICY "Owner can read own events" ON public.events
  FOR SELECT USING (auth.uid() = owner_user_id);

CREATE POLICY "Owner can insert events" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Owner can update events" ON public.events
  FOR UPDATE USING (auth.uid() = owner_user_id)
  WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Owner can delete events" ON public.events
  FOR DELETE USING (auth.uid() = owner_user_id);

-- Vendors policies
CREATE POLICY "Public can read vendors" ON public.vendors
  FOR SELECT USING (true);

CREATE POLICY "Owner can insert vendors" ON public.vendors
  FOR INSERT WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Owner can update vendors" ON public.vendors
  FOR UPDATE USING (auth.uid() = owner_user_id)
  WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Owner can delete vendors" ON public.vendors
  FOR DELETE USING (auth.uid() = owner_user_id);

-- Vendor packages policies
CREATE POLICY "Public can read active packages" ON public.vendor_packages
  FOR SELECT USING (active = true);

CREATE POLICY "Vendor owner can manage packages" ON public.vendor_packages
  FOR ALL USING (
    auth.uid() IN (
      SELECT owner_user_id FROM public.vendors WHERE id = vendor_id
    )
  ) WITH CHECK (
    auth.uid() IN (
      SELECT owner_user_id FROM public.vendors WHERE id = vendor_id
    )
  );

-- Vendor bookings policies (allow both event owner and vendor owner to create)
CREATE POLICY "Event or vendor owner can insert bookings" ON public.vendor_bookings
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT owner_user_id FROM public.events WHERE id = event_id
      UNION
      SELECT owner_user_id FROM public.vendors WHERE id = vendor_id
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
  ) WITH CHECK (
    auth.uid() IN (
      SELECT owner_user_id FROM public.events WHERE id = event_id
      UNION
      SELECT owner_user_id FROM public.vendors WHERE id = vendor_id
    )
  );

-- Tickets policies
CREATE POLICY "Public can read active tickets for published events" ON public.tickets
  FOR SELECT USING (
    active = true AND event_id IN (
      SELECT id FROM public.events WHERE published = true
    )
  );

CREATE POLICY "Event owner can manage tickets" ON public.tickets
  FOR ALL USING (
    auth.uid() IN (
      SELECT owner_user_id FROM public.events WHERE id = event_id
    )
  ) WITH CHECK (
    auth.uid() IN (
      SELECT owner_user_id FROM public.events WHERE id = event_id
    )
  );

-- Orders policies (no system override - use service_role)
CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Order owners and event owners can view orders" ON public.orders
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() IN (
      SELECT owner_user_id FROM public.events WHERE id = event_id
    )
  );

CREATE POLICY "Service role can update orders" ON public.orders
  FOR UPDATE USING ((auth.jwt() ->> 'role') = 'service_role')
  WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Order items policies
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

CREATE POLICY "Order owner can insert own items" ON public.order_items
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT user_id FROM public.orders WHERE id = order_id)
  );

-- Ticket issues policies (service role only for creation)
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

CREATE POLICY "Service role can manage ticket issues" ON public.ticket_issues
  FOR ALL USING ((auth.jwt() ->> 'role') = 'service_role')
  WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Reviews policies
CREATE POLICY "Public can read reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Saved vendors policies
CREATE POLICY "Users can manage their saved vendors" ON public.saved_vendors
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Event domains policies
CREATE POLICY "Event owners can manage domains" ON public.event_domains
  FOR ALL USING (
    auth.uid() IN (
      SELECT owner_user_id FROM public.events WHERE id = event_id
    )
  ) WITH CHECK (
    auth.uid() IN (
      SELECT owner_user_id FROM public.events WHERE id = event_id
    )
  );

CREATE POLICY "Public can read verified domains" ON public.event_domains
  FOR SELECT USING (verified_at IS NOT NULL);

-- Event settings policies
CREATE POLICY "Event owners can manage settings" ON public.event_settings
  FOR ALL USING (
    auth.uid() IN (
      SELECT owner_user_id FROM public.events WHERE id = event_id
    )
  ) WITH CHECK (
    auth.uid() IN (
      SELECT owner_user_id FROM public.events WHERE id = event_id
    )
  );

CREATE POLICY "Public can read public settings" ON public.event_settings
  FOR SELECT USING (public = true);

-- Profiles policies
CREATE POLICY "Users can view profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_events_owner ON public.events(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_events_published ON public.events(published);
CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);
CREATE INDEX IF NOT EXISTS idx_vendors_owner ON public.vendors(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_category ON public.vendors(category);
CREATE INDEX IF NOT EXISTS idx_vendor_packages_vendor ON public.vendor_packages(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_bookings_event ON public.vendor_bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_vendor_bookings_vendor ON public.vendor_bookings(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_bookings_status ON public.vendor_bookings(status);
CREATE INDEX IF NOT EXISTS idx_tickets_event ON public.tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_tickets_active ON public.tickets(active);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_event ON public.orders(event_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_provider_ref ON public.orders(provider_ref);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_ticket_issues_order ON public.ticket_issues(order_id);
CREATE INDEX IF NOT EXISTS idx_ticket_issues_code ON public.ticket_issues(code);
CREATE INDEX IF NOT EXISTS idx_reviews_vendor ON public.reviews(vendor_id);
CREATE INDEX IF NOT EXISTS idx_saved_vendors_user ON public.saved_vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_event_domains_domain ON public.event_domains(domain_name);

-- Create or update storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('event-images', 'event-images', true),
  ('vendor-images', 'vendor-images', true),
  ('tickets', 'tickets', false)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies to recreate
DROP POLICY IF EXISTS "Public can view event images" ON storage.objects;
DROP POLICY IF EXISTS "Event owners can upload event images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view vendor images" ON storage.objects;
DROP POLICY IF EXISTS "Vendor owners can upload vendor images" ON storage.objects;
DROP POLICY IF EXISTS "Ticket holders can view their tickets" ON storage.objects;
DROP POLICY IF EXISTS "System can create ticket QR codes" ON storage.objects;
DROP POLICY IF EXISTS "Service role writes ticket QR bucket" ON storage.objects;

-- Corrected storage policies
CREATE POLICY "Public can view event images" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-images');

CREATE POLICY "Event owners can upload event images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'event-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public can view vendor images" ON storage.objects
  FOR SELECT USING (bucket_id = 'vendor-images');

CREATE POLICY "Vendor owners can upload vendor images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'vendor-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

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

CREATE POLICY "Service role writes ticket QR bucket" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'tickets' AND 
    (auth.jwt() ->> 'role') = 'service_role'
  );

-- Helper functions
CREATE OR REPLACE FUNCTION generate_ticket_code() RETURNS TEXT AS $$
BEGIN
  RETURN upper(substring(gen_random_uuid()::text from 1 for 8));
END;
$$ LANGUAGE plpgsql;

-- Improved ticket inventory management (count from ticket_issues only)
CREATE OR REPLACE FUNCTION recompute_ticket_sold(tid uuid) RETURNS void 
LANGUAGE SQL AS $$
  UPDATE public.tickets t
  SET quantity_sold = COALESCE((
    SELECT count(*) FROM public.ticket_issues ti WHERE ti.ticket_id = t.id
  ), 0)
  WHERE t.id = tid;
$$;

CREATE OR REPLACE FUNCTION ticket_issues_sold_sync() RETURNS TRIGGER AS $$
BEGIN
  PERFORM recompute_ticket_sold(COALESCE(NEW.ticket_id, OLD.ticket_id));
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ticket_issues_sold_sync_aiud ON public.ticket_issues;
CREATE TRIGGER ticket_issues_sold_sync_aiud
  AFTER INSERT OR DELETE ON public.ticket_issues
  FOR EACH ROW EXECUTE FUNCTION ticket_issues_sold_sync();

-- Enhanced ticket creation function
CREATE OR REPLACE FUNCTION create_ticket_issues() RETURNS TRIGGER AS $$
DECLARE
  item RECORD;
  i INTEGER;
BEGIN
  -- Only create tickets when order status changes to 'paid'
  IF NEW.status = 'paid' AND OLD.status != 'paid' THEN
    -- Set paid_at timestamp
    NEW.paid_at = now();
    
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

DROP TRIGGER IF EXISTS create_ticket_issues_trigger ON public.orders;
CREATE TRIGGER create_ticket_issues_trigger
  AFTER UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION create_ticket_issues();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END; 
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to relevant tables
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['events','vendors','vendor_bookings','orders','event_settings']
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at_%I ON public.%I;', t, t);
    EXECUTE format('CREATE TRIGGER set_updated_at_%I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE PROCEDURE set_updated_at();', t, t);
  END LOOP;
END $$;
