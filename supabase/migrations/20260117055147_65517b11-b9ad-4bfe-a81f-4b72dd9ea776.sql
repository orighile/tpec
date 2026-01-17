-- Add missing columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT;

-- Add missing columns to blog_categories
ALTER TABLE public.blog_categories ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#6366f1';

-- Add missing columns to blog_posts
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Add foreign key from reviews to vendors
ALTER TABLE public.reviews ADD CONSTRAINT fk_reviews_vendor FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE CASCADE;

-- Create blog_comments table
CREATE TABLE public.blog_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blog comments are viewable by everyone" ON public.blog_comments FOR SELECT USING (true);
CREATE POLICY "Users can create their own comments" ON public.blog_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own comments" ON public.blog_comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own comments" ON public.blog_comments FOR DELETE USING (auth.uid() = author_id);

-- Create invitation_templates table
CREATE TABLE public.invitation_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  template_type TEXT NOT NULL,
  design_data JSONB DEFAULT '{}',
  thumbnail_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  price NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.invitation_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Invitation templates are viewable by everyone" ON public.invitation_templates FOR SELECT USING (true);

-- Create user_invitations table
CREATE TABLE public.user_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  template_id UUID REFERENCES public.invitation_templates(id),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  customizations JSONB DEFAULT '{}',
  delivery_status TEXT DEFAULT 'draft',
  sent_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own invitations" ON public.user_invitations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own invitations" ON public.user_invitations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own invitations" ON public.user_invitations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own invitations" ON public.user_invitations FOR DELETE USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_blog_comments_updated_at BEFORE UPDATE ON public.blog_comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_invitation_templates_updated_at BEFORE UPDATE ON public.invitation_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_invitations_updated_at BEFORE UPDATE ON public.user_invitations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();