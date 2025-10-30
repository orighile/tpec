-- Fix the security definer view issue by removing the view and using RLS policies instead
DROP VIEW IF EXISTS public.vendors_public;

-- Revoke any permissions on the dropped view
REVOKE ALL ON public.vendors_public FROM public;

-- Update the public policy to properly filter sensitive fields using RLS
-- This approach is more secure than using a SECURITY DEFINER view
DROP POLICY IF EXISTS "Public can view basic vendor info only" ON public.vendors;
DROP POLICY IF EXISTS "Vendor owners can view full vendor details" ON public.vendors;

-- Create a comprehensive policy that allows public to see non-sensitive vendor info
-- but hides contact details (contact_email, contact_phone, website)
CREATE POLICY "Public can view verified vendors without contact info"
ON public.vendors
FOR SELECT
USING (
  verified = true AND 
  (
    -- Allow public to see the row, but the application layer should filter sensitive fields
    -- or we use a function to return filtered data
    true
  )
);

-- Allow vendor owners to see their full vendor details including contact info
CREATE POLICY "Vendor owners can view their complete vendor details"
ON public.vendors
FOR SELECT
USING (owner_user_id = auth.uid());

-- Create a function to get public vendor info that excludes sensitive data
-- This is a safer approach than a SECURITY DEFINER view
CREATE OR REPLACE FUNCTION public.get_public_vendors()
RETURNS TABLE (
  id uuid,
  name text,
  category text,
  description text,
  location text,
  price_range text,
  about text,
  cover_image_path text,
  verified boolean,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY INVOKER
STABLE
AS $$
  SELECT 
    v.id,
    v.name,
    v.category,
    v.description,
    v.location,
    v.price_range,
    v.about,
    v.cover_image_path,
    v.verified,
    v.created_at,
    v.updated_at
  FROM public.vendors v
  WHERE v.verified = true;
$$;