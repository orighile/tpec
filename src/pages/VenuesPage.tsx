import { MapPin, Users, Star, Phone, Mail, Calendar, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const VenuesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Venues");
  const [selectedCity, setSelectedCity] = useState("All Cities");

  const categories = ["All Venues", "Wedding Halls", "Hotels", "Outdoor Spaces", "Conference Centers", "Banquet Halls"];
  const cities = ["All Cities", "Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano", "Enugu"];

  const nigerianVenues = [
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
      description: "Luxury 5-star hotel with world-class event facilities, perfect for grand weddings and corporate events.",
      image: "/lovable-uploads/venue-image-1.jpg"
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
      description: "Premier event center hosting high-profile weddings, conferences, and exhibitions in Lagos.",
      image: "/lovable-uploads/venue-image-2.jpg"
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
      description: "State-of-the-art event facility with modern amenities for upscale events and celebrations.",
      image: "/lovable-uploads/venue-image-3.jpg"
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
      description: "Abuja's most prestigious hotel offering exceptional service and elegant event spaces.",
      image: "/lovable-uploads/venue-image-4.jpg"
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
      description: "Nigeria's premier conference facility hosting international events, weddings, and exhibitions.",
      image: "/lovable-uploads/venue-image-1.jpg"
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
      description: "Port Harcourt's finest hotel for weddings and corporate events with riverside ambiance.",
      image: "/lovable-uploads/venue-image-2.jpg"
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
      description: "International hotel brand offering sophisticated venues for all types of events.",
      image: "/lovable-uploads/venue-image-3.jpg"
    },
    {
      id: 8,
      name: "Jogor Centre",
      location: "Ring Road",
      city: "Ibadan",
      category: "Conference Centers",
      capacity: "3000 guests",
      rating: 4.4,
      reviews: 156,
      features: ["Large Halls", "Modern Facilities", "Sound Systems", "Parking Space"],
      contact: "+234 2 810 3000",
      email: "events@jogorcentre.com",
      description: "Ibadan's leading event center for weddings, conferences, and social gatherings.",
      image: "/lovable-uploads/venue-image-4.jpg"
    },
    {
      id: 9,
      name: "Tahir Guest Palace",
      location: "Ibrahim Taiwo Road",
      city: "Kano",
      category: "Hotels",
      capacity: "2000 guests",
      rating: 4.6,
      reviews: 189,
      features: ["Grand Halls", "Traditional & Modern", "Full Services", "Secure Parking"],
      contact: "+234 64 632 900",
      email: "events@tahirguestpalace.com",
      description: "Premium hotel in Kano offering elegant venues for Northern Nigerian celebrations.",
      image: "/lovable-uploads/venue-image-1.jpg"
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
      description: "Stunning lakeside resort perfect for outdoor weddings and unique celebrations.",
      image: "/lovable-uploads/venue-image-2.jpg"
    },
  ];

  const filteredVenues = nigerianVenues.filter(venue => {
    const categoryMatch = selectedCategory === "All Venues" || venue.category === selectedCategory;
    const cityMatch = selectedCity === "All Cities" || venue.city === selectedCity;
    return categoryMatch && cityMatch;
  });

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
        description="Discover premium event venues in Lagos, Abuja, Port Harcourt and across Nigeria. Find the perfect space for weddings, corporate events, parties, and celebrations. Book your venue today."
        keywords="event venues Nigeria, wedding venues Lagos, conference halls Abuja, party venues Port Harcourt, banquet halls Nigeria, event spaces Lagos, Eko Hotel events, Transcorp Hilton, Landmark Centre"
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

        {/* Venues Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVenues.map((venue) => (
            <Card key={venue.id} className="tpec-card overflow-hidden group hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
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
                  </div>

                  <Button className="w-full gap-2" variant="default">
                    <Calendar className="h-4 w-4" />
                    Book Venue
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
            <Button variant="premium" size="lg">
              Get Venue Recommendations
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default VenuesPage;
