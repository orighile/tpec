-- Final security policy cleanup to eliminate conflicts and warnings

-- 1. Fix conflicting policies on vendors table
DROP POLICY IF EXISTS "Vendors - Public access via function only" ON public.vendors;

-- Don't create a public policy at all for vendors table - force function-only access
-- Only authenticated users and owners can access directly
-- Public access must go through get_public_vendors() function which filters sensitive data

-- 2. Fix conflicting policies on reviews table  
DROP POLICY IF EXISTS "Authenticated users can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public cannot view reviews" ON public.reviews;

-- Create single clear policy for reviews - only authenticated users can view
CREATE POLICY "Only authenticated users can view reviews"
ON public.reviews
FOR SELECT
TO authenticated
USING (true);

-- 3. Add additional comment to clarify security model
COMMENT ON FUNCTION public.get_public_vendors() IS 
'SECURITY: This function is the ONLY authorized way for public users to access vendor data. Contact information is deliberately excluded. Direct table access is blocked by RLS policies.';

COMMENT ON TABLE public.reviews IS 
'SECURITY: Reviews are only accessible to authenticated users to prevent data harvesting.';

-- 4. Ensure guest table security is explicitly documented
COMMENT ON POLICY "Event owners can view their event guests" ON public.guests IS 
'SECURITY: Guest data access is restricted to verified event ownership only. Contains PII and must remain protected.';

-- Update the guests policy to be more explicit about event ownership verification
DROP POLICY IF EXISTS "Event owners can view their event guests" ON public.guests;

CREATE POLICY "Verified event owners can view their event guests only"
ON public.guests
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = guests.event_id 
    AND events.owner_user_id = auth.uid()
    AND auth.uid() IS NOT NULL
  )
);