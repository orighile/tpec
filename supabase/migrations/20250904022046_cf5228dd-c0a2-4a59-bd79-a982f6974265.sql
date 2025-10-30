-- Drop and recreate the view without any security definer properties
DROP VIEW IF EXISTS public.vendors_with_contact;

-- Create a secure view that only shows contact info to authenticated vendor owners
-- This approach uses RLS policies on the underlying vendors table instead of security definer
CREATE VIEW public.vendors_with_contact AS
SELECT 
  v.id,
  v.name,
  v.category,
  v.description,
  v.location,
  v.price_range,
  -- Contact info only visible if user owns the vendor OR if accessing through proper auth
  CASE
    WHEN v.owner_user_id = auth.uid() THEN v.contact_email
    ELSE NULL::text
  END AS contact_email,
  CASE
    WHEN v.owner_user_id = auth.uid() THEN v.contact_phone
    ELSE NULL::text
  END AS contact_phone,
  v.website,
  v.about,
  v.cover_image_path,
  v.verified,
  v.created_at,
  v.updated_at
FROM vendors v
WHERE v.verified = true;

-- Remove the security definer function since we're using direct auth.uid() checks
DROP FUNCTION IF EXISTS public.can_access_vendor_contact(uuid);