import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

// Mock data storage (in-memory for now until tables are created)
const mockSocialPosts: SocialPost[] = [];
const mockTrendingItems: TrendingItem[] = [];

export const useSocialContent = () => {
  const { user } = useAuth();
  const { handleError, handleSuccess } = useErrorHandler();
  const queryClient = useQueryClient();

  // Fetch trending social posts (mock)
  const useTrendingSocialPosts = () => {
    return useQuery({
      queryKey: ["trending-social-posts"],
      queryFn: async (): Promise<SocialPost[]> => {
        return mockSocialPosts.filter(p => p.is_trending).slice(0, 10);
      },
    });
  };

  // Fetch all social posts (mock)
  const useSocialPosts = () => {
    return useQuery({
      queryKey: ["social-posts"],
      queryFn: async (): Promise<SocialPost[]> => {
        return mockSocialPosts.slice(0, 50);
      },
    });
  };

  // Fetch user's social posts (mock)
  const useUserSocialPosts = () => {
    return useQuery({
      queryKey: ["user-social-posts", user?.id],
      queryFn: async (): Promise<SocialPost[]> => {
        if (!user?.id) return [];
        return mockSocialPosts.filter(p => p.user_id === user.id);
      },
      enabled: !!user?.id,
    });
  };

  // Fetch trending items (mock)
  const useTrendingItems = () => {
    return useQuery({
      queryKey: ["trending-items"],
      queryFn: async (): Promise<TrendingItem[]> => {
        return mockTrendingItems.filter(i => i.is_active).slice(0, 20);
      },
    });
  };

  // Create social post (mock)
  const createSocialPost = useMutation({
    mutationFn: async (postData: Omit<SocialPost, "id" | "created_at" | "updated_at" | "user_id" | "likes_count" | "shares_count">) => {
      if (!user?.id) throw new Error("Authentication required");

      const newPost: SocialPost = {
        ...postData,
        id: `post-${Date.now()}`,
        user_id: user.id,
        likes_count: 0,
        shares_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockSocialPosts.push(newPost);
      return newPost;
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

  // Update social post engagement (mock)
  const updatePostEngagement = useMutation({
    mutationFn: async ({ postId, likes, shares }: { postId: string; likes?: number; shares?: number }) => {
      const post = mockSocialPosts.find(p => p.id === postId);
      if (!post) throw new Error("Post not found");

      if (likes !== undefined) post.likes_count = likes;
      if (shares !== undefined) post.shares_count = shares;
      post.updated_at = new Date().toISOString();
      return post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
      queryClient.invalidateQueries({ queryKey: ["trending-social-posts"] });
    },
    onError: (error) => {
      handleError(error, "updating post engagement");
    },
  });

  // Mark post as trending (mock)
  const markPostAsTrending = useMutation({
    mutationFn: async (postId: string) => {
      const post = mockSocialPosts.find(p => p.id === postId);
      if (!post) throw new Error("Post not found");

      post.is_trending = true;
      post.updated_at = new Date().toISOString();
      return post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trending-social-posts"] });
      handleSuccess("Post marked as trending!", "Success");
    },
    onError: (error) => {
      handleError(error, "marking post as trending");
    },
  });

  // Create trending item (mock)
  const createTrendingItem = useMutation({
    mutationFn: async (itemData: Omit<TrendingItem, "id" | "created_at" | "updated_at">) => {
      const newItem: TrendingItem = {
        ...itemData,
        id: `trending-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockTrendingItems.push(newItem);
      return newItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trending-items"] });
      handleSuccess("Trending item created successfully!", "Success");
    },
    onError: (error) => {
      handleError(error, "creating trending item");
    },
  });

  // Delete social post (mock)
  const deleteSocialPost = useMutation({
    mutationFn: async (postId: string) => {
      if (!user?.id) throw new Error("Authentication required");

      const index = mockSocialPosts.findIndex(p => p.id === postId && p.user_id === user.id);
      if (index !== -1) {
        mockSocialPosts.splice(index, 1);
      }
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
