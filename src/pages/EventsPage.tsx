import { Link } from "react-router-dom";
import FeaturedEvents from "../components/FeaturedEvents";
import { Button } from "@/components/ui/button";
import { PlusCircle, Filter, SlidersHorizontal } from "lucide-react";
import { SEO } from "@/components/SEO";

const EventsPage = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    "name": "Nigerian Events",
    "description": "Discover weddings, corporate events, birthdays, and cultural celebrations across Nigeria",
    "organizer": {
      "@type": "Organization",
      "name": "TPEC Events",
      "url": "https://tpecevents.com"
    }
  };

  return (
    <>
      <SEO 
        title="Events in Nigeria - Weddings, Corporate & Cultural Celebrations | TPEC"
        description="Discover and create memorable events in Nigeria. Browse weddings, corporate events, birthday parties, and cultural celebrations in Lagos, Abuja, and beyond."
        keywords="Nigerian events, Lagos weddings, corporate events Nigeria, birthday parties, cultural celebrations, event discovery Nigeria"
        jsonLd={jsonLd}
      />
      <main className="flex-1 py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Events</h1>
              <p className="text-xl text-muted-foreground">
                Discover and create memorable Nigerian events
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild>
                <Link to="/events/create">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Event
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="mb-8 p-4 bg-card rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Filter Events</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  All Events
                </Button>
                <Button variant="outline" size="sm">
                  This Weekend
                </Button>
                <Button variant="outline" size="sm">
                  This Month
                </Button>
                <Button variant="outline" size="sm">
                  Free Events
                </Button>
              </div>
              
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <SlidersHorizontal className="h-4 w-4" />
                Advanced Filters
              </Button>
            </div>
          </div>
          
          <FeaturedEvents />
          
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold mb-4">Don't See What You're Looking For?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Create your own event and let us help you plan it from start to finish with our comprehensive tools and vendor network.
            </p>
            <Button 
              asChild
              size="lg"
            >
              <Link to="/events/create">
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Your Event
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default EventsPage;
