-- Fix the handle_new_user function to include search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
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
$$;