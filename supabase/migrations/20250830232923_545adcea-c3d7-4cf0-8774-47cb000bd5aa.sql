-- Drop and recreate the view to ensure it's not flagged as SECURITY DEFINER
DROP VIEW IF EXISTS public.vendors_public CASCADE;

-- Recreate the view with explicit SECURITY INVOKER
CREATE VIEW public.vendors_public 
WITH (security_invoker = true) AS
SELECT 
  id,
  name,
  category,
  description,
  location,
  price_range,
  website,
  about,
  cover_image_path,
  verified,
  created_at,
  updated_at
FROM public.vendors
WHERE verified = true;

-- Grant permissions
GRANT SELECT ON public.vendors_public TO anon, authenticated;