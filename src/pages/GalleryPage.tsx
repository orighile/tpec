import { Image, Heart, MessageCircle, Share2, Filter, Search, X } from "lucide-react";
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
// Using AI-generated images featuring Black/African people for cultural relevance
import engagementParty from "@/assets/gallery/engagement-party.jpg";
import bridalShower from "@/assets/gallery/bridal-shower.jpg";
import bachelorParty from "@/assets/gallery/bachelor-party.jpg";
import destinationWedding from "@/assets/gallery/destination-wedding.jpg";
const corporateEvent = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80";
const microWedding = "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80";

interface GalleryItem {
  id: number;
  image: string;
  title: string;
  description: string;
  eventType: string;
  likes: number;
  comments: number;
  tags: string[];
}

const GalleryPage = () => {
  const [selectedFilter, setSelectedFilter] = useState("All Events");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());

  const filters = ["All Events", "Weddings", "Pre-Wedding", "Corporate"];

  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      image: engagementParty,
      title: "Engagement Party",
      description: "Celebrate the moment they said yes! An engagement party brings together loved ones to toast the couple's new journey with elegant décor, heartfelt speeches, and unforgettable memories.",
      eventType: "Pre-Wedding",
      likes: 412,
      comments: 89,
      tags: ["@EngagementPartyNG", "@ProposalGoals"],
    },
    {
      id: 2,
      image: bridalShower,
      title: "Bridal Shower",
      description: "A special gathering to pamper the bride-to-be! From spa treatments to gift unwrapping, bridal showers are all about celebrating friendship, love, and the exciting road to 'I do.'",
      eventType: "Pre-Wedding",
      likes: 523,
      comments: 112,
      tags: ["@BridalShowerNG", "@BrideSquadGoals"],
    },
    {
      id: 3,
      image: corporateEvent,
      title: "Executive Business Summit",
      description: "Where industry leaders connect and ideas flourish. Executive summits combine professional networking with world-class presentations, creating impactful experiences that drive business forward.",
      eventType: "Corporate",
      likes: 189,
      comments: 34,
      tags: ["@BusinessEventsNG", "@ConferenceHalls"],
    },
    {
      id: 4,
      image: bachelorParty,
      title: "Bachelor Party",
      description: "The ultimate send-off for the groom! Whether it's a night out with the boys or an adventure-packed weekend, bachelor parties celebrate friendship and the excitement of the big day ahead.",
      eventType: "Pre-Wedding",
      likes: 342,
      comments: 67,
      tags: ["@GroomSquadNG", "@BachelorVibes"],
    },
    {
      id: 5,
      image: destinationWedding,
      title: "Destination Wedding",
      description: "Say 'I do' in paradise! Destination weddings combine romance with adventure, offering couples and their guests an unforgettable celebration in breathtaking locations across the globe.",
      eventType: "Weddings",
      likes: 634,
      comments: 145,
      tags: ["@DestinationWeddingNG", "@BeachWedding"],
    },
    {
      id: 6,
      image: microWedding,
      title: "Micro & Elopement Wedding",
      description: "Intimate, intentional, and deeply personal. Micro weddings focus on what matters most—the love between two people—with a close circle of guests and meaningful, heartfelt moments.",
      eventType: "Weddings",
      likes: 287,
      comments: 52,
      tags: ["@IntimateWeddingsNG", "@ElopementCelebrations"],
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
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary/90 backdrop-blur-sm">
                    {item.eventType}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
                
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
    </>
  );
};

export default GalleryPage;
