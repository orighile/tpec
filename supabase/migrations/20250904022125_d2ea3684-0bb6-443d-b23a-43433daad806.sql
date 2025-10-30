-- Check for any remaining security definer functions or objects
-- and ensure our view is completely clean
SELECT proname, prosecdef 
FROM pg_proc 
WHERE prosecdef = true 
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- Ensure no security definer properties remain by completely recreating the view
DROP VIEW IF EXISTS public.vendors_with_contact CASCADE;

-- Create a completely clean view with no security definer references
CREATE VIEW public.vendors_with_contact AS
SELECT 
  v.id,
  v.name,
  v.category,
  v.description,
  v.location,
  v.price_range,
  -- Contact info only visible to vendor owners
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