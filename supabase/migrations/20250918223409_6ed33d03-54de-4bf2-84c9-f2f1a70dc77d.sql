-- Create blog management system tables
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  slug TEXT UNIQUE NOT NULL,
  category_id UUID,
  author_id UUID NOT NULL,
  published BOOLEAN NOT NULL DEFAULT false,
  featured BOOLEAN NOT NULL DEFAULT false,
  cover_image_path TEXT,
  read_time INTEGER DEFAULT 5,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE public.blog_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.blog_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL,
  author_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create digital invitations system tables
CREATE TABLE public.invitation_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  template_type TEXT NOT NULL DEFAULT 'wedding',
  design_data JSONB NOT NULL DEFAULT '{}',
  preview_image_path TEXT,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  price NUMERIC DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.user_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_id UUID,
  template_id UUID,
  title TEXT NOT NULL,
  custom_message TEXT,
  design_data JSONB NOT NULL DEFAULT '{}',
  recipient_data JSONB NOT NULL DEFAULT '[]',
  sent_count INTEGER DEFAULT 0,
  delivery_status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE
);

-- Create gift registry system tables
CREATE TABLE public.gift_registries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.gift_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  registry_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  quantity_requested INTEGER NOT NULL DEFAULT 1,
  quantity_purchased INTEGER NOT NULL DEFAULT 0,
  image_path TEXT,
  store_url TEXT,
  priority TEXT NOT NULL DEFAULT 'medium',
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.gift_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gift_item_id UUID NOT NULL,
  purchaser_id UUID,
  purchaser_name TEXT NOT NULL,
  purchaser_email TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create social content system tables
CREATE TABLE public.social_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_id UUID,
  content TEXT NOT NULL,
  image_path TEXT,
  platform TEXT,
  external_id TEXT,
  likes_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  is_trending BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.trending_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  trend_score INTEGER NOT NULL DEFAULT 0,
  image_path TEXT,
  source_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI conversation system tables
CREATE TABLE public.ai_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_id UUID,
  title TEXT,
  context_data JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.ai_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitation_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_registries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trending_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

-- Blog RLS Policies
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts
FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage all blog posts" ON public.blog_posts
FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Anyone can view blog categories" ON public.blog_categories
FOR SELECT USING (true);

CREATE POLICY "Admins can manage blog categories" ON public.blog_categories
FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Anyone can view blog comments" ON public.blog_comments
FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON public.blog_comments
FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their comments" ON public.blog_comments
FOR UPDATE USING (auth.uid() = author_id);

-- Invitation RLS Policies
CREATE POLICY "Anyone can view public templates" ON public.invitation_templates
FOR SELECT USING (true);

CREATE POLICY "Users can create templates" ON public.invitation_templates
FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can manage their invitations" ON public.user_invitations
FOR ALL USING (auth.uid() = user_id);

-- Gift Registry RLS Policies
CREATE POLICY "Users can manage their registries" ON public.gift_registries
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public registries" ON public.gift_registries
FOR SELECT USING (is_public = true);

CREATE POLICY "Registry owners can manage gift items" ON public.gift_items
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.gift_registries 
  WHERE id = gift_items.registry_id AND user_id = auth.uid()
));

CREATE POLICY "Anyone can view gift items for public registries" ON public.gift_items
FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.gift_registries 
  WHERE id = gift_items.registry_id AND is_public = true
));

CREATE POLICY "Anyone can create gift purchases" ON public.gift_purchases
FOR INSERT WITH CHECK (true);

CREATE POLICY "Registry owners can view purchases" ON public.gift_purchases
FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.gift_items gi
  JOIN public.gift_registries gr ON gi.registry_id = gr.id
  WHERE gi.id = gift_purchases.gift_item_id AND gr.user_id = auth.uid()
));

-- Social Content RLS Policies
CREATE POLICY "Users can manage their social posts" ON public.social_posts
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view social posts" ON public.social_posts
FOR SELECT USING (true);

CREATE POLICY "Anyone can view trending items" ON public.trending_items
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage trending items" ON public.trending_items
FOR ALL USING (public.get_current_user_role() = 'admin');

-- AI Conversation RLS Policies
CREATE POLICY "Users can manage their conversations" ON public.ai_conversations
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their messages" ON public.ai_messages
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.ai_conversations 
  WHERE id = ai_messages.conversation_id AND user_id = auth.uid()
));

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category_id);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published, published_at);
CREATE INDEX idx_blog_comments_post ON public.blog_comments(post_id);
CREATE INDEX idx_user_invitations_user ON public.user_invitations(user_id);
CREATE INDEX idx_gift_items_registry ON public.gift_items(registry_id);
CREATE INDEX idx_gift_purchases_item ON public.gift_purchases(gift_item_id);
CREATE INDEX idx_social_posts_trending ON public.social_posts(is_trending);
CREATE INDEX idx_ai_messages_conversation ON public.ai_messages(conversation_id);

-- Add triggers for updated_at columns
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_comments_updated_at
  BEFORE UPDATE ON public.blog_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invitation_templates_updated_at
  BEFORE UPDATE ON public.invitation_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_invitations_updated_at
  BEFORE UPDATE ON public.user_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gift_registries_updated_at
  BEFORE UPDATE ON public.gift_registries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gift_items_updated_at
  BEFORE UPDATE ON public.gift_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_social_posts_updated_at
  BEFORE UPDATE ON public.social_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trending_items_updated_at
  BEFORE UPDATE ON public.trending_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_conversations_updated_at
  BEFORE UPDATE ON public.ai_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();