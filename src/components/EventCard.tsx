import { useState } from "react";
import { Calendar, MapPin, Users, Heart } from "phosphor-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useToast } from "@/hooks/use-toast";

type EventCardProps = {
  id: number;
  title: string;
  image: string;
  date: string;
  location: string;
  attendees: number;
  category: string;
  isFeatured?: boolean;
  className?: string;
};

const EventCard = ({
  id,
  title,
  image,
  date,
  location,
  attendees,
  category,
  isFeatured = false,
  className
}: EventCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const { toast } = useToast();

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? "Removed from favorites" : "Added to favorites",
      description: isFavorited 
        ? `${title} has been removed from your favorites.`
        : `${title} has been added to your favorites.`,
    });
  };
  return (
    <div className={cn(
      "tpec-card group h-full bg-card",
      isFeatured && "border-2 border-secondary",
      className
    )}>
      <div className="relative overflow-hidden aspect-[4/3]">
        <OptimizedImage 
          src={image} 
          alt={`${title} - ${category} event in ${location}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {isFeatured && (
          <div className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1 rounded-full">
            Featured
          </div>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "absolute top-3 right-3 bg-background/80 hover:bg-background rounded-full w-8 h-8",
            isFavorited ? "text-red-500" : "text-primary"
          )}
          onClick={handleFavorite}
        >
          <Heart className="w-4 h-4" weight={isFavorited ? "fill" : "regular"} />
        </Button>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/70 to-transparent p-4">
          <span className="text-xs font-medium bg-background/90 text-primary px-2 py-1 rounded-full">
            {category}
          </span>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <h3 className="font-bold text-lg line-clamp-2 text-foreground">{title}</h3>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{date}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="line-clamp-1">{location}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span>{attendees} attending</span>
          </div>
        </div>
        
        <div className="pt-2">
          <Button className="w-full" asChild>
            <Link to={`/events/${id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
