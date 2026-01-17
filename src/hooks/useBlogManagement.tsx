import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useToast } from "@/hooks/use-toast";

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  category_id?: string;
  author_id: string;
  published: boolean;
  featured: boolean;
  cover_image_path?: string;
  read_time: number;
  views: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
  category?: BlogCategory;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  created_at: string;
}

export interface BlogComment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

export const useBlogManagement = () => {
  const { user } = useAuth();
  const { handleError, handleSuccess } = useErrorHandler();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch published blog posts
  const useBlogPosts = () => {
    return useQuery({
      queryKey: ["blog-posts"],
      queryFn: async (): Promise<BlogPost[]> => {
        const { data, error } = await supabase
          .from("blog_posts")
          .select(`
            *,
            category:blog_categories(*)
          `)
          .eq("published", true)
          .order("published_at", { ascending: false });

        if (error) throw error;
        return (data || []) as unknown as BlogPost[];
      },
    });
  };

  // Fetch blog categories
  const useBlogCategories = () => {
    return useQuery({
      queryKey: ["blog-categories"],
      queryFn: async (): Promise<BlogCategory[]> => {
        const { data, error } = await supabase
          .from("blog_categories")
          .select("*")
          .order("name");

        if (error) throw error;
        return data || [];
      },
    });
  };

  // Fetch single blog post by slug
  const useBlogPost = (slug: string) => {
    return useQuery({
      queryKey: ["blog-post", slug],
      queryFn: async (): Promise<BlogPost | null> => {
        const { data, error } = await supabase
          .from("blog_posts")
          .select(`
            *,
            category:blog_categories(*)
          `)
          .eq("slug", slug)
          .eq("published", true)
          .single();

        if (error) {
          if (error.code === 'PGRST116') return null; // Not found
          throw error;
        }

        // Increment view count
        if (data) {
          await supabase
            .from("blog_posts")
            .update({ views: data.views + 1 })
            .eq("id", data.id);
        }

        return data as unknown as BlogPost;
      },
      enabled: !!slug,
    });
  };

  // Fetch comments for a post
  const useBlogComments = (postId: string) => {
    return useQuery({
      queryKey: ["blog-comments", postId],
      queryFn: async (): Promise<BlogComment[]> => {
        const { data, error } = await supabase
          .from("blog_comments")
          .select("*")
          .eq("post_id", postId)
          .order("created_at", { ascending: true });

        if (error) throw error;
        return data || [];
      },
      enabled: !!postId,
    });
  };

  // Create blog post (admin only)
  const createBlogPost = useMutation({
    mutationFn: async (postData: Omit<BlogPost, "id" | "created_at" | "updated_at" | "views">) => {
      if (!user?.id) throw new Error("Authentication required");
      
      const { data, error } = await supabase
        .from("blog_posts")
        .insert({
          ...postData,
          author_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      handleSuccess("Blog post created successfully!", "Success");
    },
    onError: (error) => {
      handleError(error, "creating blog post");
    },
  });

  // Create blog comment
  const createBlogComment = useMutation({
    mutationFn: async ({ postId, content, parentId }: { postId: string; content: string; parentId?: string }) => {
      if (!user?.id) throw new Error("Authentication required");

      const { data, error } = await supabase
        .from("blog_comments")
        .insert({
          post_id: postId,
          content,
          parent_id: parentId,
          author_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blog-comments", variables.postId] });
      handleSuccess("Comment added successfully!", "Success");
    },
    onError: (error) => {
      handleError(error, "adding comment");
    },
  });

  // Create blog category (admin only)
  const createBlogCategory = useMutation({
    mutationFn: async (categoryData: Omit<BlogCategory, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("blog_categories")
        .insert(categoryData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
      handleSuccess("Category created successfully!", "Success");
    },
    onError: (error) => {
      handleError(error, "creating category");
    },
  });

  return {
    useBlogPosts,
    useBlogCategories,
    useBlogPost,
    useBlogComments,
    createBlogPost,
    createBlogComment,
    createBlogCategory,
  };
};