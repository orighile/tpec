import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Heart, ChevronLeft, Share2, Clock, TicketIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import JaraBot from "@/components/jarabot";
import { addToCalendar, parseEventDateTime, parseEndDateTime, CalendarEvent } from "@/utils/calendarUtils";
import { toast } from "sonner";

// This would normally come from an API or database
const eventsData = [
  {
    id: 1,
    title: "Lagos Tech Summit 2023",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80",
    date: "Oct 15, 2023",
    time: "09:00 AM - 05:00 PM",
    location: "Eko Convention Center, Lagos",
    attendees: 1250,
    category: "Conference",
    description: "Join the largest tech gathering in West Africa. Connect with industry leaders, innovators, and tech enthusiasts from across the continent. This year's summit focuses on AI, blockchain, and the future of fintech in Africa.",
    organizer: "TechHub Africa",
    ticketPrice: "₦15,000 - ₦50,000",
    isFeatured: true,
    highlights: [
      "25+ Speakers from Global Tech Companies",
      "Networking with Top Industry Leaders",
      "Product Showcases from Leading Startups",
      "Workshops and Hands-on Sessions",
      "Recruitment Opportunities"
    ],
    speakers: [
      {
        name: "Adebayo Johnson",
        title: "CTO, AfriTech Solutions",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80"
      },
      {
        name: "Sarah Okafor",
        title: "CEO, DataSense Nigeria",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80"
      },
      {
        name: "Michael Adeyemi",
        title: "Head of Innovation, Google Nigeria",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80"
      }
    ]
  },
  {
    id: 2,
    title: "Adire Cultural Festival",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2369&q=80",
    date: "Nov 5, 2023",
    time: "11:00 AM - 08:00 PM",
    location: "Abeokuta, Ogun State",
    attendees: 850,
    category: "Cultural",
    description: "Experience the beauty and heritage of Adire textile making at this annual cultural festival. Witness master craftspeople at work, learn about traditional techniques, and shop for authentic Adire fabrics directly from artisans.",
    organizer: "Ogun State Cultural Board",
    ticketPrice: "₦5,000",
    isFeatured: false,
    highlights: [
      "Live Adire Cloth Making Demonstrations",
      "Cultural Performances and Dances",
      "Adire Fashion Show",
      "Traditional Food and Drinks",
      "Arts and Crafts Marketplace"
    ],
    speakers: []
  },
  {
    id: 3,
    title: "Afrobeats Summer Party",
    image: "https://images.unsplash.com/photo-1496024840928-4c417adf211d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80",
    date: "Dec 18, 2023",
    time: "08:00 PM - 04:00 AM",
    location: "Landmark Beach, Victoria Island",
    attendees: 2000,
    category: "Entertainment",
    description: "Dance the night away at Lagos' biggest Afrobeats beach party. Featuring top DJs and surprise performances from some of Nigeria's hottest artists, this is the summer event you don't want to miss.",
    organizer: "BeachVibes Entertainment",
    ticketPrice: "₦10,000 - ₦100,000 (VIP)",
    isFeatured: false,
    highlights: [
      "Multiple Stages with Different Music Genres",
      "Special Guest Performances",
      "Premium Beach Setup with Lounges",
      "Signature Cocktails and Food Vendors",
      "After-party at Exclusive Venues"
    ],
    speakers: []
  },
  {
    id: 4,
    title: "Nigerian Wedding Expo",
    image: "https://images.unsplash.com/photo-1519741347686-c1e331c20a2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2369&q=80",
    date: "Jan 7, 2024",
    time: "10:00 AM - 06:00 PM",
    location: "Eko Hotels & Suites, Lagos",
    attendees: 1500,
    category: "Expo",
    description: "The ultimate one-stop shop for couples planning their big day. Meet top wedding vendors, get expert advice, see the latest trends in Nigerian wedding fashion, and enjoy special discounts available only at the expo.",
    organizer: "Wedding Planners Association of Nigeria",
    ticketPrice: "₦7,500 (Couples discount available)",
    isFeatured: true,
    highlights: [
      "Fashion Shows Featuring Top Designers",
      "Live Demonstrations from Event Planners",
      "Exclusive Vendor Discounts for Attendees",
      "Wedding Food and Cake Tastings",
      "Wedding Planning Workshops"
    ],
    speakers: [
      {
        name: "Funke Williams",
        title: "Celebrity Wedding Planner",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80"
      },
      {
        name: "Tunde Kosoko",
        title: "Master of Ceremonies",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80"
      }
    ]
  }
];

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const eventId = parseInt(id || "0");
  
  const event = eventsData.find(e => e.id === eventId);
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCalendar = () => {
    if (!event) return;

    try {
      const startDate = parseEventDateTime(event.date, event.time);
      const endDate = parseEndDateTime(event.date, event.time);

      const calendarEvent: CalendarEvent = {
        title: event.title,
        description: `${event.description}\n\nOrganized by: ${event.organizer}\n\nTicket Price: ${event.ticketPrice}`,
        location: event.location,
        startDate,
        endDate
      };

      addToCalendar(calendarEvent);
      toast.success("Opening calendar app...");
    } catch (error) {
      console.error("Error adding to calendar:", error);
      toast.error("Unable to add to calendar. Please try again.");
    }
  };
  
  // If event not found
  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
              <p className="text-muted-foreground mb-6">The event you're looking for doesn't exist or has been moved.</p>
              <Button asChild>
                <Link to="/events">Back to Events</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
        <JaraBot />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
        <main className="flex-1 py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/events" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
              Back to Events
            </Link>
          </Button>
          
          {/* Event Header */}
          <div className="bg-background rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="h-72 md:h-96 relative">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
              {event.isFeatured && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-secondary text-secondary-foreground">Featured Event</Badge>
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="bg-background/80 hover:bg-background text-primary rounded-full w-8 h-8"
                >
                  <Heart className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="bg-background/80 hover:bg-background text-primary rounded-full w-8 h-8"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-background">
                <Badge className="mb-3 bg-primary/90">{event.category}</Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{event.attendees} attending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Event Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="bg-background rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                <p className="text-muted-foreground mb-6">{event.description}</p>
                
                <h3 className="text-xl font-bold mb-3">Event Highlights</h3>
                <ul className="space-y-2 mb-6">
                  {event.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2 font-bold">•</span>
                      <span className="text-muted-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
                
                {event.speakers.length > 0 && (
                  <>
                    <h3 className="text-xl font-bold mb-4">Featured Speakers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {event.speakers.map((speaker, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
                            <img 
                              src={speaker.image} 
                              alt={speaker.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h4 className="font-bold text-center">{speaker.name}</h4>
                          <p className="text-muted-foreground text-sm text-center">{speaker.title}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              <div className="bg-background rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-4">Organized by</h2>
                <p className="text-muted-foreground">{event.organizer}</p>
              </div>
            </div>
            
            <div>
              <div className="bg-background rounded-lg shadow-sm p-6 sticky top-4">
                <h3 className="text-xl font-bold mb-4">Event Information</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-muted-foreground text-sm">Date and Time</p>
                    <div className="flex items-center gap-2 font-medium">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{event.date}, {event.time}</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground text-sm">Location</p>
                    <div className="flex items-center gap-2 font-medium">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground text-sm">Ticket Price</p>
                    <div className="flex items-center gap-2 font-medium">
                      <TicketIcon className="w-4 h-4 text-primary" />
                      <span>{event.ticketPrice}</span>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full bg-primary hover:bg-primary/90 mb-3">
                  Get Tickets
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleAddToCalendar}
                >
                  Add to Calendar
                </Button>
              </div>
            </div>
          </div>
          
          {/* Related Events */}
          <div className="bg-background rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">Similar Events You Might Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {eventsData
                .filter(e => e.id !== event.id)
                .slice(0, 3)
                .map(related => (
                  <div key={related.id} className="border rounded-lg overflow-hidden group">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={related.image} 
                        alt={related.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <Badge className="mb-2">{related.category}</Badge>
                      <h3 className="font-bold text-lg mb-2">{related.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{related.date}</span>
                      </div>
                      <Button variant="outline" className="w-full" asChild>
                        <Link to={`/events/${related.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <JaraBot />
    </div>
  );
};

export default EventDetailPage;
