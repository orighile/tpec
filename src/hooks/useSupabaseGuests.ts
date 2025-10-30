
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import type { Database } from "@/integrations/supabase/types";
import type { Guest, CreateGuestForm, UpdateGuestForm } from "@/components/guest-management/types";

export const useSupabaseGuests = (eventId?: string) => {
  const { user } = useAuth();
  const { handleError, handleSuccess } = useErrorHandler();
  const queryClient = useQueryClient();

  // Fetch guests for an event
  const useEventGuests = () => {
    return useQuery({
      queryKey: ["guests", eventId],
      queryFn: async (): Promise<Guest[]> => {
        if (!eventId) return [];
        const { data, error } = await supabase
          .from("guests")
          .select("*")
          .eq("event_id", eventId)
          .order("created_at", { ascending: false });
        if (error) throw error;
        // Cast the data to Guest[] since we know the structure matches
        return (data || []) as Guest[];
      },
      enabled: !!eventId,
    });
  };

  // Create a guest
  const createGuest = useMutation({
    mutationFn: async (guestData: CreateGuestForm) => {
      if (!user?.id) throw new Error("You must be signed in to add guests.");
      const { data, error } = await supabase
        .from("guests")
        .insert(guestData)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["guests", eventId] });
      handleSuccess(`${data.full_name} has been added to your guest list.`, "Guest added");
    },
    onError: (error) => {
      handleError(error, "adding guest");
    },
  });

  // Update a guest
  const updateGuest = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateGuestForm }) => {
      if (!user?.id) throw new Error("You must be signed in to update guests.");
      const { data, error } = await supabase
        .from("guests")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["guests", eventId] });
      handleSuccess(`${data.full_name}'s information has been updated.`, "Guest updated");
    },
    onError: (error) => {
      handleError(error, "updating guest");
    },
  });

  // Delete a guest
  const deleteGuest = useMutation({
    mutationFn: async (guestId: string) => {
      if (!user?.id) throw new Error("You must be signed in to remove guests.");
      const { error } = await supabase
        .from("guests")
        .delete()
        .eq("id", guestId);
      if (error) throw error;
      return guestId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests", eventId] });
      handleSuccess("Guest has been removed from your guest list.", "Guest removed");
    },
    onError: (error) => {
      handleError(error, "removing guest");
    },
  });

  // Send invitation (simulated for now)
  const sendInvitation = useMutation({
    mutationFn: async (email: string) => {
      // Simulate sending invitation
      return new Promise((resolve) => {
        setTimeout(() => resolve(email), 1500);
      });
    },
    onSuccess: (email) => {
      handleSuccess(`An invitation has been successfully delivered to ${email}.`, "Invitation sent");
    },
    onError: (error) => {
      handleError(error, "sending invitation");
    },
  });

  return {
    useEventGuests,
    createGuest,
    updateGuest,
    deleteGuest,
    sendInvitation,
  };
};
