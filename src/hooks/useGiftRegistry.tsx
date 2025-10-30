import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export interface GiftRegistry {
  id: string;
  event_id: string;
  user_id: string;
  title: string;
  description?: string;
  is_public: boolean;
  shipping_address?: any;
  created_at: string;
  updated_at: string;
}

export interface GiftItem {
  id: string;
  registry_id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  quantity_requested: number;
  quantity_purchased: number;
  image_path?: string;
  store_url?: string;
  priority: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface GiftPurchase {
  id: string;
  gift_item_id: string;
  purchaser_id?: string;
  purchaser_name: string;
  purchaser_email: string;
  quantity: number;
  message?: string;
  created_at: string;
}

export const useGiftRegistry = (eventId?: string) => {
  const { user } = useAuth();
  const { handleError, handleSuccess } = useErrorHandler();
  const queryClient = useQueryClient();

  // Fetch user's gift registries
  const useGiftRegistries = () => {
    return useQuery({
      queryKey: ["gift-registries", user?.id],
      queryFn: async (): Promise<GiftRegistry[]> => {
        if (!user?.id) return [];

        const { data, error } = await supabase
          .from("gift_registries")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return (data || []) as GiftRegistry[];
      },
      enabled: !!user?.id,
    });
  };

  // Fetch public gift registry by event
  const usePublicGiftRegistry = (eventId: string) => {
    return useQuery({
      queryKey: ["public-gift-registry", eventId],
      queryFn: async (): Promise<GiftRegistry | null> => {
        const { data, error } = await supabase
          .from("gift_registries")
          .select("*")
          .eq("event_id", eventId)
          .eq("is_public", true)
          .maybeSingle();

        if (error) throw error;
        return data as GiftRegistry | null;
      },
      enabled: !!eventId,
    });
  };

  // Fetch gift items for a registry
  const useGiftItems = (registryId: string) => {
    return useQuery({
      queryKey: ["gift-items", registryId],
      queryFn: async (): Promise<GiftItem[]> => {
        const { data, error } = await supabase
          .from("gift_items")
          .select("*")
          .eq("registry_id", registryId)
          .order("priority", { ascending: false });

        if (error) throw error;
        return data || [];
      },
      enabled: !!registryId,
    });
  };

  // Fetch purchases for gift items (registry owner only)
  const useGiftPurchases = (registryId: string) => {
    return useQuery({
      queryKey: ["gift-purchases", registryId],
      queryFn: async (): Promise<GiftPurchase[]> => {
        if (!user?.id) return [];

        const { data, error } = await supabase
          .from("gift_purchases")
          .select(`
            *,
            gift_item:gift_items(*)
          `)
          .eq("gift_items.registry_id", registryId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data || [];
      },
      enabled: !!user?.id && !!registryId,
    });
  };

  // Create gift registry
  const createGiftRegistry = useMutation({
    mutationFn: async (registryData: Omit<GiftRegistry, "id" | "created_at" | "updated_at" | "user_id">) => {
      if (!user?.id) throw new Error("Authentication required");

      const { data, error } = await supabase
        .from("gift_registries")
        .insert({
          ...registryData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gift-registries", user?.id] });
      handleSuccess("Gift registry created successfully!", "Success");
    },
    onError: (error) => {
      handleError(error, "creating gift registry");
    },
  });

  // Add gift item
  const addGiftItem = useMutation({
    mutationFn: async (itemData: Omit<GiftItem, "id" | "created_at" | "updated_at" | "quantity_purchased">) => {
      const { data, error } = await supabase
        .from("gift_items")
        .insert({
          ...itemData,
          quantity_purchased: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["gift-items", variables.registry_id] });
      handleSuccess("Gift item added successfully!", "Success");
    },
    onError: (error) => {
      handleError(error, "adding gift item");
    },
  });

  // Purchase gift item
  const purchaseGiftItem = useMutation({
    mutationFn: async (purchaseData: Omit<GiftPurchase, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("gift_purchases")
        .insert(purchaseData)
        .select()
        .single();

      if (error) throw error;

      // Update quantity purchased manually
      const { data: currentItem } = await supabase
        .from("gift_items")
        .select("quantity_purchased")
        .eq("id", purchaseData.gift_item_id)
        .single();

      const { error: updateError } = await supabase
        .from("gift_items")
        .update({ 
          quantity_purchased: (currentItem?.quantity_purchased || 0) + purchaseData.quantity 
        })
        .eq("id", purchaseData.gift_item_id);

      if (updateError) throw updateError;
      return data;
    },
    onSuccess: (_, variables) => {
      // Find registry_id from the gift_item to invalidate the right query
      queryClient.invalidateQueries({ queryKey: ["gift-items"] });
      queryClient.invalidateQueries({ queryKey: ["gift-purchases"] });
      handleSuccess("Gift purchased successfully! Thank you!", "Success");
    },
    onError: (error) => {
      handleError(error, "purchasing gift");
    },
  });

  // Update gift registry
  const updateGiftRegistry = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<GiftRegistry> }) => {
      if (!user?.id) throw new Error("Authentication required");

      const { data, error } = await supabase
        .from("gift_registries")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gift-registries", user?.id] });
      handleSuccess("Gift registry updated successfully!", "Success");
    },
    onError: (error) => {
      handleError(error, "updating gift registry");
    },
  });

  // Delete gift item
  const deleteGiftItem = useMutation({
    mutationFn: async ({ itemId, registryId }: { itemId: string; registryId: string }) => {
      const { error } = await supabase
        .from("gift_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
      return { itemId, registryId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["gift-items", data.registryId] });
      handleSuccess("Gift item removed successfully!", "Success");
    },
    onError: (error) => {
      handleError(error, "removing gift item");
    },
  });

  return {
    useGiftRegistries,
    usePublicGiftRegistry,
    useGiftItems,
    useGiftPurchases,
    createGiftRegistry,
    addGiftItem,
    purchaseGiftItem,
    updateGiftRegistry,
    deleteGiftItem,
  };
};