
import { useState } from "react";
import { 
  Star, 
  MapPin, 
  ExternalLink, 
  Heart, 
  MessageSquare, 
  Phone, 
  Mail, 
  Calendar, 
  Award, 
  CheckCircle, 
  Share2, 
  Clock 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { format } from "date-fns";
import { VendorRating } from "@/components/jarabot";

interface Vendor {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  location: string;
  priceRange: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  availability: string[];
  specialties: string[];
  contactInfo: {
    email: string;
    phone: string;
    website?: string;
  };
  established?: string;
  about?: string;
}

interface VendorProfileProps {
  vendor: Vendor;
  reviews?: VendorRating[];
  isSaved: boolean;
  onToggleSave: (vendorId: string) => void;
  onContact: (vendor: Vendor) => void;
}

const VendorProfile = ({ 
  vendor, 
  reviews = [], 
  isSaved, 
  onToggleSave, 
  onContact 
}: VendorProfileProps) => {
  const [activeTab, setActiveTab] = useState("about");

  // Render stars for ratings
  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={`star-${i}`} 
            className={`h-4 w-4 ${i < fullStars ? 'fill-current' : ''} ${i === fullStars && hasHalfStar ? 'fill-[50%]' : ''}`} 
          />
        ))}
      </div>
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/vendors/${vendor.id}`);
    toast.success("Vendor profile link copied to clipboard");
  };

  return (
    <div className="bg-background rounded-lg shadow-sm overflow-hidden">
      {/* Vendor Header Section */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-primary/10 to-primary/5">
        <img 
          src={vendor.imageUrl} 
          alt={vendor.name} 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent flex flex-col justify-end p-6 text-background">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{vendor.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{vendor.category}</Badge>
                {vendor.verified && (
                  <Badge variant="outline" className="bg-green-500/20 text-white border-green-500/30 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Verified
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center mb-1">
                {renderRatingStars(vendor.rating)}
                <span className="ml-1 text-sm">{vendor.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs opacity-80">{vendor.reviewCount} reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" /> 
            {vendor.location}
          </div>
          <Separator orientation="vertical" className="mx-3 h-4" />
          <div className="text-sm text-muted-foreground">
            {vendor.priceRange}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="h-9"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          
          <Button
            variant={isSaved ? "default" : "outline"}
            size="sm"
            onClick={() => onToggleSave(vendor.id)}
            className={`h-9 ${isSaved ? 'bg-red-500 hover:bg-red-600 border-red-500' : ''}`}
          >
            <Heart 
              className={`h-4 w-4 mr-2 ${isSaved ? 'fill-white' : ''}`} 
            />
            {isSaved ? 'Saved' : 'Save'}
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={() => onContact(vendor)}
            className="h-9"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact
          </Button>
        </div>
      </div>

      {/* Tabs for Vendor Info */}
      <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab} className="p-4">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Overview</h3>
            <p className="text-muted-foreground">{vendor.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {vendor.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Availability</h3>
              <div className="space-y-2">
                {vendor.availability.map((time, index) => (
                  <div key={index} className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {vendor.about && (
            <div>
              <h3 className="text-lg font-medium mb-2">About {vendor.name}</h3>
              <p className="text-muted-foreground">{vendor.about}</p>
              
              {vendor.established && (
                <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
                  <Award className="h-4 w-4" />
                  <span>Established {vendor.established}</span>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="reviews" className="space-y-4">
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm font-medium mt-1">Anonymous User</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(review.createdAt), "MMMM d, yyyy")}
                    </p>
                  </div>
                  <p className="text-muted-foreground">{review.review}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No reviews yet for this vendor.</p>
              <p className="text-sm mt-1">Be the first to leave a review after working with them!</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{vendor.contactInfo.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{vendor.contactInfo.email}</p>
                  </div>
                </div>
                
                {vendor.contactInfo.website && (
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <ExternalLink className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Website</p>
                      <a 
                        href={`https://${vendor.contactInfo.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline flex items-center"
                      >
                        {vendor.contactInfo.website}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Book an Appointment</h3>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-3">
                  Contact {vendor.name} directly to book an appointment or schedule a consultation.
                </p>
                <Button className="w-full" onClick={() => onContact(vendor)}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Now
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorProfile;
