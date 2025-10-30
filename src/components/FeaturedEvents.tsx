
import EventCard from "./EventCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import techSummitImg from "@/assets/tech-summit-event.jpg";
import culturalFestivalImg from "@/assets/cultural-festival.jpg";
import summerPartyImg from "@/assets/summer-party.jpg";
import weddingExpoImg from "@/assets/wedding-expo.jpg";

const events = [
  {
    id: 1,
    title: "Lagos Tech Summit 2023",
    image: techSummitImg,
    date: "Oct 15, 2023 • 09:00 AM",
    location: "Eko Convention Center, Lagos",
    attendees: 1250,
    category: "Conference",
    isFeatured: true
  },
  {
    id: 2,
    title: "Adire Cultural Festival",
    image: culturalFestivalImg,
    date: "Nov 5, 2023 • 11:00 AM",
    location: "Abeokuta, Ogun State",
    attendees: 850,
    category: "Cultural",
    isFeatured: false
  },
  {
    id: 3,
    title: "Afrobeats Summer Party",
    image: summerPartyImg,
    date: "Dec 18, 2023 • 08:00 PM",
    location: "Landmark Beach, Victoria Island",
    attendees: 2000,
    category: "Entertainment",
    isFeatured: false
  },
  {
    id: 4,
    title: "Nigerian Wedding Expo",
    image: weddingExpoImg,
    date: "Jan 7, 2024 • 10:00 AM",
    location: "Eko Hotels & Suites, Lagos",
    attendees: 1500,
    category: "Expo",
    isFeatured: true
  }
];

const FeaturedEvents = () => {
  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">Featured Events</h2>
            <p className="text-gray-600 mt-2">Discover the hottest events happening in Nigeria</p>
          </div>
          <Button variant="link" className="text-jara-green font-medium hover:underline hidden md:block" asChild>
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
          <Button variant="link" className="text-jara-green font-medium hover:underline" asChild>
            <Link to="/events">View All Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
