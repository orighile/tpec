-- Create tables to replace localStorage-based systems with database persistence

-- 1. Crew Members table
CREATE TABLE public.crew_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  tasks TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on crew_members
ALTER TABLE public.crew_members ENABLE ROW LEVEL SECURITY;

-- RLS policies for crew_members
CREATE POLICY "Event owners can manage their crew members"
ON public.crew_members
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = crew_members.event_id 
    AND events.owner_user_id = auth.uid()
  )
);

-- 2. Seating Arrangements table
CREATE TABLE public.seating_arrangements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  tables JSONB NOT NULL DEFAULT '[]',
  fixed_elements JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on seating_arrangements
ALTER TABLE public.seating_arrangements ENABLE ROW LEVEL SECURITY;

-- RLS policies for seating_arrangements
CREATE POLICY "Event owners can manage their seating arrangements"
ON public.seating_arrangements
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = seating_arrangements.event_id 
    AND events.owner_user_id = auth.uid()
  )
);

-- 3. Budget Items table
CREATE TABLE public.budget_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  estimated_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  actual_amount NUMERIC(10,2) DEFAULT 0,
  paid_amount NUMERIC(10,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'booked', 'paid', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on budget_items
ALTER TABLE public.budget_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for budget_items
CREATE POLICY "Event owners can manage their budget items"
ON public.budget_items
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = budget_items.event_id 
    AND events.owner_user_id = auth.uid()
  )
);

-- 4. Checklist Items table
CREATE TABLE public.checklist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  completed BOOLEAN NOT NULL DEFAULT false,
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  assigned_to TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on checklist_items
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for checklist_items
CREATE POLICY "Event owners can manage their checklist items"
ON public.checklist_items
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = checklist_items.event_id 
    AND events.owner_user_id = auth.uid()
  )
);

-- 5. Analytics Data table for real analytics instead of mock data
CREATE TABLE public.event_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  metric_type TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  date_recorded DATE NOT NULL DEFAULT CURRENT_DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on event_analytics
ALTER TABLE public.event_analytics ENABLE ROW LEVEL SECURITY;

-- RLS policies for event_analytics
CREATE POLICY "Event owners can view their analytics"
ON public.event_analytics
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = event_analytics.event_id 
    AND events.owner_user_id = auth.uid()
  )
);

-- System can insert analytics data
CREATE POLICY "System can insert analytics"
ON public.event_analytics
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Add updated_at triggers for all new tables
CREATE TRIGGER update_crew_members_updated_at
  BEFORE UPDATE ON public.crew_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_seating_arrangements_updated_at
  BEFORE UPDATE ON public.seating_arrangements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_budget_items_updated_at
  BEFORE UPDATE ON public.budget_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_checklist_items_updated_at
  BEFORE UPDATE ON public.checklist_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_crew_members_event_id ON public.crew_members(event_id);
CREATE INDEX idx_crew_members_user_id ON public.crew_members(user_id);

CREATE INDEX idx_seating_arrangements_event_id ON public.seating_arrangements(event_id);
CREATE INDEX idx_seating_arrangements_user_id ON public.seating_arrangements(user_id);

CREATE INDEX idx_budget_items_event_id ON public.budget_items(event_id);
CREATE INDEX idx_budget_items_user_id ON public.budget_items(user_id);
CREATE INDEX idx_budget_items_status ON public.budget_items(status);

CREATE INDEX idx_checklist_items_event_id ON public.checklist_items(event_id);
CREATE INDEX idx_checklist_items_user_id ON public.checklist_items(user_id);
CREATE INDEX idx_checklist_items_completed ON public.checklist_items(completed);

CREATE INDEX idx_event_analytics_event_id ON public.event_analytics(event_id);
CREATE INDEX idx_event_analytics_date ON public.event_analytics(date_recorded);