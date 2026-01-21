-- Phase 1: Fix Critical Data Exposure

-- 1.1 Tighten profiles table RLS policy
-- Drop the existing overly permissive SELECT policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;

-- Create a new restrictive policy - users can only view their own profile
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = user_id);

-- 1.2 Fix consultation_bookings SELECT policy
-- Drop the existing policy that exposes anonymous bookings
DROP POLICY IF EXISTS "Users can view their own bookings" ON consultation_bookings;

-- New policy: users see own bookings, anonymous bookings only visible to admins
CREATE POLICY "Users can view their own bookings"
ON consultation_bookings FOR SELECT
USING (auth.uid() = user_id);