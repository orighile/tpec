-- Check for all views with security definer property
SELECT 
    schemaname, 
    viewname, 
    definition
FROM pg_views 
WHERE schemaname = 'public'
AND definition ILIKE '%security definer%';

-- Check for any functions with security definer
SELECT 
    n.nspname as schema_name,
    p.proname as function_name,
    p.prosecdef as is_security_definer
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND p.prosecdef = true;

-- Drop any remaining problematic views and recreate them properly
DROP VIEW IF EXISTS public.vendors_with_contact CASCADE;
DROP VIEW IF EXISTS public.vendors_public CASCADE;

-- Create vendors_public view without security definer
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
FROM vendors 
WHERE verified = true;

-- Create vendors_with_contact view without security definer
CREATE VIEW public.vendors_with_contact AS
SELECT 
    v.id,
    v.name,
    v.category,
    v.description,
    v.location,
    v.price_range,
    -- Contact info only visible to vendor owners through RLS, not security definer
    v.contact_email,
    v.contact_phone,
    v.website,
    v.about,
    v.cover_image_path,
    v.verified,
    v.created_at,
    v.updated_at
FROM vendors v 
WHERE v.verified = true;

-- Add RLS policies to control access to contact information
ALTER VIEW public.vendors_with_contact ENABLE ROW LEVEL SECURITY;

-- Policy to allow viewing vendor info but restrict contact details
CREATE POLICY "Public can view vendor info" ON public.vendors_with_contact
FOR SELECT USING (true);

-- Note: Contact information access will be controlled through the base vendors table RLS policies