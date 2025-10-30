
-- Enable social auth providers in Supabase
-- Note: This SQL is for reference - actual OAuth provider configuration 
-- must be done through the Supabase Dashboard under Authentication > Providers

-- The following providers need to be configured in the Supabase Dashboard:
-- 1. Google OAuth
-- 2. Facebook OAuth  
-- 3. Twitter/X OAuth

-- No database changes are needed for social auth as Supabase handles this automatically
-- Users will still be created in auth.users and can be linked to profiles table

-- Ensure the profiles table can handle social auth users
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'email',
ADD COLUMN IF NOT EXISTS provider_id TEXT;

-- Update the handle_new_user function to work with social auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url, provider, provider_id)
  VALUES (
    new.id, 
    COALESCE(new.email, new.raw_user_meta_data->>'preferred_username', new.raw_user_meta_data->>'user_name'),
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'),
    COALESCE(new.raw_user_meta_data->>'provider', 'email'),
    new.raw_user_meta_data->>'provider_id'
  );
  RETURN new;
END;
$function$;
