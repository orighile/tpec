import { Image, Heart, MessageCircle, Share2, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import traditionalWedding from "@/assets/gallery/nigerian-traditional-wedding.jpg";
import birthdayCelebration from "@/assets/gallery/nigerian-birthday-celebration.jpg";
import corporateEvent from "@/assets/gallery/nigerian-corporate-event.jpg";
import igboCeremony from "@/assets/gallery/igbo-traditional-ceremony.jpg";
import beachParty from "@/assets/gallery/nigerian-beach-party.jpg";
import owambeParty from "@/assets/gallery/nigerian-owambe-party.jpg";
import namingCeremony from "@/assets/gallery/nigerian-naming-ceremony.jpg";
import graduationParty from "@/assets/gallery/nigerian-graduation-party.jpg";
import whiteWedding from "@/assets/gallery/nigerian-white-wedding.jpg";

const GalleryPage = () => {
  const [selectedFilter, setSelectedFilter] = useState("All Events");

  const filters = ["All Events", "Weddings", "Birthdays", "Corporate", "Traditional", "Outdoor"];

  const galleryItems = [
    {
      id: 1,
      image: traditionalWedding,
      title: "Elegant Yoruba Traditional Wedding",
      eventType: "Weddings",
      likes: 342,
      comments: 67,
      tags: ["@LagosWeddingDecor", "@TraditionalGlamNG"],
    },
    {
      id: 2,
      image: whiteWedding,
      title: "Luxury White Wedding Reception",
      eventType: "Weddings",
      likes: 298,
      comments: 54,
      tags: ["@ElegantVenuesNG", "@WeddingCakesLagos"],
    },
    {
      id: 3,
      image: igboCeremony,
      title: "Traditional Igbo Wine Ceremony",
      eventType: "Traditional",
      likes: 276,
      comments: 48,
      tags: ["@IgboCultureEvents", "@TraditionalBeads"],
    },
    {
      id: 4,
      image: birthdayCelebration,
      title: "Outdoor Birthday Bash Lagos",
      eventType: "Birthdays",
      likes: 412,
      comments: 89,
      tags: ["@LagosPartyLife", "@OutdoorCatering"],
    },
    {
      id: 5,
      image: corporateEvent,
      title: "Corporate Summit Abuja",
      eventType: "Corporate",
      likes: 189,
      comments: 34,
      tags: ["@BusinessEventsNG", "@ConferenceHalls"],
    },
    {
      id: 6,
      image: beachParty,
      title: "Sunset Beach Party Lagos",
      eventType: "Outdoor",
      likes: 523,
      comments: 112,
      tags: ["@BeachVenueNG", "@SunsetCelebrations"],
    },
    {
      id: 7,
      image: owambeParty,
      title: "Luxury Owambe Celebration",
      eventType: "Traditional",
      likes: 387,
      comments: 78,
      tags: ["@OwambeDecor", "@LuxuryEventsNG"],
    },
    {
      id: 8,
      image: namingCeremony,
      title: "Baby Naming Ceremony",
      eventType: "Traditional",
      likes: 234,
      comments: 45,
      tags: ["@FamilyCelebrations", "@NamingCeremonyNG"],
    },
    {
      id: 9,
      image: graduationParty,
      title: "University Graduation Party",
      eventType: "Birthdays",
      likes: 298,
      comments: 61,
      tags: ["@GraduationEvents", "@CelebrationCatering"],
    },
  ];

  const filteredItems = selectedFilter === "All Events" 
    ? galleryItems 
    : galleryItems.filter(item => item.eventType === selectedFilter);

  return (
    <>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Image className="h-10 w-10 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold gradient-text">
              Event Inspiration
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Discover stunning real events from across Nigeria. Get inspired, save ideas, and connect with the vendors who made it happen!
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-12 flex-wrap justify-center">
          <Filter className="h-5 w-5 text-muted-foreground" />
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? "default" : "outline"}
              onClick={() => setSelectedFilter(filter)}
              size="default"
              className="rounded-full"
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredItems.map((item) => (
            <Card key={item.id} className="tpec-card overflow-hidden group cursor-pointer">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
                <Badge className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm">
                  {item.eventType}
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3 text-foreground">{item.title}</h3>
                
                {/* Vendor Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs font-medium">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Engagement */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 hover:text-accent transition-colors">
                      <Heart className="h-4 w-4" />
                      <span className="font-medium">{item.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span className="font-medium">{item.comments}</span>
                    </button>
                  </div>
                  <button className="hover:text-primary transition-colors p-1">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upload CTA */}
        <Card className="bg-gradient-to-br from-primary/8 via-background to-accent/8 border-2 border-dashed border-primary/30 overflow-hidden relative">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full blur-3xl"></div>
          </div>
          <CardContent className="p-12 text-center relative z-10">
            <Image className="h-16 w-16 text-primary mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-3 text-foreground">Share Your Event</h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
              Celebrate your special day with the community and help inspire others planning their dream events!
            </p>
            <Button variant="premium" size="lg">
              Upload Photos
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default GalleryPage;
