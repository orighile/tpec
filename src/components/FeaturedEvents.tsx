import EventCard from "./EventCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import lagosFashionWeekImg from "@/assets/events/lagos-fashion-week.jpg";
import artXLagosImg from "@/assets/events/art-x-lagos.jpg";
import felabrationImg from "@/assets/events/felabration.jpg";
import gtcoFoodFestivalImg from "@/assets/events/gtco-food-festival.jpg";

const events = [
  {
    id: 1,
    title: "Lagos Fashion Week 2024",
    image: lagosFashionWeekImg,
    date: "Oct 29 - Nov 2, 2024",
    location: "Federal Palace Hotel, Victoria Island",
    attendees: 5000,
    category: "Fashion",
    isFeatured: true
  },
  {
    id: 2,
    title: "ART X Lagos",
    image: artXLagosImg,
    date: "Nov 6-9, 2024",
    location: "Federal Palace Hotel, Lagos",
    attendees: 3500,
    category: "Art Fair",
    isFeatured: false
  },
  {
    id: 3,
    title: "Felabration 2024",
    image: felabrationImg,
    date: "Oct 14-20, 2024",
    location: "New Afrika Shrine, Lagos",
    attendees: 50000,
    category: "Music Festival",
    isFeatured: true
  },
  {
    id: 4,
    title: "GTCO Food & Drink Festival",
    image: gtcoFoodFestivalImg,
    date: "May 1-2, 2024",
    location: "Federal Palace Hotel, Lagos",
    attendees: 25000,
    category: "Food Festival",
    isFeatured: false
  }
];

const FeaturedEvents = () => {
  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Featured Events</h2>
            <p className="text-muted-foreground mt-2">Discover the hottest events happening in Nigeria</p>
          </div>
          <Button variant="link" className="text-primary font-medium hover:underline hidden md:block" asChild>
            <Link to="/events">View All Events</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard 
              key={event.id}
              id={event.id}
              title={event.title}
              image={event.image}
              date={event.date}
              location={event.location}
              attendees={event.attendees}
              category={event.category}
              isFeatured={event.isFeatured}
            />
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Button variant="link" className="text-primary font-medium hover:underline" asChild>
            <Link to="/events">View All Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
