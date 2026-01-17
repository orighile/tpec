import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import type { Guest, CreateGuestForm, UpdateGuestForm } from "@/components/guest-management/types";

// Transform database guest to app Guest type
const transformGuest = (dbGuest: any): Guest => ({
  id: dbGuest.id,
  event_id: dbGuest.event_id,
  full_name: dbGuest.name, // Map 'name' to 'full_name'
  email: dbGuest.email || '',
  phone: dbGuest.phone || '',
  rsvp_status: dbGuest.rsvp_status || 'pending',
  plus_one: dbGuest.plus_one || false,
  meal_preference: dbGuest.dietary_requirements || 'No Preference',
  notes: dbGuest.notes || '',
  guest_group: 'General', // Default value since column doesn't exist
  table_assignment: dbGuest.table_number?.toString() || '',
  created_at: dbGuest.created_at,
  updated_at: dbGuest.updated_at,
});

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
        return (data || []).map(transformGuest);
      },
      enabled: !!eventId,
    });
  };

  // Create a guest
  const createGuest = useMutation({
    mutationFn: async (guestData: CreateGuestForm) => {
      if (!user?.id) throw new Error("You must be signed in to add guests.");
      const dbData = {
        name: guestData.full_name,
        email: guestData.email,
        phone: guestData.phone,
        rsvp_status: guestData.rsvp_status,
        plus_one: guestData.plus_one,
        dietary_requirements: guestData.meal_preference,
        notes: guestData.notes,
        table_number: guestData.table_assignment ? parseInt(guestData.table_assignment) : null,
        event_id: guestData.event_id,
        user_id: user.id,
      };
      const { data, error } = await supabase
        .from("guests")
        .insert(dbData)
        .select()
        .single();
      if (error) throw error;
      return transformGuest(data);
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
      const dbUpdates = {
        name: updates.full_name,
        email: updates.email,
        phone: updates.phone,
        rsvp_status: updates.rsvp_status,
        plus_one: updates.plus_one,
        dietary_requirements: updates.meal_preference,
        notes: updates.notes,
        table_number: updates.table_assignment ? parseInt(updates.table_assignment) : null,
      };
      const { data, error } = await supabase
        .from("guests")
        .update(dbUpdates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return transformGuest(data);
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
