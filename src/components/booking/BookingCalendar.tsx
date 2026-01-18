import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, isBefore, startOfDay, addMonths } from "date-fns";
import { useConsultationBooking } from "@/hooks/useConsultationBooking";
import { Loader2 } from "lucide-react";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

const BookingCalendar = ({ selectedDate, onDateSelect }: BookingCalendarProps) => {
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchAvailability, fetchBlockedDates } = useConsultationBooking();

  useEffect(() => {
    loadDisabledDates();
  }, []);

  const loadDisabledDates = async () => {
    setIsLoading(true);
    try {
      const [availability, blockedDates] = await Promise.all([
        fetchAvailability(),
        fetchBlockedDates(),
      ]);

      // Get unavailable days of week
      const unavailableDays = new Set<number>();
      for (let i = 0; i <= 6; i++) {
        const dayAvailable = availability.find(
          (a) => a.day_of_week === i && a.is_available
        );
        if (!dayAvailable) {
          unavailableDays.add(i);
        }
      }

      // Generate disabled dates for the next 3 months
      const disabled: Date[] = [];
      const today = new Date();
      const endDate = addMonths(today, 3);

      let currentDate = new Date(today);
      while (currentDate <= endDate) {
        // Disable if day of week is unavailable
        if (unavailableDays.has(currentDate.getDay())) {
          disabled.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Add blocked dates
      blockedDates.forEach((bd) => {
        disabled.push(new Date(bd.blocked_date));
      });

      setDisabledDates(disabled);
    } catch (error) {
      console.error("Error loading disabled dates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isDateDisabled = (date: Date) => {
    // Disable past dates
    if (isBefore(startOfDay(date), startOfDay(new Date()))) {
      return true;
    }
    
    // Check if date is in disabled list
    return disabledDates.some(
      (d) => format(d, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        disabled={isDateDisabled}
        className="rounded-md border pointer-events-auto"
        fromDate={new Date()}
        toDate={addMonths(new Date(), 3)}
      />
      <p className="text-sm text-muted-foreground mt-2">
        Select a date to see available times
      </p>
    </div>
  );
};

export default BookingCalendar;
