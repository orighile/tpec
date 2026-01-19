-- Create enum for prime membership types
CREATE TYPE public.prime_membership_type AS ENUM ('vendor', 'planner');

-- Create prime_members table for tracking paid memberships
CREATE TABLE public.prime_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    membership_type prime_membership_type NOT NULL,
    business_name TEXT NOT NULL,
    business_description TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    video_url TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    website TEXT,
    location TEXT,
    category TEXT,
    services TEXT[],
    price_range TEXT,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, membership_type)
);

-- Create prime_gallery table for additional images
CREATE TABLE public.prime_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prime_member_id UUID NOT NULL REFERENCES public.prime_members(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prime_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prime_gallery ENABLE ROW LEVEL SECURITY;

-- RLS Policies for prime_members
-- Anyone can view active prime members
CREATE POLICY "Anyone can view active prime members"
ON public.prime_members FOR SELECT
USING (is_active = true);

-- Users can manage their own prime membership
CREATE POLICY "Users can insert their own prime membership"
ON public.prime_members FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prime membership"
ON public.prime_members FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prime membership"
ON public.prime_members FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for prime_gallery
-- Anyone can view gallery images of active members
CREATE POLICY "Anyone can view prime gallery"
ON public.prime_gallery FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.prime_members 
    WHERE id = prime_member_id AND is_active = true
));

-- Users can manage their own gallery
CREATE POLICY "Users can insert their gallery images"
ON public.prime_gallery FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.prime_members 
    WHERE id = prime_member_id AND user_id = auth.uid()
));

CREATE POLICY "Users can update their gallery images"
ON public.prime_gallery FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM public.prime_members 
    WHERE id = prime_member_id AND user_id = auth.uid()
));

CREATE POLICY "Users can delete their gallery images"
ON public.prime_gallery FOR DELETE
USING (EXISTS (
    SELECT 1 FROM public.prime_members 
    WHERE id = prime_member_id AND user_id = auth.uid()
));

-- Create storage bucket for prime uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('prime-uploads', 'prime-uploads', true, 10485760); -- 10MB limit

-- Storage policies for prime uploads
CREATE POLICY "Anyone can view prime uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'prime-uploads');

CREATE POLICY "Authenticated users can upload to prime-uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'prime-uploads' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own uploads"
ON storage.objects FOR UPDATE
USING (bucket_id = 'prime-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own uploads"
ON storage.objects FOR DELETE
USING (bucket_id = 'prime-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Trigger for updated_at
CREATE TRIGGER update_prime_members_updated_at
BEFORE UPDATE ON public.prime_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();