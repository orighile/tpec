
-- Allow inserting prime_members without requiring foreign key to auth.users
-- by dropping and recreating the constraint to allow NULL or non-existent user_ids for demo data
-- First, let's check if there's a foreign key and drop it if exists

-- Drop existing foreign key constraint if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'prime_members_user_id_fkey' 
    AND table_name = 'prime_members'
  ) THEN
    ALTER TABLE public.prime_members DROP CONSTRAINT prime_members_user_id_fkey;
  END IF;
END $$;

-- Update the SELECT RLS policy to also allow viewing members when browsing (is_active = true OR user owns the record)
DROP POLICY IF EXISTS "Anyone can view active prime members" ON public.prime_members;

CREATE POLICY "Anyone can view active prime members" 
ON public.prime_members 
FOR SELECT 
USING (is_active = true OR auth.uid() = user_id);
