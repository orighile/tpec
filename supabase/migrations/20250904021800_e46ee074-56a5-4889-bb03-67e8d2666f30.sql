-- Drop the existing view to recreate it more securely
DROP VIEW IF EXISTS public.vendors_with_contact;

-- Update the security function to be more restrictive
CREATE OR REPLACE FUNCTION public.can_access_vendor_contact(vendor_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  -- Only authenticated users can potentially access contact info
  SELECT CASE 
    WHEN auth.uid() IS NULL THEN false
    ELSE EXISTS (
      SELECT 1 FROM vendors 
      WHERE id = vendor_id 
      AND owner_user_id = auth.uid()
    )
  END;
$$;

-- Recreate the view with enhanced security
CREATE VIEW public.vendors_with_contact AS
SELECT 
  v.id,
  v.name,
  v.category,
  v.description,
  v.location,
  v.price_range,
  -- Only show contact info to vendor owners, NULL for everyone else
  CASE
    WHEN public.can_access_vendor_contact(v.id) THEN v.contact_email
    ELSE NULL::text
  END AS contact_email,
  CASE
    WHEN public.can_access_vendor_contact(v.id) THEN v.contact_phone
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

-- Grant appropriate permissions
GRANT SELECT ON public.vendors_with_contact TO authenticated;
GRANT SELECT ON public.vendors_with_contact TO anon;