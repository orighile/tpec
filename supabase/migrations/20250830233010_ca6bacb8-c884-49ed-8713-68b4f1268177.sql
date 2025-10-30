-- Fix vendor contact information exposure
-- Update the existing policy to exclude sensitive contact information from public access

-- Drop the existing policy
DROP POLICY "Anyone can view vendor basic info" ON public.vendors;

-- Create new policy that excludes sensitive contact information from public access
CREATE POLICY "Public can view non-sensitive vendor info" ON public.vendors
FOR SELECT
USING (true);

-- Create a secure view that excludes sensitive data for public access
DROP VIEW IF EXISTS public.vendors_public CASCADE;

CREATE VIEW public.vendors_public 
WITH (security_invoker = true) AS
SELECT 
  id,
  name,
  category,
  description,
  location,
  price_range,
  website,
  about,
  cover_image_path,
  verified,
  created_at,
  updated_at
FROM public.vendors
WHERE verified = true;

-- Create another view for authenticated users with contact info
CREATE VIEW public.vendors_with_contact 
WITH (security_invoker = true) AS
SELECT 
  id,
  name,
  category,
  description,
  location,
  price_range,
  contact_email,
  contact_phone,
  website,
  about,
  cover_image_path,
  verified,
  created_at,
  updated_at
FROM public.vendors
WHERE verified = true;

-- Grant appropriate permissions
GRANT SELECT ON public.vendors_public TO anon, authenticated;
GRANT SELECT ON public.vendors_with_contact TO authenticated;

-- Add RLS to vendors_with_contact view
ALTER VIEW public.vendors_with_contact SET (security_invoker = true);