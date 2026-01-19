
import { useState } from "react";
import { 
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  MessageSquare,
  Share2,
  Bookmark,
  Heart,
  ChevronRight,
  BadgeCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

interface Review {
  id: string;
  author: string;
  avatar?: string;
  date: string;
  rating: number;
  comment: string;
}

interface ServicePackage {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

interface VendorDetailsProps {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  description: string;
  images: string[];
  location: string;
  phone: string;
  email: string;
  website?: string;
  packages: ServicePackage[];
  reviews: Review[];
}

const defaultVendor: VendorDetailsProps = {
  id: "v1",
  name: "Elegant Affairs Nigeria",
  category: "Event Planning & Decor",
  rating: 4.8,
  reviewCount: 127,
  verified: true,
  description: "Elegant Affairs Nigeria is a full-service event planning and decoration company based in Lagos. With over 10 years of experience, we specialize in creating stunning and memorable events including weddings, corporate gatherings, and social celebrations. Our team of creative professionals is dedicated to transforming your vision into reality with attention to every detail.",
  images: [
    "/src/assets/venue-image-1.jpg",
    "/src/assets/venue-image-2.jpg",
    "/src/assets/venue-image-3.jpg",
    "/src/assets/venue-image-4.jpg",
  ],
  location: "14 Adebayo Street, Lekki Phase 1, Lagos",
  phone: "+234 812 345 6789",
  email: "contact@elegantaffairsng.com",
  website: "www.elegantaffairsng.com",
  packages: [
    {
      id: "p1",
      name: "Basic Package",
      price: 250000,
      description: "Perfect for intimate gatherings and smaller events",
      features: [
        "Consultation and event planning",
        "Basic decor setup",
        "Coordination on event day",
        "Up to 50 guests"
      ]
    },
    {
      id: "p2",
      name: "Premium Package",
      price: 500000,
      description: "Our most popular package for medium-sized events",
      features: [
        "Comprehensive event planning",
        "Custom theme design",
        "Premium decor with floral arrangements",
        "Full-day coordination with assistant",
        "Up to 150 guests"
      ],
      isPopular: true
    },
    {
      id: "p3",
      name: "Luxury Package",
      price: 1200000,
      description: "The ultimate experience for your special event",
      features: [
        "End-to-end event management",
        "Luxury decor with premium materials",
        "Custom lighting and audiovisual setup",
        "Multiple coordinators for the event",
        "VIP guest management",
        "Unlimited guests"
      ]
    }
  ],
  reviews: [
    {
      id: "r1",
      author: "Chioma A.",
      avatar: "https://i.pravatar.cc/150?img=44",
      date: "2 months ago",
      rating: 5,
      comment: "Elegant Affairs handled my wedding beautifully! From the initial consultation to the wedding day, they were professional and attentive. The decorations exceeded our expectations and many guests commented on how beautiful everything looked. Would definitely recommend!"
    },
    {
      id: "r2",
      author: "Tunde M.",
      avatar: "https://i.pravatar.cc/150?img=68",
      date: "3 months ago",
      rating: 4,
      comment: "Great service for our corporate event. The team was responsive and executed our company's vision well. Only small issue was they arrived a bit late for setup, but they worked quickly to make up for lost time. Overall satisfied with their service."
    },
    {
      id: "r3",
      author: "Sarah O.",
      date: "5 months ago",
      rating: 5,
      comment: "I hired Elegant Affairs for my daughter's 18th birthday celebration and they did an amazing job! The decor was exactly what we wanted and the planning process was stress-free. Will definitely use their services again for future events."
    }
  ]
};

const VendorDetails = ({ vendor = defaultVendor }: { vendor?: VendorDetailsProps }) => {
  const { toast } = useToast();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const handleBookmark = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite 
        ? `${vendor.name} has been removed from your favorites` 
        : `${vendor.name} has been added to your favorites`,
    });
  };

  const handleContactVendor = () => {
    toast({
      title: "Contact request sent",
      description: `Your request has been sent to ${vendor.name}. They will contact you shortly.`,
    });
  };

  const handleBookConsultation = () => {
    toast({
      title: "Booking request sent",
      description: `Your consultation request with ${vendor.name} has been submitted.`,
    });
  };

  const handleSubmitReview = () => {
    if (!newReview.comment) {
      toast({
        variant: "destructive",
        title: "Review not submitted",
        description: "Please write a comment before submitting your review.",
      });
      return;
    }
    
    toast({
      title: "Review submitted",
      description: "Thank you for sharing your experience with this vendor!",
    });
    setNewReview({ rating: 5, comment: "" });
  };
  
  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div>
          <div className="relative rounded-lg overflow-hidden aspect-[4/3] mb-4">
            <img 
              src={vendor.images[activeImageIndex]} 
              alt={`${vendor.name} - Image ${activeImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {vendor.images.map((image, index) => (
              <div 
                key={index}
                className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${
                  index === activeImageIndex ? 'border-primary' : 'border-transparent'
                }`}
                onClick={() => setActiveImageIndex(index)}
              >
                <img 
                  src={image} 
                  alt={`${vendor.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="bg-muted">
                  {vendor.category}
                </Badge>
                {vendor.verified && (
                  <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30 flex items-center gap-1">
                    <BadgeCheck className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{vendor.name}</h1>
              <div className="flex items-center gap-1 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${
                        i < Math.floor(vendor.rating) 
                        ? 'fill-amber-400 text-amber-400' 
                          : i < vendor.rating 
                            ? 'fill-amber-400 text-amber-400 opacity-50' 
                            : 'text-muted-foreground/30'
                      }`} 
                    />
                  ))}
                </div>
                <span className="font-medium">{vendor.rating}</span>
                <span className="text-muted-foreground">({vendor.reviewCount} reviews)</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={`${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={handleBookmark}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
          
          <p className="text-muted-foreground mb-6">
            {vendor.description}
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <span>{vendor.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <a href={`tel:${vendor.phone}`} className="hover:text-primary">
                {vendor.phone}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <a href={`mailto:${vendor.email}`} className="hover:text-primary">
                {vendor.email}
              </a>
            </div>
            {vendor.website && (
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <a href={`https://${vendor.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  {vendor.website}
                </a>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1 bg-primary hover:bg-primary/90">
              <MessageSquare className="mr-2 h-4 w-4" />
              Contact Vendor
            </Button>
            <Button variant="outline" className="flex-1 border-primary text-primary">
              <Calendar className="mr-2 h-4 w-4" />
              Book Consultation
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="packages" className="w-full px-6 pb-6">
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-6">
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>
        
        <TabsContent value="packages" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vendor.packages.map((pkg) => (
              <div 
                key={pkg.id} 
                className={`border rounded-lg p-6 relative ${
                  pkg.isPopular ? 'border-primary shadow-md' : 'border-border'
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-primary hover:bg-primary/90">Most Popular</Badge>
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-primary">₦{pkg.price.toLocaleString()}</span>
                </div>
                <p className="text-muted-foreground mb-4">{pkg.description}</p>
                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${pkg.isPopular ? 'bg-primary hover:bg-primary/90' : 'bg-muted hover:bg-muted/80 text-foreground'}`}
                  onClick={handleContactVendor}
                >
                  Select Package
                </Button>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">
              Need a custom package tailored to your specific event needs?
            </p>
            <Button 
              variant="outline" 
              className="border-primary text-primary"
              onClick={handleBookConsultation}
            >
              Request Custom Quote
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="reviews" className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg mb-6">
            <h3 className="font-medium mb-4">Write a Review</h3>
            <div className="mb-4">
              <label className="block text-sm mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star 
                      className={`h-6 w-6 ${
                        star <= newReview.rating 
                          ? 'fill-amber-400 text-amber-400' 
                          : 'text-muted-foreground/30'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2">Your Review</label>
              <Textarea 
                placeholder="Share your experience with this vendor..." 
                rows={4}
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              />
            </div>
            <Button onClick={handleSubmitReview}>Submit Review</Button>
          </div>
          
          <div className="space-y-6">
            {vendor.reviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-b-0">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={review.avatar} />
                      <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{review.author}</div>
                      <div className="text-sm text-muted-foreground">{review.date}</div>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < review.rating 
                            ? 'fill-amber-400 text-amber-400' 
                            : 'text-muted-foreground/30'
                        }`} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <Button variant="outline">
              Load More Reviews
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="portfolio" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {vendor.images.concat(vendor.images).map((image, index) => (
              <div key={index} className="rounded-lg overflow-hidden aspect-square">
                <img 
                  src={image} 
                  alt={`Portfolio item ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <Button variant="outline">
              View Full Portfolio
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorDetails;
