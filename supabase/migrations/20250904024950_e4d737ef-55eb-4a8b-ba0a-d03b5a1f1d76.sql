-- Find functions with security definer property
SELECT 
    n.nspname as schema_name,
    p.proname as function_name,
    p.prosecdef as is_security_definer
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.prosecdef = true;

-- Look for any system functions that might be causing this
SELECT 
    proname, 
    prosecdef,
    pronamespace
FROM pg_proc 
WHERE prosecdef = true 
AND pronamespace IN (
    SELECT oid FROM pg_namespace 
    WHERE nspname IN ('public', 'auth', 'storage', 'supabase_functions')
);

-- Drop the existing trigger function that may have security definer
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Recreate the trigger function without security definer
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;