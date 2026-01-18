import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { format, parse } from "date-fns";
import { useConsultationBooking } from "@/hooks/useConsultationBooking";
import { Loader2, Clock } from "lucide-react";

interface TimeSlotPickerProps {
  selectedDate: Date;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
}

const TimeSlotPicker = ({ selectedDate, selectedTime, onTimeSelect }: TimeSlotPickerProps) => {
  const [slots, setSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getAvailableSlots } = useConsultationBooking();

  useEffect(() => {
    loadSlots();
  }, [selectedDate]);

  const loadSlots = async () => {
    setIsLoading(true);
    try {
      const availableSlots = await getAvailableSlots(selectedDate);
      setSlots(availableSlots);
    } catch (error) {
      console.error("Error loading slots:", error);
      setSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeSlot = (time: string): string => {
    const parsed = parse(time, "HH:mm", new Date());
    return format(parsed, "h:mm a");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <span>Loading available times...</span>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center p-8">
        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">
          No available slots for {format(selectedDate, "EEEE, MMMM d, yyyy")}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Please select a different date
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-medium mb-3 flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Available times for {format(selectedDate, "EEEE, MMMM d")}
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map((slot) => (
          <Button
            key={slot}
            variant={selectedTime === slot ? "default" : "outline"}
            size="sm"
            onClick={() => onTimeSelect(slot)}
            className={`${
              selectedTime === slot
                ? "bg-primary text-primary-foreground"
                : "hover:bg-primary/10"
            }`}
          >
            {formatTimeSlot(slot)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotPicker;
