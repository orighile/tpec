-- Create consultation_bookings table
CREATE TABLE public.consultation_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(user_id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  consultation_type TEXT NOT NULL DEFAULT 'meet-and-greet',
  event_type TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create booking_availability table
CREATE TABLE public.booking_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TEXT NOT NULL DEFAULT '09:00',
  end_time TEXT NOT NULL DEFAULT '17:00',
  is_available BOOLEAN NOT NULL DEFAULT true,
  slot_duration_minutes INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blocked_dates table
CREATE TABLE public.blocked_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blocked_date DATE NOT NULL UNIQUE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.consultation_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for consultation_bookings
-- Anyone can create a booking (guest booking allowed)
CREATE POLICY "Anyone can create bookings" 
ON public.consultation_bookings 
FOR INSERT 
WITH CHECK (true);

-- Users can view their own bookings
CREATE POLICY "Users can view their own bookings" 
ON public.consultation_bookings 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can update their own bookings
CREATE POLICY "Users can update their own bookings" 
ON public.consultation_bookings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for booking_availability (public read)
CREATE POLICY "Anyone can view availability" 
ON public.booking_availability 
FOR SELECT 
USING (true);

-- RLS Policies for blocked_dates (public read)
CREATE POLICY "Anyone can view blocked dates" 
ON public.blocked_dates 
FOR SELECT 
USING (true);

-- Create trigger for updating timestamps
CREATE TRIGGER update_consultation_bookings_updated_at
BEFORE UPDATE ON public.consultation_bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_booking_availability_updated_at
BEFORE UPDATE ON public.booking_availability
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default availability (Monday-Friday, 9am-5pm, 30-min slots)
INSERT INTO public.booking_availability (day_of_week, start_time, end_time, is_available, slot_duration_minutes)
VALUES 
  (1, '09:00', '17:00', true, 30),  -- Monday
  (2, '09:00', '17:00', true, 30),  -- Tuesday
  (3, '09:00', '17:00', true, 30),  -- Wednesday
  (4, '09:00', '17:00', true, 30),  -- Thursday
  (5, '09:00', '17:00', true, 30),  -- Friday
  (6, '10:00', '14:00', true, 30),  -- Saturday (shorter hours)
  (0, '00:00', '00:00', false, 30); -- Sunday (closed)