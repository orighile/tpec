-- Drop and recreate get_public_vendors function with new fields
DROP FUNCTION IF EXISTS public.get_public_vendors();

-- Update vendors table to match CSV schema
ALTER TABLE public.vendors 
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS price_min NUMERIC,
  ADD COLUMN IF NOT EXISTS price_max NUMERIC,
  ADD COLUMN IF NOT EXISTS short_description TEXT,
  ADD COLUMN IF NOT EXISTS profile_url TEXT,
  ADD COLUMN IF NOT EXISTS images TEXT[],
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_vendors_slug ON public.vendors(slug);

-- Recreate get_public_vendors function with new fields
CREATE OR REPLACE FUNCTION public.get_public_vendors()
RETURNS TABLE(
  id uuid, 
  name text, 
  category text, 
  description text, 
  location text, 
  price_range text, 
  about text, 
  cover_image_path text, 
  verified boolean, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone,
  state text,
  city text,
  price_min numeric,
  price_max numeric,
  short_description text,
  profile_url text,
  images text[],
  slug text
) 
LANGUAGE sql
STABLE
SET search_path = 'public'
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
    v.updated_at,
    v.state,
    v.city,
    v.price_min,
    v.price_max,
    v.short_description,
    v.profile_url,
    v.images,
    v.slug
  FROM public.vendors v
  WHERE v.verified = true;
$$;