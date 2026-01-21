-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Update consultation_bookings to allow admin access
DROP POLICY IF EXISTS "Users can view their own bookings" ON consultation_bookings;
CREATE POLICY "Users can view their own bookings"
ON consultation_bookings FOR SELECT
USING (
  auth.uid() = user_id 
  OR public.has_role(auth.uid(), 'admin')
);

-- Allow admins to update consultation bookings
CREATE POLICY "Admins can update any booking"
ON consultation_bookings FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete consultation bookings
CREATE POLICY "Admins can delete any booking"
ON consultation_bookings FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view profiles"
ON profiles FOR SELECT
USING (
  auth.uid() = user_id 
  OR public.has_role(auth.uid(), 'admin')
);

-- Allow admins to view all prime members (including inactive)
DROP POLICY IF EXISTS "Anyone can view active prime members" ON prime_members;
CREATE POLICY "View prime members"
ON prime_members FOR SELECT
USING (
  is_active = true 
  OR auth.uid() = user_id 
  OR public.has_role(auth.uid(), 'admin')
);

-- Allow admins to update prime members
CREATE POLICY "Admins can update prime members"
ON prime_members FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all prime payments
CREATE POLICY "Admins can view all payments"
ON prime_payments FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));