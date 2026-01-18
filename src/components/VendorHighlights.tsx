import { Star, MapPin, ArrowSquareOut, Calendar } from "phosphor-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { OptimizedImage } from "@/components/ui/optimized-image";
import cateringImg from "@/assets/catering-image.jpg";
import djImg from "@/assets/dj-image.jpg";
import decorationImg from "@/assets/decoration-image.jpg";

const vendors = [
  {
    id: "v1",
    name: "Signature Catering",
    category: "Catering",
    image: cateringImg,
    rating: 4.8,
    reviews: 124,
    location: "Lagos, Nigeria",
    specialties: ["Nigerian Cuisine", "Continental", "Finger Foods", "Desserts"],
    profileLink: "/vendors/v1",
    bookingLink: "/vendors/v1/book"
  },
  {
    id: "v4",
    name: "Rhythm DJs",
    category: "Entertainment",
    image: djImg,
    rating: 4.9,
    reviews: 156,
    location: "Lagos, Nigeria",
    specialties: ["Wedding Reception", "Corporate Parties", "Club Events"],
    profileLink: "/vendors/v4",
    bookingLink: "/vendors/v4/book"
  },
  {
    id: "v3",
    name: "Perfect Decor",
    category: "Decoration",
    image: decorationImg,
    rating: 4.6,
    reviews: 87,
    location: "Port Harcourt, Nigeria",
    specialties: ["Wedding Decor", "Corporate Branding", "Traditional Ceremonies"],
    profileLink: "/vendors/v3",
    bookingLink: "/vendors/v3/book"
  }
];

const VendorHighlights = () => {
  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">Featured Vendors</h2>
            <p className="text-gray-600 mt-2">Premium service providers for your next event</p>
          </div>
          <Button variant="link" className="text-primary font-medium hidden md:block" asChild>
            <Link to="/vendors">Browse All Vendors</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="tpec-card">
              <div className="relative h-48 overflow-hidden">
                <OptimizedImage 
                  src={vendor.image} 
                  alt={`${vendor.name} - ${vendor.category} services in ${vendor.location}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white text-accent hover:bg-white">
                    {vendor.category}
                  </Badge>
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="font-bold text-xl mb-2">{vendor.name}</h3>
                
                <div className="flex items-center text-sm mb-3">
                  <div className="flex items-center mr-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{vendor.rating}</span>
                    <span className="text-gray-500 ml-1">({vendor.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{vendor.location}</span>
                  </div>
                </div>
                
                <div className="mb-4 flex flex-wrap gap-2">
                  {vendor.specialties.map((specialty, index) => (
                    <span 
                      key={index} 
                      className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white" asChild>
                    <Link to={vendor.profileLink}>
                      <span>View Profile</span> 
                      <ArrowSquareOut className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center gap-2 border-primary text-primary" asChild>
                    <Link to={vendor.bookingLink}>
                      <Calendar className="w-4 h-4" />
                      <span>Book</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Button variant="link" className="text-primary font-medium" asChild>
            <Link to="/vendors">Browse All Vendors</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VendorHighlights;
