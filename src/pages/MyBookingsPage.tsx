import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useVendorBookings } from "@/hooks/useVendorBookings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Package } from "lucide-react";
import { Link } from "react-router-dom";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const MyBookingsPage = () => {
  const { user } = useAuth();
  const { useUserBookings, updateBookingStatus } = useVendorBookings();
  const { data: bookings, isLoading } = useUserBookings();

  const handleCancel = (bookingId: string) => {
    updateBookingStatus.mutate({ bookingId, status: "cancelled" });
  };

  if (!user) {
    return (
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 text-center py-20">
          <h1 className="text-3xl font-bold mb-4">My Bookings</h1>
          <p className="text-muted-foreground mb-6">Please sign in to view your bookings.</p>
          <Button asChild><Link to="/auth">Sign In</Link></Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 py-12 bg-muted/30">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-muted-foreground mb-8">Track and manage your vendor bookings</p>

        {isLoading ? (
          <p className="text-muted-foreground">Loading bookings...</p>
        ) : !bookings || bookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
              <p className="text-muted-foreground mb-4">Browse vendors and book services for your event.</p>
              <Button asChild><Link to="/vendors">Browse Vendors</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking: any) => {
              let details: any = {};
              try {
                details = typeof booking.notes === "string" ? JSON.parse(booking.notes) : (booking.booking_details || {});
              } catch { details = {}; }

              return (
                <Card key={booking.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">Booking #{booking.id.slice(0, 8)}</CardTitle>
                        <CardDescription>
                          {new Date(booking.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge className={statusColors[booking.status] || "bg-muted"}>
                        {booking.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      {details.event_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(details.event_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {details.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{details.location}</span>
                        </div>
                      )}
                      {details.guest_count > 0 && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{details.guest_count} guests</span>
                        </div>
                      )}
                      {booking.amount && (
                        <div className="font-semibold text-primary">
                          ₦{Number(booking.amount).toLocaleString()}
                        </div>
                      )}
                    </div>
                    {booking.status === "pending" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancel(booking.id)}
                        disabled={updateBookingStatus.isPending}
                      >
                        Cancel Booking
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyBookingsPage;
