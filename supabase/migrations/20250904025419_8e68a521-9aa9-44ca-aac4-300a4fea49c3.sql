-- Check if RLS is enabled on guests table
SELECT schemaname, tablename, rowsecurity, forcerowsecurity 
FROM pg_tables 
WHERE tablename = 'guests' AND schemaname = 'public';

-- Check current policies on guests table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'guests' AND schemaname = 'public';

-- Ensure RLS is enabled on guests table
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Drop any overly permissive policies and create secure ones
DROP POLICY IF EXISTS "Event owners can manage their event guests" ON public.guests;

-- Create restrictive policies for guest data access
CREATE POLICY "Event owners can view their event guests"
ON public.guests
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = guests.event_id 
    AND events.owner_user_id = auth.uid()
  )
);

CREATE POLICY "Event owners can insert guests for their events"
ON public.guests
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = guests.event_id 
    AND events.owner_user_id = auth.uid()
  )
);

CREATE POLICY "Event owners can update their event guests"
ON public.guests
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = guests.event_id 
    AND events.owner_user_id = auth.uid()
  )
);

CREATE POLICY "Event owners can delete their event guests"
ON public.guests
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = guests.event_id 
    AND events.owner_user_id = auth.uid()
  )
);