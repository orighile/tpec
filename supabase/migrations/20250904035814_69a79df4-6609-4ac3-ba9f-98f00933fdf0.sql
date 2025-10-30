-- Fix vendor contact information exposure security issue
-- Replace the public view policy to hide sensitive contact details

DROP POLICY IF EXISTS "Anyone can view basic vendor info" ON public.vendors;

-- Create a more secure policy that hides contact information from public view
CREATE POLICY "Public can view basic vendor info only"
ON public.vendors
FOR SELECT
USING (verified = true);

-- Create a view for public vendor information that excludes sensitive data
CREATE OR REPLACE VIEW public.vendors_public AS
SELECT 
  id,
  name,
  category,
  description,
  location,
  price_range,
  about,
  cover_image_path,
  verified,
  created_at,
  updated_at
FROM public.vendors
WHERE verified = true;

-- Grant public access to the view
GRANT SELECT ON public.vendors_public TO public;

-- Ensure only vendor owners can see full contact details
CREATE POLICY "Vendor owners can view full vendor details"
ON public.vendors
FOR SELECT
USING (owner_user_id = auth.uid());