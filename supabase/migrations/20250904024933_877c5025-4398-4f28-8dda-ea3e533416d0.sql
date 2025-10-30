-- Find all views in the system that might have security definer
SELECT 
    schemaname,
    viewname,
    viewowner,
    definition
FROM pg_views 
WHERE definition ILIKE '%security definer%'
OR definition ILIKE '%security_definer%';

-- Find any remaining functions with security definer
SELECT 
    n.nspname as schema_name,
    p.proname as function_name,
    p.prosecdef as is_security_definer,
    pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.prosecdef = true;

-- Check pg_policies that might reference security definer functions
SELECT 
    schemaname,
    tablename, 
    policyname,
    definition
FROM pg_policies
WHERE definition ILIKE '%security definer%'
OR definition ILIKE '%security_definer%';