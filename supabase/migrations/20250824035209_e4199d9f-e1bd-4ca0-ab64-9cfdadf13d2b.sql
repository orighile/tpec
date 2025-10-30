
-- Create guests table for event guest management
CREATE TABLE public.guests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  rsvp_status text NOT NULL DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'confirmed', 'declined')),
  meal_preference text DEFAULT 'Not Selected',
  guest_group text,
  table_assignment text,
  plus_one boolean DEFAULT false,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Create policies for guests
CREATE POLICY "Event owners can manage their event guests" 
  ON public.guests 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = guests.event_id 
    AND events.owner_user_id = auth.uid()
  ));

-- Create an index for better performance
CREATE INDEX idx_guests_event_id ON public.guests(event_id);
CREATE INDEX idx_guests_rsvp_status ON public.guests(rsvp_status);

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_guests_updated_at 
  BEFORE UPDATE ON public.guests 
  FOR EACH ROW 
  EXECUTE PROCEDURE update_updated_at_column();
