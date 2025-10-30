-- First, let's completely remove all custom views and start fresh
DROP VIEW IF EXISTS public.vendors_with_contact CASCADE;
DROP VIEW IF EXISTS public.vendors_public CASCADE;

-- Check if there are any remaining views in public schema
SELECT schemaname, viewname FROM pg_views WHERE schemaname = 'public';

-- Check for any policies or objects that might reference security definer
SELECT tablename, policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE schemaname = 'public';

-- Let's not create any views for now - just use the base tables with proper RLS
-- This eliminates any potential security definer view issues