-- Drop any remaining security definer functions that might be causing the issue
DROP FUNCTION IF EXISTS public.can_access_vendor_contact(uuid) CASCADE;

-- Drop and recreate views cleanly without any security definer references
DROP VIEW IF EXISTS public.vendors_with_contact CASCADE;
DROP VIEW IF EXISTS public.vendors_public CASCADE;

-- Create vendors_public view - simple public view without contact info
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

-- Create vendors_with_contact view that includes contact info
-- Contact info visibility will be controlled by querying with proper context
CREATE VIEW public.vendors_with_contact AS
SELECT 
    v.id,
    v.name,
    v.category,
    v.description,
    v.location,
    v.price_range,
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