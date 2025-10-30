-- Enable RLS on vendors_with_contact table
ALTER TABLE public.vendors_with_contact ENABLE ROW LEVEL SECURITY;

-- Policy 1: Vendor owners can view their own contact information
CREATE POLICY "Vendor owners can view their own contact info"
ON public.vendors_with_contact
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.vendors 
    WHERE vendors.id = vendors_with_contact.id 
    AND vendors.owner_user_id = auth.uid()
  )
);

-- Policy 2: Vendor owners can manage their own contact information
CREATE POLICY "Vendor owners can manage their contact info" 
ON public.vendors_with_contact
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.vendors 
    WHERE vendors.id = vendors_with_contact.id 
    AND vendors.owner_user_id = auth.uid()
  )
);

-- Policy 3: Authenticated users can view contact info for vendors they can contact
-- This uses the existing can_access_vendor_contact function
CREATE POLICY "Authenticated users can view contactable vendor info"
ON public.vendors_with_contact
FOR SELECT
TO authenticated
USING (
  public.can_access_vendor_contact(vendors_with_contact.id)
  OR
  EXISTS (
    SELECT 1 FROM public.vendors 
    WHERE vendors.id = vendors_with_contact.id 
    AND vendors.verified = true
  )
);