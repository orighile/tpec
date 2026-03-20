import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Discussion {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  likes_count: number;
  replies_count: number;
  is_trending: boolean;
  created_at: string;
  updated_at: string;
  author_name?: string;
  author_avatar?: string;
  has_liked?: boolean;
}

export interface DiscussionReply {
  id: string;
  discussion_id: string;
  user_id: string;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  author_name?: string;
  author_avatar?: string;
  has_liked?: boolean;
}

export const DISCUSSION_CATEGORIES = [
  "Budget",
  "Vendors",
  "Planning",
  "Culture",
  "Venues",
  "Catering",
  "Photography",
  "Music & Entertainment",
  "General",
];

export function useDiscussions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all discussions
  const { data: discussions = [], isLoading, refetch } = useQuery({
    queryKey: ["discussions"],
    queryFn: async () => {
      const { data: discussionsData, error } = await (supabase as any)
        .from("discussions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch author profiles
      const userIds = [...new Set(discussionsData.map((d) => d.user_id))];
      const { data: profiles } = await (supabase as any)
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", userIds);

      // Check which discussions user has liked
      let likedDiscussionIds: string[] = [];
      if (user) {
        const { data: likes } = await (supabase as any)
          .from("discussion_likes")
          .select("discussion_id")
          .eq("user_id", user.id)
          .not("discussion_id", "is", null);
        likedDiscussionIds = (likes || []).map((l) => l.discussion_id!);
      }

      const profileMap = new Map(
        (profiles || []).map((p: any) => [p.id, p])
      );

      return (discussionsData || []).map((d: any) => {
        const profile = profileMap.get(d.user_id);
        return {
          ...d,
          author_name: profile?.full_name || "Anonymous",
          author_avatar: profile?.avatar_url,
          has_liked: likedDiscussionIds.includes(d.id),
        };
      }) as Discussion[];
    },
  });

  // Fetch single discussion with replies
  const useDiscussionDetail = (discussionId: string) => {
    return useQuery({
      queryKey: ["discussion", discussionId],
      queryFn: async () => {
        const { data: discussion, error } = await (supabase as any)
          .from("discussions")
          .select("*")
          .eq("id", discussionId)
          .single();

        if (error) throw error;

        // Fetch author profile
        const { data: authorProfile } = await (supabase as any)
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", discussion.user_id)
          .single();

        // Check if user liked this discussion
        let hasLiked = false;
        if (user) {
          const { data: like } = await (supabase as any)
            .from("discussion_likes")
            .select("id")
            .eq("user_id", user.id)
            .eq("discussion_id", discussionId)
            .maybeSingle();
          hasLiked = !!like;
        }

        return {
          ...discussion,
          author_name: authorProfile?.full_name || "Anonymous",
          author_avatar: authorProfile?.avatar_url,
          has_liked: hasLiked,
        } as Discussion;
      },
      enabled: !!discussionId,
    });
  };

  // Fetch replies for a discussion
  const useDiscussionReplies = (discussionId: string) => {
    return useQuery({
      queryKey: ["discussion-replies", discussionId],
      queryFn: async () => {
        const { data: replies, error } = await (supabase as any)
          .from("discussion_replies")
          .select("*")
          .eq("discussion_id", discussionId)
          .order("created_at", { ascending: true });

        if (error) throw error;

        // Fetch author profiles
        const userIds = [...new Set((replies || []).map((r: any) => r.user_id))];
        const { data: profiles } = await (supabase as any)
          .from("profiles")
          .select("id, full_name, avatar_url")
          .in("id", userIds);

        // Check which replies user has liked
        let likedReplyIds: string[] = [];
        if (user) {
          const { data: likes } = await (supabase as any)
            .from("discussion_likes")
            .select("reply_id")
            .eq("user_id", user.id)
            .not("reply_id", "is", null);
          likedReplyIds = (likes || []).map((l) => l.reply_id!);
        }

        const profileMap = new Map(
          (profiles || []).map((p) => [p.user_id, p])
        );

        return replies.map((r) => {
          const profile = profileMap.get(r.user_id);
          return {
            ...r,
            author_name: profile?.full_name || "Anonymous",
            author_avatar: profile?.avatar_url,
            has_liked: likedReplyIds.includes(r.id),
          };
        }) as DiscussionReply[];
      },
      enabled: !!discussionId,
    });
  };

  // Create discussion
  const createDiscussion = useMutation({
    mutationFn: async ({
      title,
      content,
      category,
    }: {
      title: string;
      content: string;
      category: string;
    }) => {
      if (!user) throw new Error("Must be logged in");

      const { data, error } = await supabase
        .from("discussions")
        .insert({
          user_id: user.id,
          title,
          content,
          category,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussions"] });
      toast.success("Discussion created!");
    },
    onError: (error) => {
      toast.error("Failed to create discussion: " + error.message);
    },
  });

  // Create reply
  const createReply = useMutation({
    mutationFn: async ({
      discussionId,
      content,
    }: {
      discussionId: string;
      content: string;
    }) => {
      if (!user) throw new Error("Must be logged in");

      const { data, error } = await supabase
        .from("discussion_replies")
        .insert({
          discussion_id: discussionId,
          user_id: user.id,
          content,
        })
        .select()
        .single();

      if (error) throw error;

      // Increment replies count
      const currentDiscussion = discussions.find(d => d.id === discussionId);
      const newCount = (currentDiscussion?.replies_count ?? 0) + 1;
      await supabase
        .from("discussions")
        .update({ replies_count: newCount })
        .eq("id", discussionId);

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["discussion-replies", variables.discussionId] });
      queryClient.invalidateQueries({ queryKey: ["discussions"] });
      toast.success("Reply posted!");
    },
    onError: (error) => {
      toast.error("Failed to post reply: " + error.message);
    },
  });

  // Toggle like on discussion
  const toggleDiscussionLike = useMutation({
    mutationFn: async ({ discussionId, hasLiked }: { discussionId: string; hasLiked: boolean }) => {
      if (!user) throw new Error("Must be logged in");

      if (hasLiked) {
        await supabase
          .from("discussion_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("discussion_id", discussionId);
      } else {
        await supabase.from("discussion_likes").insert({
          user_id: user.id,
          discussion_id: discussionId,
        });
      }

      // Update likes count
      const newCount = hasLiked ? -1 : 1;
      const discussion = discussions.find((d) => d.id === discussionId);
      if (discussion) {
        await supabase
          .from("discussions")
          .update({ likes_count: Math.max(0, discussion.likes_count + newCount) })
          .eq("id", discussionId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussions"] });
    },
  });

  // Toggle like on reply
  const toggleReplyLike = useMutation({
    mutationFn: async ({
      replyId,
      discussionId,
      hasLiked,
      currentLikes,
    }: {
      replyId: string;
      discussionId: string;
      hasLiked: boolean;
      currentLikes: number;
    }) => {
      if (!user) throw new Error("Must be logged in");

      if (hasLiked) {
        await supabase
          .from("discussion_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("reply_id", replyId);
      } else {
        await supabase.from("discussion_likes").insert({
          user_id: user.id,
          reply_id: replyId,
        });
      }

      await supabase
        .from("discussion_replies")
        .update({ likes_count: Math.max(0, currentLikes + (hasLiked ? -1 : 1)) })
        .eq("id", replyId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["discussion-replies", variables.discussionId] });
    },
  });

  // Delete discussion
  const deleteDiscussion = useMutation({
    mutationFn: async (discussionId: string) => {
      const { error } = await supabase
        .from("discussions")
        .delete()
        .eq("id", discussionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussions"] });
      toast.success("Discussion deleted");
    },
  });

  // Delete reply
  const deleteReply = useMutation({
    mutationFn: async ({ replyId, discussionId }: { replyId: string; discussionId: string }) => {
      const { error } = await supabase
        .from("discussion_replies")
        .delete()
        .eq("id", replyId);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["discussion-replies", variables.discussionId] });
      queryClient.invalidateQueries({ queryKey: ["discussions"] });
      toast.success("Reply deleted");
    },
  });

  return {
    discussions,
    isLoading,
    refetch,
    createDiscussion,
    createReply,
    toggleDiscussionLike,
    toggleReplyLike,
    deleteDiscussion,
    deleteReply,
    useDiscussionDetail,
    useDiscussionReplies,
  };
}
