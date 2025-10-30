import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export interface InvitationTemplate {
  id: string;
  name: string;
  description?: string;
  template_type: string;
  design_data: any;
  preview_image_path?: string;
  is_premium: boolean;
  price: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface UserInvitation {
  id: string;
  user_id: string;
  event_id?: string;
  template_id?: string;
  title: string;
  custom_message?: string;
  design_data: any;
  recipient_data: any;
  sent_count: number;
  delivery_status: string;
  created_at: string;
  updated_at: string;
  sent_at?: string;
  template?: InvitationTemplate;
}

export const useDigitalInvitations = () => {
  const { user } = useAuth();
  const { handleError, handleSuccess } = useErrorHandler();
  const queryClient = useQueryClient();

  // Fetch invitation templates
  const useInvitationTemplates = () => {
    return useQuery({
      queryKey: ["invitation-templates"],
      queryFn: async (): Promise<InvitationTemplate[]> => {
        const { data, error } = await supabase
          .from("invitation_templates")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        return (data || []) as InvitationTemplate[];
      },
    });
  };

  // Fetch user's invitations
  const useUserInvitations = () => {
    return useQuery({
      queryKey: ["user-invitations", user?.id],
      queryFn: async (): Promise<UserInvitation[]> => {
        if (!user?.id) return [];

        const { data, error } = await supabase
          .from("user_invitations")
          .select(`
            *,
            template:invitation_templates(*)
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return (data || []) as unknown as UserInvitation[];
      },
      enabled: !!user?.id,
    });
  };

  // Create invitation template
  const createInvitationTemplate = useMutation({
    mutationFn: async (templateData: Omit<InvitationTemplate, "id" | "created_at" | "updated_at" | "created_by">) => {
      if (!user?.id) throw new Error("Authentication required");

      const { data, error } = await supabase
        .from("invitation_templates")
        .insert({
          ...templateData,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitation-templates"] });
      handleSuccess("Template created successfully!", "Success");
    },
    onError: (error) => {
      handleError(error, "creating template");
    },
  });

  // Create user invitation
  const createUserInvitation = useMutation({
    mutationFn: async (invitationData: Omit<UserInvitation, "id" | "created_at" | "updated_at" | "user_id" | "sent_count">) => {
      if (!user?.id) throw new Error("Authentication required");

      const { data, error } = await supabase
        .from("user_invitations")
        .insert({
          ...invitationData,
          user_id: user.id,
          sent_count: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-invitations", user?.id] });
      handleSuccess("Invitation created successfully!", "Success");
    },
    onError: (error) => {
      handleError(error, "creating invitation");
    },
  });

  // Update user invitation
  const updateUserInvitation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<UserInvitation> }) => {
      if (!user?.id) throw new Error("Authentication required");

      const { data, error } = await supabase
        .from("user_invitations")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-invitations", user?.id] });
      handleSuccess("Invitation updated successfully!", "Success");
    },
    onError: (error) => {
      handleError(error, "updating invitation");
    },
  });

  // Send invitation (mark as sent)
  const sendInvitation = useMutation({
    mutationFn: async (invitationId: string) => {
      if (!user?.id) throw new Error("Authentication required");

      // First get current sent_count
      const { data: currentData } = await supabase
        .from("user_invitations")
        .select("sent_count")
        .eq("id", invitationId)
        .eq("user_id", user.id)
        .single();

      const { data, error } = await supabase
        .from("user_invitations")
        .update({
          delivery_status: "sent",
          sent_at: new Date().toISOString(),
          sent_count: (currentData?.sent_count || 0) + 1,
        })
        .eq("id", invitationId)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-invitations", user?.id] });
      handleSuccess("Invitation sent successfully!", "Success");
    },
    onError: (error) => {
      handleError(error, "sending invitation");
    },
  });

  // Delete user invitation
  const deleteUserInvitation = useMutation({
    mutationFn: async (invitationId: string) => {
      if (!user?.id) throw new Error("Authentication required");

      const { error } = await supabase
        .from("user_invitations")
        .delete()
        .eq("id", invitationId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-invitations", user?.id] });
      handleSuccess("Invitation deleted successfully!", "Success");
    },
    onError: (error) => {
      handleError(error, "deleting invitation");
    },
  });

  return {
    useInvitationTemplates,
    useUserInvitations,
    createInvitationTemplate,
    createUserInvitation,
    updateUserInvitation,
    sendInvitation,
    deleteUserInvitation,
  };
};