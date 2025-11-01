import { Image, Heart, MessageCircle, Share2, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const GalleryPage = () => {
  const [selectedFilter, setSelectedFilter] = useState("All Events");

  const filters = ["All Events", "Weddings", "Birthdays", "Corporate", "Traditional", "Outdoor"];

  const galleryItems = [
    {
      id: 1,
      image: "/lovable-uploads/wedding-expo.jpg",
      title: "Elegant Lagos Wedding",
      eventType: "Weddings",
      likes: 234,
      comments: 45,
      tags: ["@LuxuryVenuesNG", "@TopChefCatering"],
    },
    {
      id: 2,
      image: "/lovable-uploads/cultural-festival.jpg",
      title: "Traditional Igbo Ceremony",
      eventType: "Traditional",
      likes: 189,
      comments: 32,
      tags: ["@TraditionalDecor", "@CulturalBeats"],
    },
    {
      id: 3,
      image: "/lovable-uploads/tech-summit-event.jpg",
      title: "Tech Summit Abuja",
      eventType: "Corporate",
      likes: 156,
      comments: 28,
      tags: ["@EventSpaceNG", "@TechCatering"],
    },
    {
      id: 4,
      image: "/lovable-uploads/summer-party.jpg",
      title: "Birthday Beach Party",
      eventType: "Birthdays",
      likes: 298,
      comments: 56,
      tags: ["@BeachVenueNG", "@PartyDJ"],
    },
  ];

  const filteredItems = selectedFilter === "All Events" 
    ? galleryItems 
    : galleryItems.filter(item => item.eventType === selectedFilter);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Image className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Event Inspiration
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Discover stunning real events from across Nigeria. Get inspired, save ideas, and connect with the vendors who made it happen!
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-8 flex-wrap justify-center">
          <Filter className="h-5 w-5 text-muted-foreground" />
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? "default" : "outline"}
              onClick={() => setSelectedFilter(filter)}
              size="sm"
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 right-4 bg-primary">
                  {item.eventType}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                
                {/* Vendor Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Engagement */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <Heart className="h-4 w-4" />
                      <span>{item.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span>{item.comments}</span>
                    </button>
                  </div>
                  <button className="hover:text-primary transition-colors">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upload CTA */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-dashed">
          <CardContent className="p-8 text-center">
            <Image className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Share Your Event</h3>
            <p className="text-muted-foreground mb-4">
              Celebrate your special day with the community and help inspire others!
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Upload Photos
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GalleryPage;
