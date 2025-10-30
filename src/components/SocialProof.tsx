
import { useState, useEffect } from "react";
import { Star, StarHalf, Funnel, MagnifyingGlass } from "phosphor-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { SocialProof as SocialProofType } from "@/components/jarabot";

const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<SocialProofType[]>([]);
  
  useEffect(() => {
    // In a real app, this would fetch from your backend
    const loadTestimonials = async () => {
      // For now, load some realistic testimonials
      const realTestimonials: SocialProofType[] = [
        {
          id: "1",
          name: "Chinedu Okonkwo",
          avatarUrl: "/placeholder.svg",
          testimonial: "JaraPlanner helped me coordinate my daughter's wedding seamlessly. The seating chart tool was a lifesaver for our 350-guest event!",
          eventType: "Wedding",
          rating: 5
        },
        {
          id: "2",
          name: "Amina Bello",
          avatarUrl: "/placeholder.svg",
          testimonial: "The vendor marketplace made finding reliable vendors so easy. I was able to compare prices and reviews all in one place.",
          eventType: "Corporate Conference",
          rating: 4
        },
        {
          id: "3",
          name: "Oluwaseun Adeyemi",
          avatarUrl: "/placeholder.svg",
          testimonial: "JaraBot's suggestions for my event budget helped me save over 20% on costs without compromising quality. Highly recommend!",
          eventType: "Birthday Party",
          rating: 5
        }
      ];
      setTestimonials(realTestimonials);
    };
    
    loadTestimonials();
  }, []);
  
  return testimonials;
};

// Event types for filtering
const eventTypes = ["All", "Wedding", "Birthday Party", "Corporate Event", "Corporate Conference", "Multiple Events"];

const SocialProof = () => {
  const testimonials = useTestimonials();
  const [searchTerm, setSearchTerm] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  // Filter testimonials based on search, event type, and rating
  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.testimonial.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        testimonial.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEventType = eventTypeFilter === "All" || testimonial.eventType === eventTypeFilter;
    
    const matchesRating = ratingFilter === null || testimonial.rating >= ratingFilter;
    
    return matchesSearch && matchesEventType && matchesRating;
  });

  // Render stars for ratings
  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex text-yellow-400">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-current" />
        ))}
        {hasHalfStar && <StarHalf className="h-4 w-4 fill-current" />}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Customer Success Stories</h2>
        <p className="text-muted-foreground">See how JaraPlanner has helped others plan successful events</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search testimonials..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={ratingFilter?.toString() || ""} 
            onValueChange={(value) => setRatingFilter(value ? Number(value) : null)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Rating</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
              <SelectItem value="3">3+ Stars</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm("");
              setEventTypeFilter("All");
              setRatingFilter(null);
            }}
          >
            <Funnel className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </div>
      
      {filteredTestimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/10">
                    <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium">{testimonial.name}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <Badge variant="secondary">{testimonial.eventType}</Badge>
                      {renderRatingStars(testimonial.rating)}
                    </div>
                  </div>
                </div>
                <blockquote className="italic text-muted-foreground border-l-4 border-primary/20 pl-4 py-1">
                  "{testimonial.testimonial}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <h3 className="text-lg font-medium">No testimonials found</h3>
          <p className="mt-2 text-muted-foreground">
            Try adjusting your search filters or criteria
          </p>
          <Button 
            className="mt-4" 
            onClick={() => {
              setSearchTerm("");
              setEventTypeFilter("All");
              setRatingFilter(null);
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default SocialProof;
