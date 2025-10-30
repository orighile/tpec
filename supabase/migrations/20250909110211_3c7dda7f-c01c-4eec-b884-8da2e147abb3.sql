-- Further restrict vendor table access to hide contact information from public

-- Drop all existing SELECT policies for vendors table
DROP POLICY IF EXISTS "Public can view basic verified vendor info" ON public.vendors;
DROP POLICY IF EXISTS "Public can view verified vendor basic info" ON public.vendors;
DROP POLICY IF EXISTS "Public can view basic vendor info only" ON public.vendors;

-- Create a restrictive policy that excludes contact information columns entirely
-- This policy will not allow SELECT on contact_email, contact_phone, website columns for public users
CREATE POLICY "Public can view non-sensitive vendor info only"
ON public.vendors
FOR SELECT
TO public
USING (
  verified = true AND
  -- Only allow access to non-sensitive columns through views or functions
  false  -- Force all public access through the get_public_vendors function
);

-- Ensure the function is the only way to access vendor data publicly
COMMENT ON FUNCTION public.get_public_vendors() IS 
'The only authorized method for public access to vendor information. Contact details are excluded for security.';