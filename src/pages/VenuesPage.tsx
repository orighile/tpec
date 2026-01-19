import { MapPin, Users, Star, Phone, Mail, Calendar, Building2, Search, Sparkles, ChevronLeft, ChevronRight, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Eko Hotel & Suites images
import ekoExterior from "@/assets/venues/eko-hotel-exterior.jpg";
import ekoBallroom from "@/assets/venues/eko-hotel-ballroom.jpg";
import ekoGarden from "@/assets/venues/eko-hotel-garden.jpg";

// Civic Centre images
import civicExterior from "@/assets/venues/civic-centre-exterior.jpg";
import civicHall from "@/assets/venues/civic-centre-hall.jpg";

// Landmark Centre images
import landmarkExterior from "@/assets/venues/landmark-exterior.jpg";
import landmarkHall from "@/assets/venues/landmark-hall.jpg";

// Transcorp Hilton images
import transcorpExterior from "@/assets/venues/transcorp-exterior.jpg";
import transcorpBallroom from "@/assets/venues/transcorp-ballroom.jpg";

// ICC Abuja images
import iccExterior from "@/assets/venues/icc-exterior.jpg";
import iccHall from "@/assets/venues/icc-hall.jpg";

// Hotel Presidential images
import presidentialExterior from "@/assets/venues/presidential-exterior.jpg";
import presidentialHall from "@/assets/venues/presidential-hall.jpg";

// Le Meridien images
import meridienExterior from "@/assets/venues/meridien-exterior.jpg";
import meridienHall from "@/assets/venues/meridien-hall.jpg";

// Jogor Centre images
import jogorExterior from "@/assets/venues/jogor-exterior.jpg";
import jogorHall from "@/assets/venues/jogor-hall.jpg";

// Tahir Guest Palace images
import tahirExterior from "@/assets/venues/tahir-exterior.jpg";
import tahirHall from "@/assets/venues/tahir-hall.jpg";

// Nike Lake Resort images
import nikeLakeExterior from "@/assets/venues/nike-lake-exterior.jpg";
import nikeLakeGarden from "@/assets/venues/nike-lake-garden.jpg";
import nikeLakeCruise from "@/assets/venues/nike-lake-cruise.jpg";

// Protea Hotel Benin City images
import proteaBeninExterior from "@/assets/venues/protea-benin-exterior.jpg";
import proteaBeninHall from "@/assets/venues/protea-benin-hall.jpg";

// Grand Central Hotel Asaba images
import grandCentralExterior from "@/assets/venues/grand-central-asaba-exterior.jpg";
import grandCentralHall from "@/assets/venues/grand-central-asaba-hall.jpg";

interface VenueImage {
  src: string;
  label: string;
}

interface Venue {
  id: number;
  name: string;
  location: string;
  city: string;
  category: string;
  capacity: string;
  rating: number;
  reviews: number;
  features: string[];
  contact: string;
  email: string;
  website?: string;
  description: string;
  images: VenueImage[];
}

const VenuesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Venues");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingVenue, setBookingVenue] = useState<Venue | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(false);
  const [imageIndices, setImageIndices] = useState<Record<number, number>>({});
  
  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    eventType: "",
    guestCount: "",
    message: ""
  });

  // Recommendation form state
  const [recommendationForm, setRecommendationForm] = useState({
    eventType: "",
    guestCount: "",
    budget: "",
    city: "",
    requirements: ""
  });

  const categories = ["All Venues", "Wedding Halls", "Hotels", "Outdoor Spaces", "Conference Centers", "Banquet Halls"];
  const cities = ["All Cities", "Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano", "Enugu", "Benin City", "Asaba"];

  const nigerianVenues: Venue[] = [
    {
      id: 1,
      name: "Eko Hotel & Suites",
      location: "Victoria Island",
      city: "Lagos",
      category: "Hotels",
      capacity: "5000 guests",
      rating: 4.8,
      reviews: 342,
      features: ["Ocean View", "Grand Ballroom", "Outdoor Garden", "Parking", "AC Halls"],
      contact: "+234 1 277 7000",
      email: "events@ekohotels.com",
      website: "https://www.ekohotels.com",
      description: "Luxury 5-star hotel with world-class event facilities, perfect for grand weddings and corporate events.",
      images: [
        { src: ekoExterior, label: "Hotel Exterior" },
        { src: ekoBallroom, label: "Grand Ballroom" },
        { src: ekoGarden, label: "Garden Venue" }
      ]
    },
    {
      id: 2,
      name: "The Civic Centre",
      location: "Victoria Island",
      city: "Lagos",
      category: "Conference Centers",
      capacity: "3000 guests",
      rating: 4.5,
      reviews: 256,
      features: ["Large Hall", "Stage Setup", "Sound System", "Parking", "Central Location"],
      contact: "+234 1 270 1261",
      email: "booking@civiccentrelagos.com",
      website: "https://www.theciviccentre.com",
      description: "Premier event center hosting high-profile weddings, conferences, and exhibitions in Lagos.",
      images: [
        { src: civicExterior, label: "Building Exterior" },
        { src: civicHall, label: "Grand Banquet Hall" }
      ]
    },
    {
      id: 3,
      name: "Landmark Event Centre",
      location: "Oniru, Victoria Island",
      city: "Lagos",
      category: "Conference Centers",
      capacity: "4000 guests",
      rating: 4.7,
      reviews: 298,
      features: ["Modern Design", "Multiple Halls", "VIP Lounges", "Generator", "Security"],
      contact: "+234 1 271 2005",
      email: "events@landmarkeventcentre.com",
      website: "https://landmarklagos.com",
      description: "State-of-the-art event facility with modern amenities for upscale events and celebrations.",
      images: [
        { src: landmarkExterior, label: "Centre Exterior" },
        { src: landmarkHall, label: "Event Hall" }
      ]
    },
    {
      id: 4,
      name: "Transcorp Hilton Abuja",
      location: "Central Business District",
      city: "Abuja",
      category: "Hotels",
      capacity: "2500 guests",
      rating: 4.9,
      reviews: 412,
      features: ["Luxury Ballroom", "Presidential Suite", "Garden", "5-Star Service", "Catering"],
      contact: "+234 9 461 3000",
      email: "abuja.events@hilton.com",
      website: "https://www.hilton.com/en/hotels/abuhitw-transcorp-hilton-abuja",
      description: "Abuja's most prestigious hotel offering exceptional service and elegant event spaces.",
      images: [
        { src: transcorpExterior, label: "Hotel Exterior" },
        { src: transcorpBallroom, label: "Luxury Ballroom" }
      ]
    },
    {
      id: 5,
      name: "International Conference Centre",
      location: "Central Area",
      city: "Abuja",
      category: "Conference Centers",
      capacity: "5000 guests",
      rating: 4.6,
      reviews: 234,
      features: ["Massive Halls", "International Standard", "Tech Equipment", "Ample Parking"],
      contact: "+234 9 314 6000",
      email: "booking@iccabuja.com",
      website: "https://myfctagov.ng/directory/abuja-international-conference-centre",
      description: "Nigeria's premier conference facility hosting international events, weddings, and exhibitions.",
      images: [
        { src: iccExterior, label: "ICC Building" },
        { src: iccHall, label: "Africa Hall" }
      ]
    },
    {
      id: 6,
      name: "Hotel Presidential",
      location: "GRA Phase 2",
      city: "Port Harcourt",
      category: "Hotels",
      capacity: "1500 guests",
      rating: 4.5,
      reviews: 178,
      features: ["Riverside View", "Elegant Halls", "Full Catering", "Parking", "Security"],
      contact: "+234 84 230 9000",
      email: "events@hotelpresidentialph.com",
      website: "https://hotelpresidential.com",
      description: "Port Harcourt's finest hotel for weddings and corporate events with riverside ambiance.",
      images: [
        { src: presidentialExterior, label: "Hotel Exterior" },
        { src: presidentialHall, label: "Banquet Hall" }
      ]
    },
    {
      id: 7,
      name: "Le Meridien Ogeyi Place",
      location: "Old GRA",
      city: "Port Harcourt",
      category: "Hotels",
      capacity: "2000 guests",
      rating: 4.7,
      reviews: 201,
      features: ["Luxury Ballroom", "Modern Facilities", "Professional Catering", "Valet Service"],
      contact: "+234 84 835 8000",
      email: "events.porthart@lemeridien.com",
      website: "https://www.marriott.com/en-us/hotels/phlmd-le-meridien-ogeyi-place",
      description: "International hotel brand offering sophisticated venues for all types of events.",
      images: [
        { src: meridienExterior, label: "Hotel Exterior" },
        { src: meridienHall, label: "Akuma Hall" }
      ]
    },
    {
      id: 8,
      name: "Jogor Centre",
      location: "Ring Road",
      city: "Ibadan",
      category: "Banquet Halls",
      capacity: "3000 guests",
      rating: 4.4,
      reviews: 156,
      features: ["Large Halls", "Modern Facilities", "Sound Systems", "Parking Space"],
      contact: "+234 2 810 3000",
      email: "events@jogorcentre.com",
      website: "https://jogorcentre.com",
      description: "Ibadan's leading event center for weddings, conferences, and social gatherings.",
      images: [
        { src: jogorExterior, label: "Centre Exterior" },
        { src: jogorHall, label: "Hall of Grace" }
      ]
    },
    {
      id: 9,
      name: "Tahir Guest Palace",
      location: "Ibrahim Taiwo Road",
      city: "Kano",
      category: "Wedding Halls",
      capacity: "2000 guests",
      rating: 4.6,
      reviews: 189,
      features: ["Grand Halls", "Traditional & Modern", "Full Services", "Secure Parking"],
      contact: "+234 64 632 900",
      email: "events@tahirguestpalace.com",
      website: "https://tahirguestpalace.com",
      description: "Premium hotel in Kano offering elegant venues for Northern Nigerian celebrations.",
      images: [
        { src: tahirExterior, label: "Palace Exterior" },
        { src: tahirHall, label: "Grand Wedding Hall" }
      ]
    },
    {
      id: 10,
      name: "Nike Lake Resort",
      location: "Nike Lake",
      city: "Enugu",
      category: "Outdoor Spaces",
      capacity: "1200 guests",
      rating: 4.8,
      reviews: 223,
      features: ["Lakeside View", "Gardens", "Boat Cruise", "Open Air", "Accommodation"],
      contact: "+234 42 459 176",
      email: "events@nikelakeresort.com",
      website: "https://nikelakeresorthotel.com.ng",
      description: "Stunning lakeside resort perfect for outdoor weddings and unique celebrations.",
      images: [
        { src: nikeLakeExterior, label: "Resort Aerial View" },
        { src: nikeLakeGarden, label: "Garden Wedding Setup" },
        { src: nikeLakeCruise, label: "Lake Cruise Event" }
      ]
    },
    {
      id: 11,
      name: "Protea Hotel by Marriott",
      location: "GRA, Benin City",
      city: "Benin City",
      category: "Hotels",
      capacity: "800 guests",
      rating: 4.5,
      reviews: 134,
      features: ["Modern Design", "Elegant Ballroom", "Professional Catering", "Ample Parking", "AC Halls"],
      contact: "+234 52 250 8000",
      email: "events@proteabenin.com",
      website: "https://www.marriott.com/hotels/travel/bninb-protea-hotel-benin-city",
      description: "International standard hotel in Edo State offering sophisticated event spaces for weddings and conferences.",
      images: [
        { src: proteaBeninExterior, label: "Hotel Exterior" },
        { src: proteaBeninHall, label: "Elegant Ballroom" }
      ]
    },
    {
      id: 12,
      name: "Grand Central Hotel",
      location: "Okpanam Road",
      city: "Asaba",
      category: "Hotels",
      capacity: "1000 guests",
      rating: 4.6,
      reviews: 167,
      features: ["Grand Ballroom", "VIP Lounge", "Full Catering", "Security", "Generator"],
      contact: "+234 56 280 5000",
      email: "events@grandcentralasaba.com",
      website: "https://grandcentralasaba.com",
      description: "Delta State's premier hotel venue for elegant weddings, corporate events, and celebrations.",
      images: [
        { src: grandCentralExterior, label: "Hotel Exterior" },
        { src: grandCentralHall, label: "Wedding Hall" }
      ]
    },
  ];

  const filteredVenues = nigerianVenues.filter(venue => {
    const categoryMatch = selectedCategory === "All Venues" || venue.category === selectedCategory;
    const cityMatch = selectedCity === "All Cities" || venue.city === selectedCity;
    const searchMatch = searchQuery === "" || 
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.description.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && cityMatch && searchMatch;
  });

  const handleBookVenue = (venue: Venue) => {
    setBookingVenue(venue);
    setIsBookingOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email || !bookingForm.eventDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success(`Booking request sent for ${bookingVenue?.name}! We'll contact you shortly.`);
    setIsBookingOpen(false);
    setBookingForm({
      name: "",
      email: "",
      phone: "",
      eventDate: "",
      eventType: "",
      guestCount: "",
      message: ""
    });
  };

  const handleRecommendationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recommendationForm.eventType || !recommendationForm.guestCount) {
      toast.error("Please fill in required fields");
      return;
    }
    toast.success("We've received your request! Our team will send personalized venue recommendations to your email shortly.");
    setIsRecommendationOpen(false);
    setRecommendationForm({
      eventType: "",
      guestCount: "",
      budget: "",
      city: "",
      requirements: ""
    });
  };

  const nextImage = (venueId: number, totalImages: number) => {
    setImageIndices(prev => ({
      ...prev,
      [venueId]: ((prev[venueId] || 0) + 1) % totalImages
    }));
  };

  const prevImage = (venueId: number, totalImages: number) => {
    setImageIndices(prev => ({
      ...prev,
      [venueId]: ((prev[venueId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  const getCurrentImageIndex = (venueId: number) => imageIndices[venueId] || 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Event Venues in Nigeria",
    "description": "Premium event venues for weddings, corporate events, and celebrations in Lagos, Abuja, Port Harcourt and across Nigeria"
  };

  return (
    <>
      <SEO 
        title="Top Event Venues in Nigeria - Lagos, Abuja & Port Harcourt Wedding Halls | TPEC Events"
        description="Discover premium event venues in Lagos, Abuja, Port Harcourt, Benin City, Asaba and across Nigeria. Find the perfect space for weddings, corporate events, parties, and celebrations. Book your venue today."
        keywords="event venues Nigeria, wedding venues Lagos, conference halls Abuja, party venues Port Harcourt, banquet halls Nigeria, event spaces Lagos, Eko Hotel events, Transcorp Hilton, Landmark Centre, Benin City venues, Asaba venues"
        jsonLd={jsonLd}
      />

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            Premium Event Venues
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover Nigeria's finest event spaces for weddings, corporate events, and celebrations
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search venues by name, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-full border-2 focus:border-primary"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-12 justify-center">
          {/* City Dropdown */}
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-[180px] rounded-full">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent className="bg-card/98 backdrop-blur-xl border border-border z-[100]">
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Buttons */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="default"
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredVenues.length}</span> venue{filteredVenues.length !== 1 ? 's' : ''}
            {selectedCategory !== "All Venues" && ` in ${selectedCategory}`}
            {selectedCity !== "All Cities" && ` • ${selectedCity}`}
          </p>
        </div>

        {/* Venues Grid */}
        {filteredVenues.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVenues.map((venue) => {
              const currentIndex = getCurrentImageIndex(venue.id);
              const currentImage = venue.images[currentIndex];
              
              return (
                <Card key={venue.id} className="tpec-card overflow-hidden group hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={currentImage.src}
                      alt={`${venue.name} - ${currentImage.label}`}
                      className="w-full h-full object-cover transition-transform duration-500"
                    />
                    
                    {/* Image Navigation */}
                    {venue.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            prevImage(venue.id, venue.images.length);
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            nextImage(venue.id, venue.images.length);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100"
                          aria-label="Next image"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        
                        {/* Image Indicators */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {venue.images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setImageIndices(prev => ({ ...prev, [venue.id]: idx }));
                              }}
                              className={`w-2 h-2 rounded-full transition-all ${
                                idx === currentIndex 
                                  ? 'bg-white w-4' 
                                  : 'bg-white/50 hover:bg-white/75'
                              }`}
                              aria-label={`View image ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Image Label */}
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                      {currentImage.label}
                    </div>

                    <Badge className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm">
                      {venue.category}
                    </Badge>
                    <Badge className="absolute top-4 left-4 bg-secondary/90 backdrop-blur-sm text-secondary-foreground">
                      {venue.city}
                    </Badge>
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-xl font-bold text-foreground">
                        {venue.name}
                      </CardTitle>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-secondary text-secondary" />
                        <span className="font-semibold">{venue.rating}</span>
                        <span className="text-muted-foreground">({venue.reviews})</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{venue.location}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {venue.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="font-medium">Capacity: {venue.capacity}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {venue.features.slice(0, 3).map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="space-y-2 text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          <span>{venue.contact}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{venue.email}</span>
                        </div>
                        {venue.website && (
                          <div className="flex items-center gap-2">
                            <Globe className="h-3 w-3" />
                            <a 
                              href={venue.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline truncate"
                            >
                              Visit Website
                            </a>
                          </div>
                        )}
                      </div>

                      <Button 
                        className="w-full gap-2" 
                        variant="default"
                        onClick={() => handleBookVenue(venue)}
                      >
                        <Calendar className="h-4 w-4" />
                        Book Venue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No venues found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search query
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                setSelectedCategory("All Venues");
                setSelectedCity("All Cities");
                setSearchQuery("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <Card className="mt-16 bg-gradient-to-br from-primary/8 via-background to-secondary/8 border-2 border-dashed border-primary/30 overflow-hidden relative">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary rounded-full blur-3xl"></div>
          </div>
          <CardContent className="p-12 text-center relative z-10">
            <MapPin className="h-16 w-16 text-primary mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-3 text-foreground">Can't Find Your Perfect Venue?</h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
              Let our expert team help you discover the ideal location for your special event
            </p>
            <Dialog open={isRecommendationOpen} onOpenChange={setIsRecommendationOpen}>
              <DialogTrigger asChild>
                <Button variant="premium" size="lg" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  Get Venue Recommendations
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Get Personalized Venue Recommendations</DialogTitle>
                  <DialogDescription>
                    Tell us about your event and we'll suggest perfect venues for you.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleRecommendationSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="rec-event-type">Event Type *</Label>
                    <Select 
                      value={recommendationForm.eventType} 
                      onValueChange={(value) => setRecommendationForm({...recommendationForm, eventType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wedding">Wedding</SelectItem>
                        <SelectItem value="corporate">Corporate Event</SelectItem>
                        <SelectItem value="birthday">Birthday Party</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rec-guests">Expected Guests *</Label>
                    <Input
                      id="rec-guests"
                      type="number"
                      placeholder="e.g., 500"
                      value={recommendationForm.guestCount}
                      onChange={(e) => setRecommendationForm({...recommendationForm, guestCount: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rec-budget">Budget Range</Label>
                    <Select 
                      value={recommendationForm.budget} 
                      onValueChange={(value) => setRecommendationForm({...recommendationForm, budget: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-500k">Under ₦500,000</SelectItem>
                        <SelectItem value="500k-1m">₦500,000 - ₦1,000,000</SelectItem>
                        <SelectItem value="1m-3m">₦1,000,000 - ₦3,000,000</SelectItem>
                        <SelectItem value="3m-5m">₦3,000,000 - ₦5,000,000</SelectItem>
                        <SelectItem value="above-5m">Above ₦5,000,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rec-city">Preferred City</Label>
                    <Select 
                      value={recommendationForm.city} 
                      onValueChange={(value) => setRecommendationForm({...recommendationForm, city: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.filter(c => c !== "All Cities").map((city) => (
                          <SelectItem key={city} value={city.toLowerCase()}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rec-requirements">Special Requirements</Label>
                    <Textarea
                      id="rec-requirements"
                      placeholder="Outdoor space, parking, catering services..."
                      value={recommendationForm.requirements}
                      onChange={(e) => setRecommendationForm({...recommendationForm, requirements: e.target.value})}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Get Recommendations
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book {bookingVenue?.name}</DialogTitle>
            <DialogDescription>
              Fill in your details to request a booking for this venue.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBookingSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="book-name">Your Name *</Label>
              <Input
                id="book-name"
                placeholder="Enter your full name"
                value={bookingForm.name}
                onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="book-email">Email Address *</Label>
              <Input
                id="book-email"
                type="email"
                placeholder="your@email.com"
                value={bookingForm.email}
                onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="book-phone">Phone Number</Label>
              <Input
                id="book-phone"
                type="tel"
                placeholder="+234..."
                value={bookingForm.phone}
                onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="book-date">Event Date *</Label>
              <Input
                id="book-date"
                type="date"
                value={bookingForm.eventDate}
                onChange={(e) => setBookingForm({...bookingForm, eventDate: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="book-type">Event Type</Label>
              <Select 
                value={bookingForm.eventType} 
                onValueChange={(value) => setBookingForm({...bookingForm, eventType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="corporate">Corporate Event</SelectItem>
                  <SelectItem value="birthday">Birthday Party</SelectItem>
                  <SelectItem value="conference">Conference</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="book-guests">Expected Guests</Label>
              <Input
                id="book-guests"
                type="number"
                placeholder="Number of guests"
                value={bookingForm.guestCount}
                onChange={(e) => setBookingForm({...bookingForm, guestCount: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="book-message">Additional Notes</Label>
              <Textarea
                id="book-message"
                placeholder="Any special requirements or questions..."
                value={bookingForm.message}
                onChange={(e) => setBookingForm({...bookingForm, message: e.target.value})}
              />
            </div>

            <Button type="submit" className="w-full gap-2">
              <Calendar className="h-4 w-4" />
              Submit Booking Request
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VenuesPage;
