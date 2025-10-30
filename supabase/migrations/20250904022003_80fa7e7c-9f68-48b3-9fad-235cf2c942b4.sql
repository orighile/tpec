-- Fix the security definer issue by making the function more restrictive
-- and removing SECURITY DEFINER to use the caller's permissions
CREATE OR REPLACE FUNCTION public.can_access_vendor_contact(vendor_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  -- Check if current user owns the vendor (uses caller's permissions/RLS)
  SELECT EXISTS (
    SELECT 1 FROM vendors 
    WHERE id = vendor_id 
    AND owner_user_id = auth.uid()
  );
$$;