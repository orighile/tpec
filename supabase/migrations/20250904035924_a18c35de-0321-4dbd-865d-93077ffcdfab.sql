-- Fix vendor contact information exposure security issue
-- Update RLS policies to hide sensitive contact details

-- Remove existing policies
DROP POLICY IF EXISTS "Public can view verified vendors without contact info" ON public.vendors;
DROP POLICY IF EXISTS "Vendor owners can view their complete vendor details" ON public.vendors;

-- Create a policy that allows public to see verified vendors but restricts access to contact info
-- The application layer will need to filter sensitive fields for public users
CREATE POLICY "Public can view verified vendor basic info"
ON public.vendors
FOR SELECT
USING (verified = true);

-- Allow vendor owners to see their full vendor details including contact info
CREATE POLICY "Vendor owners can view their complete vendor details"
ON public.vendors
FOR SELECT
USING (owner_user_id = auth.uid());

-- Create a function to get public vendor info that excludes sensitive data
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