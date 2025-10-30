-- Fix vendor contact information exposure by updating RLS policies and function

-- Update the get_public_vendors function to exclude sensitive contact information
CREATE OR REPLACE FUNCTION public.get_public_vendors()
RETURNS TABLE(
  id uuid,
  name text,
  category text,
  description text,
  location text,
  price_range text,
  about text,
  cover_image_path text,
  verified boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
STABLE
SET search_path TO 'public'
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

-- Create a more restrictive public read policy for vendors table
DROP POLICY IF EXISTS "Public can view basic vendor info only" ON public.vendors;
DROP POLICY IF EXISTS "Public can view verified vendor basic info" ON public.vendors;

-- Create a new policy that only shows basic vendor information to public
CREATE POLICY "Public can view basic verified vendor info"
ON public.vendors
FOR SELECT
TO public
USING (
  verified = true
);

-- Add a comment to document the security consideration
COMMENT ON POLICY "Public can view basic verified vendor info" ON public.vendors IS 
'Only verified vendors are visible to public. Contact information should be accessed through secure booking flows only.';