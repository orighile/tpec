import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

// Mock data storage (in-memory for now until tables are created)
const mockRegistries: GiftRegistry[] = [];
const mockItems: GiftItem[] = [];
const mockPurchases: GiftPurchase[] = [];

export const useGiftRegistry = (eventId?: string) => {
  const { user } = useAuth();
  const { handleError, handleSuccess } = useErrorHandler();
  const queryClient = useQueryClient();

  // Fetch user's gift registries (mock)
  const useGiftRegistries = () => {
    return useQuery({
      queryKey: ["gift-registries", user?.id],
      queryFn: async (): Promise<GiftRegistry[]> => {
        if (!user?.id) return [];
        return mockRegistries.filter(r => r.user_id === user.id);
      },
      enabled: !!user?.id,
    });
  };

  // Fetch public gift registry by event (mock)
  const usePublicGiftRegistry = (eventId: string) => {
    return useQuery({
      queryKey: ["public-gift-registry", eventId],
      queryFn: async (): Promise<GiftRegistry | null> => {
        return mockRegistries.find(r => r.event_id === eventId && r.is_public) || null;
      },
      enabled: !!eventId,
    });
  };

  // Fetch gift items for a registry (mock)
  const useGiftItems = (registryId: string) => {
    return useQuery({
      queryKey: ["gift-items", registryId],
      queryFn: async (): Promise<GiftItem[]> => {
        return mockItems.filter(i => i.registry_id === registryId);
      },
      enabled: !!registryId,
    });
  };

  // Fetch purchases for gift items (mock)
  const useGiftPurchases = (registryId: string) => {
    return useQuery({
      queryKey: ["gift-purchases", registryId],
      queryFn: async (): Promise<GiftPurchase[]> => {
        if (!user?.id) return [];
        const itemIds = mockItems.filter(i => i.registry_id === registryId).map(i => i.id);
        return mockPurchases.filter(p => itemIds.includes(p.gift_item_id));
      },
      enabled: !!user?.id && !!registryId,
    });
  };

  // Create gift registry (mock)
  const createGiftRegistry = useMutation({
    mutationFn: async (registryData: Omit<GiftRegistry, "id" | "created_at" | "updated_at" | "user_id">) => {
      if (!user?.id) throw new Error("Authentication required");

      const newRegistry: GiftRegistry = {
        ...registryData,
        id: `registry-${Date.now()}`,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockRegistries.push(newRegistry);
      return newRegistry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gift-registries", user?.id] });
      handleSuccess("Gift registry created successfully!", "Success");
    },
    onError: (error) => {
      handleError(error, "creating gift registry");
    },
  });

  // Add gift item (mock)
  const addGiftItem = useMutation({
    mutationFn: async (itemData: Omit<GiftItem, "id" | "created_at" | "updated_at" | "quantity_purchased">) => {
      const newItem: GiftItem = {
        ...itemData,
        id: `item-${Date.now()}`,
        quantity_purchased: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockItems.push(newItem);
      return newItem;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["gift-items", variables.registry_id] });
      handleSuccess("Gift item added successfully!", "Success");
    },
    onError: (error) => {
      handleError(error, "adding gift item");
    },
  });

  // Purchase gift item (mock)
  const purchaseGiftItem = useMutation({
    mutationFn: async (purchaseData: Omit<GiftPurchase, "id" | "created_at">) => {
      const newPurchase: GiftPurchase = {
        ...purchaseData,
        id: `purchase-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      mockPurchases.push(newPurchase);

      // Update quantity purchased
      const item = mockItems.find(i => i.id === purchaseData.gift_item_id);
      if (item) {
        item.quantity_purchased += purchaseData.quantity;
      }
      return newPurchase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gift-items"] });
      queryClient.invalidateQueries({ queryKey: ["gift-purchases"] });
      handleSuccess("Gift purchased successfully! Thank you!", "Success");
    },
    onError: (error) => {
      handleError(error, "purchasing gift");
    },
  });

  // Update gift registry (mock)
  const updateGiftRegistry = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<GiftRegistry> }) => {
      if (!user?.id) throw new Error("Authentication required");

      const index = mockRegistries.findIndex(r => r.id === id && r.user_id === user.id);
      if (index === -1) throw new Error("Registry not found");

      mockRegistries[index] = { ...mockRegistries[index], ...updates, updated_at: new Date().toISOString() };
      return mockRegistries[index];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gift-registries", user?.id] });
      handleSuccess("Gift registry updated successfully!", "Success");
    },
    onError: (error) => {
      handleError(error, "updating gift registry");
    },
  });

  // Delete gift item (mock)
  const deleteGiftItem = useMutation({
    mutationFn: async ({ itemId, registryId }: { itemId: string; registryId: string }) => {
      const index = mockItems.findIndex(i => i.id === itemId);
      if (index !== -1) {
        mockItems.splice(index, 1);
      }
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
