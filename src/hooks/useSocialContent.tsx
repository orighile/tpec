import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export interface SocialPost {
  id: string;
  user_id: string;
  event_id?: string;
  content: string;
  image_path?: string;
  platform?: string;
  external_id?: string;
  likes_count: number;
  shares_count: number;
  is_trending: boolean;
  created_at: string;
  updated_at: string;
}

export interface TrendingItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  trend_score: number;
  image_path?: string;
  source_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useSocialContent = () => {
  const { user } = useAuth();
  const { handleError, handleSuccess } = useErrorHandler();
  const queryClient = useQueryClient();

  // Fetch trending social posts
  const useTrendingSocialPosts = () => {
    return useQuery({
      queryKey: ["trending-social-posts"],
      queryFn: async (): Promise<SocialPost[]> => {
        const { data, error } = await supabase
          .from("social_posts")
          .select("*")
          .eq("is_trending", true)
          .order("likes_count", { ascending: false })
          .limit(10);

        if (error) throw error;
        return data || [];
      },
    });
  };

  // Fetch all social posts
  const useSocialPosts = () => {
    return useQuery({
      queryKey: ["social-posts"],
      queryFn: async (): Promise<SocialPost[]> => {
        const { data, error } = await supabase
          .from("social_posts")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;
        return data || [];
      },
    });
  };

  // Fetch user's social posts
  const useUserSocialPosts = () => {
    return useQuery({
      queryKey: ["user-social-posts", user?.id],
      queryFn: async (): Promise<SocialPost[]> => {
        if (!user?.id) return [];

        const { data, error } = await supabase
          .from("social_posts")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data || [];
      },
      enabled: !!user?.id,
    });
  };

  // Fetch trending items
  const useTrendingItems = () => {
    return useQuery({
      queryKey: ["trending-items"],
      queryFn: async (): Promise<TrendingItem[]> => {
        const { data, error } = await supabase
          .from("trending_items")
          .select("*")
          .eq("is_active", true)
          .order("trend_score", { ascending: false })
          .limit(20);

        if (error) throw error;
        return data || [];
      },
    });
  };

  // Create social post
  const createSocialPost = useMutation({
    mutationFn: async (postData: Omit<SocialPost, "id" | "created_at" | "updated_at" | "user_id" | "likes_count" | "shares_count">) => {
      if (!user?.id) throw new Error("Authentication required");

      const { data, error } = await supabase
        .from("social_posts")
        .insert({
          ...postData,
          user_id: user.id,
          likes_count: 0,
          shares_count: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
      queryClient.invalidateQueries({ queryKey: ["user-social-posts", user?.id] });
      handleSuccess("Social post created successfully!", "Success");
    },
    onError: (error) => {
      handleError(error, "creating social post");
    },
  });

  // Update social post engagement
  const updatePostEngagement = useMutation({
    mutationFn: async ({ postId, likes, shares }: { postId: string; likes?: number; shares?: number }) => {
      const updates: any = {};
      if (likes !== undefined) updates.likes_count = likes;
      if (shares !== undefined) updates.shares_count = shares;

      const { data, error } = await supabase
        .from("social_posts")
        .update(updates)
        .eq("id", postId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
      queryClient.invalidateQueries({ queryKey: ["trending-social-posts"] });
    },
    onError: (error) => {
      handleError(error, "updating post engagement");
    },
  });

  // Mark post as trending (admin only)
  const markPostAsTrending = useMutation({
    mutationFn: async (postId: string) => {
      const { data, error } = await supabase
        .from("social_posts")
        .update({ is_trending: true })
        .eq("id", postId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trending-social-posts"] });
      handleSuccess("Post marked as trending!", "Success");
    },
    onError: (error) => {
      handleError(error, "marking post as trending");
    },
  });

  // Create trending item (admin only)
  const createTrendingItem = useMutation({
    mutationFn: async (itemData: Omit<TrendingItem, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("trending_items")
        .insert(itemData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trending-items"] });
      handleSuccess("Trending item created successfully!", "Success");
    },
    onError: (error) => {
      handleError(error, "creating trending item");
    },
  });

  // Delete social post
  const deleteSocialPost = useMutation({
    mutationFn: async (postId: string) => {
      if (!user?.id) throw new Error("Authentication required");

      const { error } = await supabase
        .from("social_posts")
        .delete()
        .eq("id", postId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
      queryClient.invalidateQueries({ queryKey: ["user-social-posts", user?.id] });
      handleSuccess("Social post deleted successfully!", "Success");
    },
    onError: (error) => {
      handleError(error, "deleting social post");
    },
  });

  return {
    useTrendingSocialPosts,
    useSocialPosts,
    useUserSocialPosts,
    useTrendingItems,
    createSocialPost,
    updatePostEngagement,
    markPostAsTrending,
    createTrendingItem,
    deleteSocialPost,
  };
};