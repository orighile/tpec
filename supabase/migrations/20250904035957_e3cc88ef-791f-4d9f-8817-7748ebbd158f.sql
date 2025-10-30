-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.get_public_vendors()
RETURNS TABLE (
  id uuid,
  name text,
  category text,
  description text,
  location text,
  price_range text,
  about text,
  cover_image_path text,
  verified boolean,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY INVOKER
STABLE
SET search_path = public
AS $$
  SELECT 
    v.id,
    v.name,
    v.category,
    v.description,
    v.location,
    v.price_range,
    v.about,
    v.cover_image_path,
    v.verified,
    v.created_at,
    v.updated_at
  FROM public.vendors v
  WHERE v.verified = true;
$$;