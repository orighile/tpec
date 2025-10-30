
import { Phone, MessageSquare, ExternalLink, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Vendor } from "@/types/vendor";

interface SidebarVendorInfoProps {
  vendor: Vendor;
  isSaved: boolean;
  onToggleSave: (vendorId: string) => void;
  onContact: (vendor: Vendor) => void;
}

const SidebarVendorInfo = ({ 
  vendor, 
  isSaved, 
  onToggleSave, 
  onContact 
}: SidebarVendorInfoProps) => {
  // Render stars for ratings
  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex justify-center text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={`star-${i}`} 
            className={`h-4 w-4 ${i < fullStars ? 'fill-current' : ''} ${i === fullStars && hasHalfStar ? 'fill-[50%]' : ''}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h3 className="font-semibold">Selected Vendor</h3>
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 mb-2">
            <img 
              src={vendor.imageUrl} 
              alt={vendor.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <h4 className="font-medium">{vendor.name}</h4>
          <p className="text-sm text-muted-foreground">{vendor.category}</p>
          
          <div className="flex justify-center items-center gap-1 my-2">
            {renderRatingStars(vendor.rating)}
            <span className="text-sm ml-1">({vendor.rating})</span>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <h5 className="text-sm font-medium mb-1">Contact Information</h5>
          <div className="text-sm space-y-1">
            <div className="flex items-center">
              <Phone className="h-3 w-3 mr-1.5 text-muted-foreground" />
              <span>{vendor.contactInfo.phone}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-3 w-3 mr-1.5 text-muted-foreground" />
              <span>{vendor.contactInfo.email}</span>
            </div>
            {vendor.contactInfo.website && (
              <div className="flex items-center">
                <ExternalLink className="h-3 w-3 mr-1.5 text-muted-foreground" />
                <a 
                  href={`https://${vendor.contactInfo.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {vendor.contactInfo.website}
                </a>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2 pt-2">
          <Button
            variant="default"
            className="w-full"
            onClick={() => onContact(vendor)}
          >
            <MessageSquare className="mr-2 h-4 w-4" /> Contact Vendor
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onToggleSave(vendor.id)}
          >
            <Heart 
              className={`mr-2 h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} 
            />
            {isSaved ? 'Saved' : 'Save Vendor'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SidebarVendorInfo;
