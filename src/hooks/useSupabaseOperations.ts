import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import type { Database } from "@/integrations/supabase/types";

type Event = Database["public"]["Tables"]["events"]["Row"];
type Vendor = Database["public"]["Tables"]["vendors"]["Row"];
type Order = Database["public"]["Tables"]["orders"]["Row"];

type CreateEventForm = Database["public"]["Tables"]["events"]["Insert"];
type CreateVendorForm = Database["public"]["Tables"]["vendors"]["Insert"];

// Define Ticket type locally since table doesn't exist
interface Ticket {
  id: string;
  event_id: string;
  name: string;
  price: number;
  quantity: number;
  active: boolean;
  created_at: string;
}

interface CreateTicketForm {
  name: string;
  price: number;
  quantity: number;
}

interface CreateOrderForm {
  event_id: string;
  items: {
    ticket_id: string;
    quantity: number;
  }[];
}

// In-memory storage for tickets (since table doesn't exist)
const ticketsStorage: Record<string, Ticket[]> = {};

export const useSupabaseOperations = () => {
  const { user } = useAuth();
  const { handleError, handleSuccess } = useErrorHandler();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const useEvents = () => {
    return useQuery({
      queryKey: ["events"],
      queryFn: async (): Promise<Event[]> => {
        const { data, error } = await (supabase as any)
          .from("events")
          .select("*")
          .eq("is_public", true)
          .order("created_at", { ascending: false });
        if (error) throw error;
        return data || [];
      },
    });
  };

  const useUserEvents = () => {
    return useQuery({
      queryKey: ["user-events", user?.id],
      queryFn: async (): Promise<Event[]> => {
        if (!user?.id) return [];
        const { data, error } = await (supabase as any)
          .from("events")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (error) throw error;
        return data || [];
      },
      enabled: !!user?.id,
    });
  };

  const createEvent = useMutation({
    mutationFn: async (eventData: CreateEventForm) => {
      if (!user?.id) throw new Error("You must be signed in to create an event.");
      const { data, error } = await supabase
        .from("events")
        .insert({
          ...eventData,
          user_id: user.id,
          is_public: false,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["user-events"] });
      handleSuccess("Your event has been created and is ready for setup.", "Event created successfully");
    },
    onError: (error) => {
      handleError(error, "creating event");
    },
  });

  // Vendors operations
  const useVendors = (filters?: { category?: string; location?: string }) => {
    return useQuery({
      queryKey: ["vendors", filters],
      queryFn: async (): Promise<Vendor[]> => {
        let query = supabase
          .from("vendors")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (filters?.category) {
          query = query.eq("category", filters.category);
        }
        if (filters?.location) {
          query = query.ilike("location", `%${filters.location}%`);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      },
    });
  };

  const useUserVendors = () => {
    return useQuery({
      queryKey: ["user-vendors", user?.id],
      queryFn: async (): Promise<Vendor[]> => {
        if (!user?.id) return [];
        const { data, error } = await supabase
          .from("vendors")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (error) throw error;
        return data || [];
      },
      enabled: !!user?.id,
    });
  };

  const createVendor = useMutation({
    mutationFn: async (vendorData: CreateVendorForm) => {
      if (!user?.id) throw new Error("You must be signed in to create a vendor.");
      const { data, error } = await supabase
        .from("vendors")
        .insert({
          ...vendorData,
          user_id: user.id,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["user-vendors"] });
      handleSuccess("Your vendor profile has been created.", "Vendor registered successfully");
    },
    onError: (error) => {
      handleError(error, "creating vendor");
    },
  });

  // Tickets operations (in-memory since table doesn't exist)
  const useEventTickets = (eventId?: string) => {
    return useQuery({
      queryKey: ["event-tickets", eventId],
      queryFn: async (): Promise<Ticket[]> => {
        if (!eventId) return [];
        return ticketsStorage[eventId] || [];
      },
      enabled: !!eventId,
    });
  };

  const createTicket = useMutation({
    mutationFn: async ({ eventId, ticketData }: { eventId: string; ticketData: CreateTicketForm }) => {
      if (!user?.id) throw new Error("You must be signed in to create tickets.");
      
      const newTicket: Ticket = {
        id: crypto.randomUUID(),
        event_id: eventId,
        name: ticketData.name,
        price: ticketData.price,
        quantity: ticketData.quantity,
        active: true,
        created_at: new Date().toISOString(),
      };

      if (!ticketsStorage[eventId]) {
        ticketsStorage[eventId] = [];
      }
      ticketsStorage[eventId].push(newTicket);
      
      return newTicket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-tickets"] });
      handleSuccess("The ticket type has been added to your event.", "Ticket created successfully");
    },
    onError: (error) => {
      handleError(error, "creating ticket");
    },
  });

  // Orders operations
  const createOrder = useMutation({
    mutationFn: async (orderData: CreateOrderForm) => {
      if (!user?.id) throw new Error("You must be signed in to create an order.");
      
      // Get ticket prices from in-memory storage
      const eventTickets = ticketsStorage[orderData.event_id] || [];
      const priceMap = new Map(eventTickets.map((t) => [t.id, t.price]));
      const amount = orderData.items.reduce((sum, it) => sum + (priceMap.get(it.ticket_id) || 0) * it.quantity, 0);

      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          event_id: orderData.event_id,
          total_amount: amount,
          status: 'pending',
        })
        .select()
        .single();
      if (orderErr) throw orderErr;

      const itemsPayload = orderData.items.map((it) => ({
        order_id: order.id,
        ticket_id: it.ticket_id,
        quantity: it.quantity,
        unit_price: priceMap.get(it.ticket_id) || 0,
        total_price: (priceMap.get(it.ticket_id) || 0) * it.quantity,
      }));
      
      const { error: itemsErr } = await supabase.from("order_items").insert(itemsPayload);
      if (itemsErr) throw itemsErr;

      return order;
    },
    onSuccess: () => {
      handleSuccess("Proceed to payment to complete your purchase.", "Order created successfully");
    },
    onError: (error) => {
      handleError(error, "creating order");
    },
  });

  return {
    // Events
    useEvents,
    useUserEvents,
    createEvent,
    
    // Vendors
    useVendors,
    useUserVendors,
    createVendor,
    
    // Tickets
    useEventTickets,
    createTicket,
    
    // Orders
    createOrder,
    
    // General loading state
    isLoading,
    setIsLoading,
  };
};
