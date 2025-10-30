
import { Calendar, MapPin, Users, Heart } from "phosphor-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
  return (
    <div className={cn(
      "jara-card group h-full",
      isFeatured && "border-2 border-jara-gold",
      className
    )}>
      <div className="relative overflow-hidden aspect-[4/3]">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {isFeatured && (
          <div className="absolute top-3 left-3 bg-jara-gold text-black text-xs font-bold px-2 py-1 rounded-full">
            Featured
          </div>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-3 right-3 bg-white/80 hover:bg-white text-jara-purple rounded-full w-8 h-8"
        >
          <Heart className="w-4 h-4" />
        </Button>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <span className="text-xs font-medium bg-white/90 text-jara-purple px-2 py-1 rounded-full">
            {category}
          </span>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <h3 className="font-bold text-lg line-clamp-2">{title}</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-jara-green" />
            <span>{date}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-jara-green" />
            <span className="line-clamp-1">{location}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-jara-green" />
            <span>{attendees} attending</span>
          </div>
        </div>
        
        <div className="pt-2">
          <Button className="w-full bg-jara-green hover:bg-jara-green/90 text-white" asChild>
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
