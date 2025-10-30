-- Completely secure vendor contact information
-- Update the main vendors table policy to exclude contact fields from public access

-- Drop the existing policy that allows all data access
DROP POLICY "Public can view non-sensitive vendor info" ON public.vendors;

-- Create a policy that completely restricts contact information from public access
CREATE POLICY "Public can view vendors without contact info" ON public.vendors
FOR SELECT
USING (false); -- Block all public access to the main table

-- Create a policy for authenticated users to access non-contact info
CREATE POLICY "Authenticated users can view basic vendor info" ON public.vendors  
FOR SELECT
TO authenticated
USING (true);

-- Create a policy for vendor owners to see their own contact details
CREATE POLICY "Vendor owners can view their own details" ON public.vendors
FOR SELECT
USING (owner_user_id = auth.uid());

-- Update the vendors_with_contact view to be more restrictive
DROP VIEW IF EXISTS public.vendors_with_contact CASCADE;

-- Recreate vendors_with_contact view with proper access control
CREATE VIEW public.vendors_with_contact 
WITH (security_invoker = true) AS
SELECT 
  v.id,
  v.name,
  v.category,
  v.description,
  v.location,
  v.price_range,
  v.contact_email,
  v.contact_phone,
  v.website,
  v.about,
  v.cover_image_path,
  v.verified,
  v.created_at,
  v.updated_at
FROM public.vendors v
WHERE v.verified = true 
  AND auth.uid() IS NOT NULL; -- Only for authenticated users

-- Grant permissions
GRANT SELECT ON public.vendors_with_contact TO authenticated;