import { Image, Heart, MessageCircle, Share2, Filter, Search, X, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import traditionalWedding from "@/assets/gallery/nigerian-traditional-wedding.jpg";
import birthdayCelebration from "@/assets/gallery/nigerian-birthday-celebration.jpg";
import corporateEvent from "@/assets/gallery/nigerian-corporate-event.jpg";
import igboCeremony from "@/assets/gallery/igbo-traditional-ceremony.jpg";
import beachParty from "@/assets/gallery/nigerian-beach-party.jpg";
import owambeParty from "@/assets/gallery/nigerian-owambe-party.jpg";
import namingCeremony from "@/assets/gallery/nigerian-naming-ceremony.jpg";
import graduationParty from "@/assets/gallery/nigerian-graduation-party.jpg";
import whiteWedding from "@/assets/gallery/nigerian-white-wedding.jpg";

interface GalleryItem {
  id: number;
  image: string;
  title: string;
  eventType: string;
  likes: number;
  comments: number;
  tags: string[];
  isLiked?: boolean;
}

const GalleryPage = () => {
  const [selectedFilter, setSelectedFilter] = useState("All Events");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());

  const filters = ["All Events", "Weddings", "Birthdays", "Corporate", "Traditional", "Outdoor"];

  const galleryItems: GalleryItem[] = [
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

  const filteredItems = galleryItems.filter(item => {
    const filterMatch = selectedFilter === "All Events" || item.eventType === selectedFilter;
    const searchMatch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return filterMatch && searchMatch;
  });

  const handleLike = (itemId: number) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
        toast.success("Removed from favorites");
      } else {
        newSet.add(itemId);
        toast.success("Added to favorites!");
      }
      return newSet;
    });
  };

  const handleShare = async (item: GalleryItem) => {
    const shareData = {
      title: item.title,
      text: `Check out this amazing ${item.eventType.toLowerCase()} event inspiration!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          await navigator.clipboard.writeText(window.location.href);
          toast.success("Link copied to clipboard!");
        }
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleComment = (item: GalleryItem) => {
    toast.info(`Comments for "${item.title}" - Feature coming soon!`);
  };

  const handleUploadClick = () => {
    setIsUploadDialogOpen(true);
  };

  const getLikes = (item: GalleryItem) => {
    return likedItems.has(item.id) ? item.likes + 1 : item.likes;
  };

  return (
    <>
      <SEO 
        title="Event Inspiration Gallery | TPEC Events"
        description="Discover stunning real events from across Nigeria. Get inspired by traditional weddings, corporate events, birthday parties, and more."
        keywords="Nigerian events, wedding inspiration, party ideas, event gallery, traditional wedding, Lagos events"
      />
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

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search events, vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-8 flex-wrap justify-center">
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

        {/* Results Count */}
        <p className="text-center text-muted-foreground mb-8">
          Showing {filteredItems.length} {filteredItems.length === 1 ? 'event' : 'events'}
          {selectedFilter !== "All Events" && ` in ${selectedFilter}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredItems.map((item) => (
            <Card key={item.id} className="tpec-card overflow-hidden group">
              <div 
                className="relative aspect-square overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
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
                    <Badge key={idx} variant="secondary" className="text-xs font-medium cursor-pointer hover:bg-secondary/80">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Engagement */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleLike(item.id)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        likedItems.has(item.id) ? 'text-red-500' : 'hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${likedItems.has(item.id) ? 'fill-current' : ''}`} />
                      <span className="font-medium">{getLikes(item)}</span>
                    </button>
                    <button 
                      onClick={() => handleComment(item)}
                      className="flex items-center gap-1.5 hover:text-primary transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="font-medium">{item.comments}</span>
                    </button>
                  </div>
                  <button 
                    onClick={() => handleShare(item)}
                    className="hover:text-primary transition-colors p-1"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Image className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
            <Button variant="outline" onClick={() => { setSelectedFilter("All Events"); setSearchQuery(""); }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Upload CTA */}
        <Card className="bg-gradient-to-br from-primary/8 via-background to-accent/8 border-2 border-dashed border-primary/30 overflow-hidden relative">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full blur-3xl"></div>
          </div>
          <CardContent className="p-12 text-center relative z-10">
            <Upload className="h-16 w-16 text-primary mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-3 text-foreground">Share Your Event</h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
              Celebrate your special day with the community and help inspire others planning their dream events!
            </p>
            <Button variant="premium" size="lg" onClick={handleUploadClick}>
              Upload Photos
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Image Lightbox Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {selectedImage && (
            <>
              <div className="relative">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[70vh] object-contain bg-black"
                />
              </div>
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl">{selectedImage.title}</DialogTitle>
                  <DialogDescription>
                    <Badge className="mt-2">{selectedImage.eventType}</Badge>
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedImage.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                  <button 
                    onClick={() => handleLike(selectedImage.id)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      likedItems.has(selectedImage.id) ? 'text-red-500' : 'hover:text-red-500'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${likedItems.has(selectedImage.id) ? 'fill-current' : ''}`} />
                    <span>{getLikes(selectedImage)} likes</span>
                  </button>
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="h-5 w-5" />
                    {selectedImage.comments} comments
                  </span>
                  <button 
                    onClick={() => handleShare(selectedImage)}
                    className="flex items-center gap-1.5 hover:text-primary transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                    Share
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Your Event Photos</DialogTitle>
            <DialogDescription>
              Share your amazing event with the TPEC community. Your photos could inspire thousands!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center">
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your photos here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supported formats: JPG, PNG, WEBP (Max 10MB)
              </p>
            </div>
            <Button 
              className="w-full" 
              onClick={() => {
                toast.success("Thank you for your interest! Photo uploads coming soon.");
                setIsUploadDialogOpen(false);
              }}
            >
              Select Photos
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GalleryPage;