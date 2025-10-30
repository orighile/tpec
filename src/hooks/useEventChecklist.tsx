import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  due_date?: string;
  event_id: string;
  user_id: string;
  assigned_to?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface ChecklistCategory {
  name: string;
  items: ChecklistItem[];
  completed: number;
  total: number;
}

const DEFAULT_CATEGORIES = [
  "Venue & Location",
  "Catering & Food",
  "Entertainment",
  "Decorations",
  "Photography",
  "Transportation",
  "Guest Management",
  "Documentation",
  "Final Preparations"
];

const DEFAULT_CHECKLIST_ITEMS: Omit<ChecklistItem, 'id' | 'event_id' | 'user_id' | 'created_at' | 'updated_at'>[] = [
  {
    title: "Book venue",
    description: "Secure the event venue and confirm booking details",
    category: "Venue & Location",
    priority: "high",
    completed: false,
  },
  {
    title: "Send invitations",
    description: "Create and send event invitations to all guests",
    category: "Guest Management",
    priority: "high",
    completed: false,
  },
  {
    title: "Order catering",
    description: "Arrange food and beverage service for the event",
    category: "Catering & Food",
    priority: "high",
    completed: false,
  },
  {
    title: "Book photographer",
    description: "Hire professional photographer/videographer",
    category: "Photography",
    priority: "medium",
    completed: false,
  },
  {
    title: "Plan decorations",
    description: "Design and arrange event decorations and theme",
    category: "Decorations",
    priority: "medium",
    completed: false,
  },
  {
    title: "Arrange transportation",
    description: "Organize transportation for guests if needed",
    category: "Transportation",
    priority: "low",
    completed: false,
  },
  {
    title: "Confirm all vendors",
    description: "Final confirmation with all hired vendors",
    category: "Final Preparations",
    priority: "high",
    completed: false,
  },
  {
    title: "Prepare emergency kit",
    description: "Pack emergency supplies and contact list",
    category: "Final Preparations",
    priority: "medium",
    completed: false,
  }
];

export const useEventChecklist = (eventId?: string) => {
  const { user } = useAuth();
  const { handleError, handleSuccess } = useErrorHandler();
  const queryClient = useQueryClient();

  // Fetch checklist items for an event
  const useChecklistItems = () => {
    return useQuery({
      queryKey: ["checklist-items", eventId],
      queryFn: async (): Promise<ChecklistItem[]> => {
        if (!eventId || !user?.id) return [];

        const { data, error } = await supabase
          .from("checklist_items")
          .select("*")
          .eq("event_id", eventId)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return (data || []) as unknown as ChecklistItem[];
      },
      enabled: !!eventId && !!user?.id,
    });
  };

  // Initialize checklist with default items
  const initializeChecklist = useMutation({
    mutationFn: async () => {
      if (!eventId || !user?.id) throw new Error("Event ID and user required");

      // Check if items already exist
      const { data: existing } = await supabase
        .from("checklist_items")
        .select("id")
        .eq("event_id", eventId)
        .eq("user_id", user.id);

      if (existing && existing.length > 0) return existing;

      // Create default items
      const defaultItems = DEFAULT_CHECKLIST_ITEMS.map(item => ({
        ...item,
        event_id: eventId,
        user_id: user.id,
      }));

      const { data, error } = await supabase
        .from("checklist_items")
        .insert(defaultItems)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist-items", eventId] });
      handleSuccess("Checklist initialized with default items!", "Success");
    },
    onError: (error) => {
      handleError(error, "initializing checklist");
    },
  });

  // Add a new checklist item
  const addChecklistItem = useMutation({
    mutationFn: async (itemData: {
      title: string;
      description?: string;
      category: string;
      priority: 'low' | 'medium' | 'high';
      due_date?: string;
      assigned_to?: string;
      notes?: string;
    }) => {
      if (!eventId || !user?.id) throw new Error("Event ID and user required");

      const { data, error } = await supabase
        .from("checklist_items")
        .insert({
          ...itemData,
          event_id: eventId,
          user_id: user.id,
          completed: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist-items", eventId] });
      handleSuccess("Checklist item added successfully!", "Success");
    },
    onError: (error) => {
      handleError(error, "adding checklist item");
    },
  });

  // Update a checklist item
  const updateChecklistItem = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ChecklistItem> }) => {
      if (!user?.id) throw new Error("Authentication required");

      const updateData: any = { ...updates };
      if (updates.completed && !updates.completed_at) {
        updateData.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("checklist_items")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist-items", eventId] });
      handleSuccess("Checklist item updated successfully!", "Success");
    },
    onError: (error) => {
      handleError(error, "updating checklist item");
    },
  });

  // Delete a checklist item
  const deleteChecklistItem = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error("Authentication required");

      const { error } = await supabase
        .from("checklist_items")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist-items", eventId] });
      handleSuccess("Checklist item deleted successfully!", "Success");
    },
    onError: (error) => {
      handleError(error, "deleting checklist item");
    },
  });

  // Toggle item completion
  const toggleChecklistItem = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error("Authentication required");

      // First get the current item
      const { data: currentItem } = await supabase
        .from("checklist_items")
        .select("completed")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (!currentItem) throw new Error("Item not found");

      const newCompleted = !currentItem.completed;
      const updateData: any = { completed: newCompleted };
      
      if (newCompleted) {
        updateData.completed_at = new Date().toISOString();
      } else {
        updateData.completed_at = null;
      }

      const { data, error } = await supabase
        .from("checklist_items")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist-items", eventId] });
    },
    onError: (error) => {
      handleError(error, "toggling checklist item");
    },
  });

  return {
    useChecklistItems,
    initializeChecklist,
    addChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
    toggleChecklistItem,
    // Helper functions for backward compatibility
    getItemsByCategory: (items: ChecklistItem[], category: string) => 
      items.filter(item => item.category === category),
    getCategorizedChecklist: (items: ChecklistItem[]) => {
      return DEFAULT_CATEGORIES.map(categoryName => {
        const categoryItems = items.filter(item => item.category === categoryName);
        return {
          name: categoryName,
          items: categoryItems,
          completed: categoryItems.filter(item => item.completed).length,
          total: categoryItems.length,
        };
      });
    },
    getCompletionStats: (items: ChecklistItem[]) => {
      const total = items.length;
      const completed = items.filter(item => item.completed).length;
      const pending = total - completed;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { total, completed, pending, completionRate };
    },
    getOverdueItems: (items: ChecklistItem[]) => {
      const now = new Date();
      return items.filter(item => 
        item.due_date && 
        new Date(item.due_date) < now && 
        !item.completed
      );
    },
  };
};