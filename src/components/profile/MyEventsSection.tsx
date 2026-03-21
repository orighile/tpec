import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

type Event = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string | null;
  location: string | null;
  capacity: number | null;
  category: string | null;
  cover_image_path: string | null;
  published: boolean | null;
  created_at: string;
};

export function MyEventsSection() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("owner_user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setEvents(data);
      }
      setIsLoading(false);
    };

    fetchEvents();
  }, [user]);

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>My Events</CardTitle>
          <CardDescription>Events you've created</CardDescription>
        </div>
        <Button size="sm" asChild>
          <Link to="/create-event">Create Event</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading events...</p>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No events yet</p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <Link to="/create-event">Create your first event</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="flex items-start gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                {event.cover_image_path ? (
                  <img
                    src={event.cover_image_path}
                    alt={event.title}
                    className="w-16 h-16 rounded-md object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{event.title}</h4>
                  {event.starts_at && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(event.starts_at), "MMM d, yyyy")}
                    </p>
                  )}
                  {event.location && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </p>
                  )}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${event.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {event.published ? "Published" : "Draft"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
