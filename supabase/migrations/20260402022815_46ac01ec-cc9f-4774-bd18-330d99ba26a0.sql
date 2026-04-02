
-- 1. Allow public to view reviews (not just authenticated)
DROP POLICY IF EXISTS "Only authenticated users can view reviews" ON public.reviews;
CREATE POLICY "Anyone can view reviews"
ON public.reviews FOR SELECT
TO public
USING (true);

-- 2. Create a SECURITY DEFINER function for system notifications
CREATE OR REPLACE FUNCTION public.create_notification(
  _user_id uuid,
  _title text,
  _message text DEFAULT NULL,
  _type text DEFAULT 'general',
  _metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _id uuid;
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type, metadata)
  VALUES (_user_id, _title, _message, _type, _metadata)
  RETURNING id INTO _id;
  RETURN _id;
END;
$$;

-- 3. Clean up redundant vendor SELECT policies (keep the ALL + one public SELECT)
DROP POLICY IF EXISTS "Vendor owners can view full vendor details" ON public.vendors;
DROP POLICY IF EXISTS "Vendor owners can view their complete vendor details" ON public.vendors;
