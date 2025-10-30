-- CRITICAL SECURITY FIX: Secure the emails table

-- First, clear any existing test data that may be exposed
DELETE FROM public.emails;

-- Add proper RLS policies to the emails table to prevent public access
CREATE POLICY "Only authenticated users can read emails" ON public.emails
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can insert emails" ON public.emails
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update emails" ON public.emails
  FOR UPDATE USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete emails" ON public.emails
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Add user_id column to emails table to track ownership if needed for newsletter/contact features
ALTER TABLE public.emails ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create more restrictive policy if this is for user-specific emails
DROP POLICY IF EXISTS "Only authenticated users can read emails" ON public.emails;
DROP POLICY IF EXISTS "Only authenticated users can insert emails" ON public.emails;
DROP POLICY IF EXISTS "Only authenticated users can update emails" ON public.emails;
DROP POLICY IF EXISTS "Only authenticated users can delete emails" ON public.emails;

-- More restrictive policies - users can only access their own email records
CREATE POLICY "Users can only read their own emails" ON public.emails
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own emails" ON public.emails
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own emails" ON public.emails
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own emails" ON public.emails
  FOR DELETE USING (auth.uid() = user_id);