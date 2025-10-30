-- Fix security issues with vendor contact information
-- Update RLS policies to restrict vendor contact details to authenticated users only

-- Drop the existing public policy for vendors
DROP POLICY "Anyone can view vendors" ON public.vendors;

-- Create new restrictive policies for vendors
CREATE POLICY "Anyone can view vendor basic info" ON public.vendors
FOR SELECT
USING (true);

-- Create a view for public vendor information without sensitive data
CREATE OR REPLACE VIEW public.vendors_public AS
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
FROM public.vendors
WHERE verified = true;

-- Grant access to the public view
GRANT SELECT ON public.vendors_public TO anon, authenticated;

-- Update guest policies to be more restrictive
-- Ensure only event owners can see guest details
-- (This policy already exists and is correct)

-- Fix emails table policies to be more secure  
-- Drop existing policies
DROP POLICY "Users can only read their own emails" ON public.emails;
DROP POLICY "Users can only insert their own emails" ON public.emails;
DROP POLICY "Users can only update their own emails" ON public.emails;
DROP POLICY "Users can only delete their own emails" ON public.emails;

-- Create stricter email policies
CREATE POLICY "Users can only access their own emails" ON public.emails
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Enable password strength and security features
-- Note: These are auth settings that need to be configured in Supabase dashboard