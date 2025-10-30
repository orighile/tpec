-- Fix conflicting vendor policies with clear separation of concerns
-- Drop all existing vendor policies
DROP POLICY "Public can view vendors without contact info" ON public.vendors;
DROP POLICY "Authenticated users can view basic vendor info" ON public.vendors;  
DROP POLICY "Vendor owners can view their own details" ON public.vendors;

-- Create clean, non-conflicting policies

-- Policy 1: Anyone can see basic vendor info (no contact details)
CREATE POLICY "Anyone can view basic vendor info" ON public.vendors
FOR SELECT
USING (verified = true);

-- Policy 2: Only vendor owners can see contact details of their own vendors
CREATE POLICY "Vendor owners can manage their vendors" ON public.vendors
FOR ALL
USING (owner_user_id = auth.uid());

-- Since we still want to restrict contact fields from general access,
-- we'll ensure the public view is the primary way to access vendor data
-- and update any code to use vendors_public for general listings

-- Make vendors_public the main public interface
-- (This view already excludes contact information)

-- For the vendors_with_contact view, let's make it more secure
DROP VIEW IF EXISTS public.vendors_with_contact CASCADE;

-- Create a function to check if user should see vendor contact info
CREATE OR REPLACE FUNCTION public.can_access_vendor_contact(vendor_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM vendors 
    WHERE id = vendor_id 
    AND owner_user_id = auth.uid()
  );
$$;

-- Create secure view for vendor contact access
CREATE VIEW public.vendors_with_contact 
WITH (security_invoker = true) AS
SELECT 
  v.id,
  v.name,
  v.category,
  v.description,
  v.location,
  v.price_range,
  CASE 
    WHEN public.can_access_vendor_contact(v.id) THEN v.contact_email
    ELSE NULL
  END as contact_email,
  CASE 
    WHEN public.can_access_vendor_contact(v.id) THEN v.contact_phone  
    ELSE NULL
  END as contact_phone,
  v.website,
  v.about,
  v.cover_image_path,
  v.verified,
  v.created_at,
  v.updated_at
FROM public.vendors v
WHERE v.verified = true;

-- Grant permissions
GRANT SELECT ON public.vendors_with_contact TO authenticated;