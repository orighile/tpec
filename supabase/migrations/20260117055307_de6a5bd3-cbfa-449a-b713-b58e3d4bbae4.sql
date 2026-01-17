-- Add missing columns to checklist_items for compatibility
ALTER TABLE public.checklist_items ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.events(id) ON DELETE CASCADE;
ALTER TABLE public.checklist_items ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.checklist_items ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT false;
ALTER TABLE public.checklist_items ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.checklist_items ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.checklist_items ADD COLUMN IF NOT EXISTS assigned_to TEXT;
ALTER TABLE public.checklist_items ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.checklist_items ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Update RLS policies for checklist_items to allow direct access
DROP POLICY IF EXISTS "Users can view their own checklist items" ON public.checklist_items;
DROP POLICY IF EXISTS "Users can create checklist items for their checklists" ON public.checklist_items;
DROP POLICY IF EXISTS "Users can update their own checklist items" ON public.checklist_items;
DROP POLICY IF EXISTS "Users can delete their own checklist items" ON public.checklist_items;

CREATE POLICY "Users can view their own checklist items" ON public.checklist_items FOR SELECT USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM public.checklists WHERE checklists.id = checklist_items.checklist_id AND checklists.user_id = auth.uid())
);
CREATE POLICY "Users can create checklist items" ON public.checklist_items FOR INSERT WITH CHECK (
  auth.uid() = user_id OR
  EXISTS (SELECT 1 FROM public.checklists WHERE checklists.id = checklist_items.checklist_id AND checklists.user_id = auth.uid())
);
CREATE POLICY "Users can update their own checklist items" ON public.checklist_items FOR UPDATE USING (
  auth.uid() = user_id OR
  EXISTS (SELECT 1 FROM public.checklists WHERE checklists.id = checklist_items.checklist_id AND checklists.user_id = auth.uid())
);
CREATE POLICY "Users can delete their own checklist items" ON public.checklist_items FOR DELETE USING (
  auth.uid() = user_id OR
  EXISTS (SELECT 1 FROM public.checklists WHERE checklists.id = checklist_items.checklist_id AND checklists.user_id = auth.uid())
);

-- Make checklist_id nullable since items can be associated directly with events
ALTER TABLE public.checklist_items ALTER COLUMN checklist_id DROP NOT NULL;