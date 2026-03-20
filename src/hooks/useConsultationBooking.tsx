import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, addMinutes, parse, isBefore, isAfter, startOfDay } from "date-fns";

export interface BookingAvailability {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  slot_duration_minutes: number;
}

export interface BlockedDate {
  id: string;
  blocked_date: string;
  reason: string | null;
}

export interface ConsultationBooking {
  id: string;
  name: string;
  email: string;
  phone?: string;
  booking_date: string;
  booking_time: string;
  consultation_type: string;
  event_type?: string;
  message?: string;
  status: string;
  created_at: string;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone?: string;
  booking_date: Date;
  booking_time: string;
  consultation_type: string;
  event_type?: string;
  message?: string;
}

export const useConsultationBooking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchAvailability = async (): Promise<BookingAvailability[]> => {
    const { data, error } = await (supabase as any)
      .from("booking_availability")
      .select("*")
      .eq("is_available", true);

    if (error) {
      console.error("Error fetching availability:", error);
      return [];
    }

    return (data || []) as BookingAvailability[];
  };

  const fetchBlockedDates = async (): Promise<BlockedDate[]> => {
    const { data, error } = await (supabase as any)
      .from("blocked_dates")
      .select("*");

    if (error) {
      console.error("Error fetching blocked dates:", error);
      return [];
    }

    return (data || []) as BlockedDate[];
  };

  const fetchExistingBookings = async (date: Date): Promise<ConsultationBooking[]> => {
    const dateStr = format(date, "yyyy-MM-dd");
    
    const { data, error } = await supabase
      .from("consultation_bookings")
      .select("*")
      .eq("booking_date", dateStr)
      .neq("status", "cancelled");

    if (error) {
      console.error("Error fetching existing bookings:", error);
      return [];
    }

    return (data || []) as ConsultationBooking[];
  };

  const generateTimeSlots = (
    availability: BookingAvailability,
    existingBookings: ConsultationBooking[]
  ): string[] => {
    const slots: string[] = [];
    const startTime = parse(availability.start_time, "HH:mm", new Date());
    const endTime = parse(availability.end_time, "HH:mm", new Date());
    const slotDuration = availability.slot_duration_minutes;

    let currentSlot = startTime;
    while (isBefore(currentSlot, endTime)) {
      const slotStr = format(currentSlot, "HH:mm");
      
      // Check if slot is already booked
      const isBooked = existingBookings.some(
        (booking) => booking.booking_time === slotStr
      );

      if (!isBooked) {
        slots.push(slotStr);
      }

      currentSlot = addMinutes(currentSlot, slotDuration);
    }

    return slots;
  };

  const getAvailableSlots = async (date: Date): Promise<string[]> => {
    const dayOfWeek = date.getDay();
    
    // Check if date is blocked
    const blockedDates = await fetchBlockedDates();
    const dateStr = format(date, "yyyy-MM-dd");
    if (blockedDates.some((bd) => bd.blocked_date === dateStr)) {
      return [];
    }

    // Get availability for the day
    const availability = await fetchAvailability();
    const dayAvailability = availability.find(
      (a) => a.day_of_week === dayOfWeek
    );

    if (!dayAvailability) {
      return [];
    }

    // Get existing bookings for the date
    const existingBookings = await fetchExistingBookings(date);

    // Generate available time slots
    return generateTimeSlots(dayAvailability, existingBookings);
  };

  const isDateAvailable = async (date: Date): Promise<boolean> => {
    // Don't allow past dates
    if (isBefore(startOfDay(date), startOfDay(new Date()))) {
      return false;
    }

    const dayOfWeek = date.getDay();
    
    // Check if date is blocked
    const blockedDates = await fetchBlockedDates();
    const dateStr = format(date, "yyyy-MM-dd");
    if (blockedDates.some((bd) => bd.blocked_date === dateStr)) {
      return false;
    }

    // Get availability for the day
    const availability = await fetchAvailability();
    const dayAvailability = availability.find(
      (a) => a.day_of_week === dayOfWeek && a.is_available
    );

    return !!dayAvailability;
  };

  const createBooking = async (formData: BookingFormData): Promise<ConsultationBooking | null> => {
    setIsLoading(true);

    try {
      const bookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        booking_date: format(formData.booking_date, "yyyy-MM-dd"),
        booking_time: formData.booking_time,
        consultation_type: formData.consultation_type,
        event_type: formData.event_type || null,
        message: formData.message || null,
        status: "pending",
      };

      const { data, error } = await supabase
        .from("consultation_bookings")
        .insert(bookingData)
        .select()
        .single();

      if (error) {
        console.error("Error creating booking:", error);
        toast({
          title: "Booking Failed",
          description: "Unable to create your booking. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      // Send confirmation emails
      await sendConfirmationEmails(data as ConsultationBooking);

      toast({
        title: "Booking Confirmed!",
        description: "You will receive a confirmation email shortly.",
      });

      return data as ConsultationBooking;
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const sendConfirmationEmails = async (booking: ConsultationBooking) => {
    const emailData = {
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      bookingDate: format(new Date(booking.booking_date), "EEEE, MMMM d, yyyy"),
      bookingTime: booking.booking_time,
      consultationType: formatConsultationType(booking.consultation_type),
      eventType: booking.event_type,
      message: booking.message,
      bookingId: booking.id,
    };

    // Send customer confirmation
    try {
      await supabase.functions.invoke("send-notification-email", {
        body: {
          type: "booking_confirmation",
          to: booking.email,
          data: emailData,
        },
      });
    } catch (error) {
      console.error("Failed to send customer email:", error);
    }

    // Send admin alert
    try {
      await supabase.functions.invoke("send-notification-email", {
        body: {
          type: "admin_booking_alert",
          to: "info@tpecflowers.com",
          data: emailData,
        },
      });
    } catch (error) {
      console.error("Failed to send admin email:", error);
    }
  };

  const formatConsultationType = (type: string): string => {
    const types: Record<string, string> = {
      "meet-and-greet": "Meet & Greet",
      "event-planning": "Event Planning Consultation",
      "vendor-consultation": "Vendor Consultation",
    };
    return types[type] || type;
  };

  return {
    isLoading,
    getAvailableSlots,
    isDateAvailable,
    createBooking,
    fetchAvailability,
    fetchBlockedDates,
  };
};
