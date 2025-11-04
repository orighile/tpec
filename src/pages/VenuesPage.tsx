import { MapPin, Users, Star, Phone, Mail, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { useState } from "react";

const VenuesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Venues");

  const categories = ["All Venues", "Wedding Halls", "Hotels", "Outdoor Spaces", "Conference Centers", "Banquet Halls"];

  const nigerianVenues = [
    {
      id: 1,
      name: "Eko Hotel & Suites",
      location: "Victoria Island, Lagos",
      category: "Hotels",
      capacity: "5000 guests",
      rating: 4.8,
      reviews: 342,
      price: "₦2,500,000 - ₦8,000,000",
      features: ["Ocean View", "Grand Ballroom", "Outdoor Garden", "Parking", "AC Halls"],
      contact: "+234 1 277 7000",
      email: "events@ekohotels.com",
      description: "Luxury 5-star hotel with world-class event facilities, perfect for grand weddings and corporate events.",
      image: "/lovable-uploads/venue-image-1.jpg"
    },
    {
      id: 2,
      name: "The Civic Centre",
      location: "Victoria Island, Lagos",
      category: "Conference Centers",
      capacity: "3000 guests",
      rating: 4.5,
      reviews: 256,
      price: "₦1,500,000 - ₦5,000,000",
      features: ["Large Hall", "Stage Setup", "Sound System", "Parking", "Central Location"],
      contact: "+234 1 270 1261",
      email: "booking@civiccentrelagos.com",
      description: "Premier event center hosting high-profile weddings, conferences, and exhibitions in Lagos.",
      image: "/lovable-uploads/venue-image-2.jpg"
    },
    {
      id: 3,
      name: "Landmark Event Centre",
      location: "Oniru, Victoria Island, Lagos",
      category: "Conference Centers",
      capacity: "4000 guests",
      rating: 4.7,
      reviews: 298,
      price: "₦2,000,000 - ₦6,000,000",
      features: ["Modern Design", "Multiple Halls", "VIP Lounges", "Generator", "Security"],
      contact: "+234 1 271 2005",
      email: "events@landmarkeventcentre.com",
      description: "State-of-the-art event facility with modern amenities for upscale events and celebrations.",
      image: "/lovable-uploads/venue-image-3.jpg"
    },
    {
      id: 4,
      name: "Transcorp Hilton Abuja",
      location: "Central Business District, Abuja",
      category: "Hotels",
      capacity: "2500 guests",
      rating: 4.9,
      reviews: 412,
      price: "₦3,000,000 - ₦10,000,000",
      features: ["Luxury Ballroom", "Presidential Suite", "Garden", "5-Star Service", "Catering"],
      contact: "+234 9 461 3000",
      email: "abuja.events@hilton.com",
      description: "Abuja's most prestigious hotel offering exceptional service and elegant event spaces.",
      image: "/lovable-uploads/venue-image-4.jpg"
    },
    {
      id: 5,
      name: "Harbour Point",
      location: "Victoria Island, Lagos",
      category: "Outdoor Spaces",
      capacity: "1500 guests",
      rating: 4.6,
      reviews: 187,
      price: "₦1,800,000 - ₦4,500,000",
      features: ["Waterfront View", "Open Air", "Modern Architecture", "Parking", "Restaurants"],
      contact: "+234 1 631 0075",
      email: "events@harbourpoint.ng",
      description: "Stunning waterfront location perfect for outdoor weddings and upscale events with ocean views.",
      image: "/lovable-uploads/venue-image-1.jpg"
    },
    {
      id: 6,
      name: "Oriental Hotel",
      location: "Lekki, Lagos",
      category: "Hotels",
      capacity: "2000 guests",
      rating: 4.7,
      reviews: 234,
      price: "₦2,200,000 - ₦7,000,000",
      features: ["Grand Ballroom", "Poolside Garden", "Luxury Suites", "Professional Catering", "Valet Parking"],
      contact: "+234 1 280 8000",
      email: "reservations@orientalhotellagos.com",
      description: "Luxury hotel in Lekki offering sophisticated venues for weddings and corporate functions.",
      image: "/lovable-uploads/venue-image-2.jpg"
    },
    {
      id: 7,
      name: "Balmoral Convention Centre",
      location: "Federal Palace Hotel, Lagos",
      category: "Conference Centers",
      capacity: "3500 guests",
      rating: 4.5,
      reviews: 178,
      price: "₦1,700,000 - ₦5,500,000",
      features: ["Multiple Conference Rooms", "Exhibition Space", "Tech Equipment", "Catering Services"],
      contact: "+234 1 280 2000",
      email: "events@balmoralconvention.com",
      description: "Versatile convention center ideal for conferences, exhibitions, and large-scale celebrations.",
      image: "/lovable-uploads/venue-image-3.jpg"
    },
    {
      id: 8,
      name: "The Balmoral",
      location: "Victoria Island, Lagos",
      category: "Wedding Halls",
      capacity: "800 guests",
      rating: 4.8,
      reviews: 156,
      price: "₦1,200,000 - ₦3,500,000",
      features: ["Elegant Decor", "Bridal Suite", "Photography Studio", "Full Catering", "Event Planning"],
      contact: "+234 1 461 9800",
      email: "weddings@thebalmoral.ng",
      description: "Elegant wedding venue with sophisticated interiors and comprehensive wedding services.",
      image: "/lovable-uploads/venue-image-4.jpg"
    },
    {
      id: 9,
      name: "Havillah Event Centre",
      location: "Oniru, Lagos",
      category: "Banquet Halls",
      capacity: "2500 guests",
      rating: 4.6,
      reviews: 201,
      price: "₦1,500,000 - ₦4,500,000",
      features: ["Spacious Hall", "Modern Lighting", "Sound System", "Generator Backup", "Ample Parking"],
      contact: "+234 803 333 3333",
      email: "booking@havillaheventcentre.com",
      description: "Popular event center known for hosting grand traditional weddings and large celebrations.",
      image: "/lovable-uploads/venue-image-1.jpg"
    },
  ];

  const filteredVenues = selectedCategory === "All Venues" 
    ? nigerianVenues 
    : nigerianVenues.filter(venue => venue.category === selectedCategory);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Event Venues in Nigeria",
    "description": "Premium event venues for weddings, corporate events, and celebrations in Lagos, Abuja, and across Nigeria"
  };

  return (
    <>
      <SEO 
        title="Top Event Venues in Nigeria - Lagos & Abuja Wedding Halls | TPEC Events"
        description="Discover premium event venues in Lagos, Abuja, and across Nigeria. Find the perfect space for weddings, corporate events, parties, and celebrations. Book your venue today."
        keywords="event venues Nigeria, wedding venues Lagos, conference halls Abuja, party venues, banquet halls Nigeria, event spaces Lagos, Eko Hotel events, Landmark Centre, Oriental Hotel"
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

        {/* Category Filter */}
        <div className="flex items-center gap-3 mb-12 flex-wrap justify-center">
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
                  <p className="text-sm font-semibold text-foreground mb-3">
                    Starting from {venue.price}
                  </p>

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
        <Card className="mt-16 bg-gradient-to-br from-primary/8 via-background to-accent/8 border-2 border-dashed border-primary/30 overflow-hidden relative">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full blur-3xl"></div>
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
