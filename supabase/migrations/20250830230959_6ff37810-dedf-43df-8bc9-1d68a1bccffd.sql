-- Fix the security definer view issue
-- Drop the problematic view and recreate without SECURITY DEFINER

DROP VIEW IF EXISTS public.vendors_public;

-- Create the view without SECURITY DEFINER (uses SECURITY INVOKER by default)
CREATE VIEW public.vendors_public AS
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

-- Grant appropriate permissions
GRANT SELECT ON public.vendors_public TO anon, authenticated;