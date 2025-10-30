-- Create app_role enum for role management
CREATE TYPE public.app_role AS ENUM ('admin', 'organizer', 'vendor', 'user');

-- Add role column to profiles table with default 'user' role
ALTER TABLE public.profiles 
ADD COLUMN role public.app_role NOT NULL DEFAULT 'user';

-- Create user_roles table for additional role management if needed
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    assigned_by UUID REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Create security definer function to check if user has role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = _user_id AND role = _role
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Create security definer function to check if user has any of multiple roles
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id UUID, _roles public.app_role[])
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = _user_id AND role = ANY(_roles)
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Update profiles RLS policies to include role-based access
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Users can view their own profile or admins can view all profiles
CREATE POLICY "Users can view profiles with role check" ON public.profiles
FOR SELECT USING (
  auth.uid() = id OR 
  public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Users can update their own profile (but not their role)
CREATE POLICY "Users can update their profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND 
  (OLD.role = NEW.role OR public.has_role(auth.uid(), 'admin'::public.app_role))
);

-- Create RLS policies for user_roles table
CREATE POLICY "Admins can manage all user roles" ON public.user_roles
FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING (user_id = auth.uid());

-- Add audit logging table for security events
CREATE TABLE public.security_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    event_type TEXT NOT NULL,
    event_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on security_logs
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view security logs
CREATE POLICY "Admins can view security logs" ON public.security_logs
FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
    _event_type TEXT,
    _event_data JSONB DEFAULT NULL,
    _user_id UUID DEFAULT auth.uid()
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO public.security_logs (user_id, event_type, event_data)
    VALUES (_user_id, _event_type, _event_data)
    RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;