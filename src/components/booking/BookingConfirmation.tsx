import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Calendar, Clock, User, Mail, Phone, CalendarPlus } from "lucide-react";
import { format, parse } from "date-fns";
import { Link } from "react-router-dom";
import { ConsultationBooking } from "@/hooks/useConsultationBooking";

interface BookingConfirmationProps {
  booking: ConsultationBooking;
}

const BookingConfirmation = ({ booking }: BookingConfirmationProps) => {
  const formatConsultationType = (type: string): string => {
    const types: Record<string, string> = {
      "meet-and-greet": "Meet & Greet",
      "event-planning": "Event Planning Consultation",
      "vendor-consultation": "Vendor Consultation",
    };
    return types[type] || type;
  };

  const formatTime = (time: string): string => {
    const parsed = parse(time, "HH:mm", new Date());
    return format(parsed, "h:mm a");
  };

  const generateGoogleCalendarUrl = () => {
    const bookingDate = new Date(booking.booking_date);
    const [hours, minutes] = booking.booking_time.split(":").map(Number);
    bookingDate.setHours(hours, minutes, 0);
    
    const endDate = new Date(bookingDate);
    endDate.setMinutes(endDate.getMinutes() + 30);

    const formatForGoogle = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d{3}/g, "");
    };

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `TPEC Events - ${formatConsultationType(booking.consultation_type)}`,
      dates: `${formatForGoogle(bookingDate)}/${formatForGoogle(endDate)}`,
      details: `Consultation with TPEC Events\n\nReference: #${booking.id.slice(0, 8).toUpperCase()}\n\nContact: info@tpecflowers.com | +234 9053065636`,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      </div>

      <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
      <p className="text-muted-foreground mb-6">
        Your consultation has been scheduled. A confirmation email has been sent to {booking.email}
      </p>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-left">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">
                  {format(new Date(booking.booking_date), "EEEE, MMMM d, yyyy")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-left">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium">{formatTime(booking.booking_time)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-left">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{booking.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-left">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{booking.email}</p>
              </div>
            </div>

            {booking.phone && (
              <div className="flex items-center gap-3 text-left">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{booking.phone}</p>
                </div>
              </div>
            )}

            <div className="border-t pt-4 mt-4">
              <p className="text-sm text-muted-foreground">Booking Reference</p>
              <p className="font-mono font-bold text-lg">
                #{booking.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild variant="outline">
          <a
            href={generateGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            Add to Google Calendar
          </a>
        </Button>
        <Button asChild>
          <Link to="/">Return Home</Link>
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mt-6">
        Need to reschedule? Contact us at{" "}
        <a href="mailto:info@tpecflowers.com" className="text-primary hover:underline">
          info@tpecflowers.com
        </a>{" "}
        or call{" "}
        <a href="tel:+2349053065636" className="text-primary hover:underline">
          +234 9053065636
        </a>
      </p>
    </div>
  );
};

export default BookingConfirmation;
