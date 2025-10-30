-- Verify RLS is enabled on guests table
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as rls_enabled,
    tableowner
FROM pg_tables 
WHERE tablename = 'guests' AND schemaname = 'public';

-- Check all current policies on guests table
SELECT 
    schemaname,
    tablename, 
    policyname,
    permissive,
    roles,
    cmd as command,
    qual as using_expression,
    with_check
FROM pg_policies 
WHERE tablename = 'guests' AND schemaname = 'public'
ORDER BY cmd, policyname;

-- Test the policies by showing what a sample query would return
-- This helps verify the RLS is working correctly
EXPLAIN (ANALYZE false, BUFFERS false, COSTS false) 
SELECT email, phone, full_name 
FROM guests 
WHERE event_id = '00000000-0000-0000-0000-000000000000';