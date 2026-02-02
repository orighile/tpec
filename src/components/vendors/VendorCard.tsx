
import { useState } from "react";
import { Star, MapPin, Calendar, Heart, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Vendor } from "@/types/vendor";

interface VendorCardProps {
  vendor: Vendor;
  isSelected: boolean;
  isSaved: boolean;
  onSelect: (vendor: Vendor) => void;
  onToggleSave: (vendorId: string) => void;
  onContact: (vendor: Vendor) => void;
}

const VendorCard = ({
  vendor,
  isSelected,
  isSaved,
  onSelect,
  onToggleSave,
  onContact,
}: VendorCardProps) => {
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

  return (
    <Card 
      className={`overflow-hidden cursor-pointer transition-shadow hover:shadow-md ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={() => onSelect(vendor)}
    >
      <div className="relative h-40 bg-gradient-to-br from-primary/10 to-accent/10">
        <img 
          src={vendor.imageUrl || '/placeholder.svg'} 
          alt={vendor.name}
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
          className="w-full h-full object-cover"
        />
        {!vendor.imageUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary/20">{vendor.name.charAt(0)}</div>
              <div className="text-xs text-muted-foreground mt-1">{vendor.category}</div>
            </div>
          </div>
        )}
        {vendor.verified && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <BadgeCheck className="h-4 w-4" />
                  <span className="text-xs font-semibold">Verified</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>✓ Background checked & reviewed by TPEC</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-2 left-2 bg-white rounded-full h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(vendor.id);
          }}
        >
          <Heart 
            className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} 
          />
        </Button>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold">{vendor.name}</h3>
            <Badge variant="outline" className="mt-1">{vendor.category}</Badge>
          </div>
          <div className="text-right">
            <div className="font-medium">
              {vendor.priceRange || (vendor.price_min && vendor.price_max ? `₦${vendor.price_min?.toLocaleString()}–₦${vendor.price_max?.toLocaleString()}` : '')}
            </div>
            <div className="flex items-center mt-1">
              {renderRatingStars(vendor.rating)}
              <span className="text-xs ml-1">({vendor.reviewCount})</span>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {vendor.short_description || vendor.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {vendor.specialties.slice(0, 3).map((specialty, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {specialty}
            </Badge>
          ))}
          {vendor.specialties.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{vendor.specialties.length - 3} more
            </Badge>
          )}
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground mt-3">
          {vendor.location && (
            <>
              <MapPin className="h-3 w-3 mr-1" /> 
              {vendor.location || (vendor.city && vendor.state ? `${vendor.city}, ${vendor.state}` : vendor.city || vendor.state)}
            </>
          )}
          {vendor.availability.includes("Weekends") && (
            <span className="ml-3 flex items-center">
              <Calendar className="h-3 w-3 mr-1" /> Available weekends
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 bg-muted/20 flex justify-between">
        {vendor.profile_url ? (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              window.open(vendor.profile_url, '_blank');
            }}
          >
            View Profile
          </Button>
        ) : vendor.contactInfo.email ? (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `mailto:${vendor.contactInfo.email}`;
            }}
          >
            Email
          </Button>
        ) : (
          <div></div>
        )}
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            onContact(vendor);
          }}
        >
          Contact Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VendorCard;
