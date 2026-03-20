import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type VendorBooking = Database["public"]["Tables"]["vendor_bookings"]["Row"];

interface BookingFormData {
  vendor_id: string;
  event_id?: string;
  package_id?: string;
  amount: number;
  currency?: string;
  notes?: string;
  booking_details: {
    event_date: string;
    event_time: string;
    duration: string;
    location: string;
    guest_count: number;
    services: string[];
    special_requests: string;
    customer_info: {
      name: string;
      email: string;
      phone: string;
    };
  };
}

export const useVendorBookings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user's vendor bookings
  const useUserBookings = () => {
    return useQuery({
      queryKey: ["user-vendor-bookings", user?.id],
      queryFn: async (): Promise<VendorBooking[]> => {
        if (!user?.id) return [];
        
        const { data, error } = await (supabase as any)
          .from("vendor_bookings")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        return data || [];
      },
      enabled: !!user?.id,
    });
  };

  // Get vendor's received bookings
  const useVendorBookingsQuery = (vendorId?: string) => {
    return useQuery({
      queryKey: ["vendor-bookings", vendorId],
      queryFn: async (): Promise<VendorBooking[]> => {
        if (!vendorId) return [];
        
        const { data, error } = await supabase
          .from("vendor_bookings")
          .select("*")
          .eq("vendor_id", vendorId)
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        return data || [];
      },
      enabled: !!vendorId,
    });
  };

  // Create a new vendor booking
  const createVendorBooking = useMutation({
    mutationFn: async (bookingData: BookingFormData) => {
      if (!user?.id) {
        throw new Error("You must be signed in to make a booking.");
      }

      // First, create a temporary event for this booking if no event_id provided
      let eventId = bookingData.event_id;
      
      if (!eventId) {
        const { data: tempEvent, error: eventError } = await supabase
          .from("events")
          .insert({
            title: `Booking with vendor - ${new Date().toISOString()}`,
            description: `Temporary event for vendor booking`,
            user_id: user.id,
            is_public: false,
            event_date: bookingData.booking_details.event_date,
            location: bookingData.booking_details.location,
          })
          .select()
          .single();
          
        if (eventError) throw eventError;
        eventId = tempEvent.id;
      }

      // Create the vendor booking
      const { data, error } = await supabase
        .from("vendor_bookings")
        .insert({
          vendor_id: bookingData.vendor_id,
          user_id: user.id,
          event_date: bookingData.booking_details.event_date,
          event_type: 'booking',
          total_amount: bookingData.amount,
          status: 'pending',
          notes: JSON.stringify(bookingData.booking_details),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-vendor-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-bookings"] });
      
      toast({
        title: "Booking Created!",
        description: "Your vendor booking has been submitted successfully.",
      });
      
      return data;
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
      throw error;
    },
  });

  // Update booking status
  const updateBookingStatus = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      const { data, error } = await supabase
        .from("vendor_bookings")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", bookingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-vendor-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-bookings"] });
      
      toast({
        title: "Status Updated",
        description: "Booking status has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update booking status.",
        variant: "destructive",
      });
    },
  });

  return {
    useUserBookings,
    useVendorBookings: useVendorBookingsQuery,
    createVendorBooking,
    updateBookingStatus,
  };
};
