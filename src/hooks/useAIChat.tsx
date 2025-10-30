import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export interface AIConversation {
  id: string;
  user_id: string;
  event_id?: string;
  title?: string;
  context_data: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AIMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  metadata: any;
  created_at: string;
}

export const useAIChat = (eventId?: string) => {
  const { user } = useAuth();
  const { handleError, handleSuccess } = useErrorHandler();
  const queryClient = useQueryClient();

  // Fetch user's conversations
  const useConversations = () => {
    return useQuery({
      queryKey: ["ai-conversations", user?.id, eventId],
      queryFn: async (): Promise<AIConversation[]> => {
        if (!user?.id) return [];

        let query = supabase
          .from("ai_conversations")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_active", true);

        if (eventId) {
          query = query.eq("event_id", eventId);
        }

        const { data, error } = await query.order("updated_at", { ascending: false });

        if (error) throw error;
        return (data || []) as AIConversation[];
      },
      enabled: !!user?.id,
    });
  };

  // Fetch messages for a conversation
  const useConversationMessages = (conversationId: string) => {
    return useQuery({
      queryKey: ["ai-messages", conversationId],
      queryFn: async (): Promise<AIMessage[]> => {
        const { data, error } = await supabase
          .from("ai_messages")
          .select("*")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true });

        if (error) throw error;
        return (data || []) as AIMessage[];
      },
      enabled: !!conversationId,
    });
  };

  // Create conversation
  const createConversation = useMutation({
    mutationFn: async (conversationData: Omit<AIConversation, "id" | "created_at" | "updated_at" | "user_id">) => {
      if (!user?.id) throw new Error("Authentication required");

      const { data, error } = await supabase
        .from("ai_conversations")
        .insert({
          ...conversationData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-conversations", user?.id, eventId] });
      handleSuccess("New conversation started!", "Success");
    },
    onError: (error) => {
      handleError(error, "starting conversation");
    },
  });

  // Add message to conversation
  const addMessage = useMutation({
    mutationFn: async (messageData: Omit<AIMessage, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("ai_messages")
        .insert(messageData)
        .select()
        .single();

      if (error) throw error;

      // Update conversation's updated_at timestamp
      await supabase
        .from("ai_conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", messageData.conversation_id);

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ai-messages", variables.conversation_id] });
      queryClient.invalidateQueries({ queryKey: ["ai-conversations", user?.id, eventId] });
    },
    onError: (error) => {
      handleError(error, "sending message");
    },
  });

  // Send message and get AI response
  const sendMessage = useMutation({
    mutationFn: async ({ conversationId, content, context }: { conversationId: string; content: string; context?: Record<string, any> }) => {
      if (!user?.id) throw new Error("Authentication required");

      // Add user message
      const { data: userMessage, error: userError } = await supabase
        .from("ai_messages")
        .insert({
          conversation_id: conversationId,
          role: "user",
          content,
          metadata: context || {},
        })
        .select()
        .single();

      if (userError) throw userError;

      // Simulate AI response (you'd integrate with real AI service here)
      const aiResponse = await generateAIResponse(content, context);

      // Add AI response message
      const { data: aiMessage, error: aiError } = await supabase
        .from("ai_messages")
        .insert({
          conversation_id: conversationId,
          role: "assistant",
          content: aiResponse,
          metadata: { response_time: new Date().toISOString() },
        })
        .select()
        .single();

      if (aiError) throw aiError;

      // Update conversation timestamp
      await supabase
        .from("ai_conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId);

      return { userMessage, aiMessage };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ai-messages", variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["ai-conversations", user?.id, eventId] });
    },
    onError: (error) => {
      handleError(error, "sending message");
    },
  });

  // Update conversation context
  const updateConversationContext = useMutation({
    mutationFn: async ({ conversationId, contextData }: { conversationId: string; contextData: Record<string, any> }) => {
      if (!user?.id) throw new Error("Authentication required");

      const { data, error } = await supabase
        .from("ai_conversations")
        .update({ context_data: contextData })
        .eq("id", conversationId)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-conversations", user?.id, eventId] });
    },
    onError: (error) => {
      handleError(error, "updating conversation context");
    },
  });

  // Archive conversation
  const archiveConversation = useMutation({
    mutationFn: async (conversationId: string) => {
      if (!user?.id) throw new Error("Authentication required");

      const { error } = await supabase
        .from("ai_conversations")
        .update({ is_active: false })
        .eq("id", conversationId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-conversations", user?.id, eventId] });
      handleSuccess("Conversation archived!", "Success");
    },
    onError: (error) => {
      handleError(error, "archiving conversation");
    },
  });

  return {
    useConversations,
    useConversationMessages,
    createConversation,
    addMessage,
    sendMessage,
    updateConversationContext,
    archiveConversation,
  };
};

// Mock AI response generator - replace with real AI service integration
const generateAIResponse = async (message: string, context?: Record<string, any>): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple response logic - replace with actual AI integration
  const responses = [
    "That's a great idea for your event! Let me help you plan that out.",
    "I can definitely assist you with that. Here are some suggestions...",
    "Based on your event details, I recommend considering these options.",
    "Let me help you organize that. What specific aspects would you like to focus on?",
    "That sounds like it will be a wonderful event! Here's what I suggest...",
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};