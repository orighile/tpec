
import { Star, MapPin, ArrowSquareOut, Calendar } from "phosphor-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import venueImg from "@/assets/venue-image-1.jpg";
import cateringImg from "@/assets/catering-image.jpg";
import decorationImg from "@/assets/decoration-image.jpg";

const vendors = [
  {
    id: 1,
    name: "Premier Event Venues",
    category: "Venue",
    image: venueImg,
    rating: 4.8,
    reviews: 124,
    location: "Ibeju-Lekki, Lagos",
    specialties: ["Wedding Venues", "Corporate Spaces", "Outdoor Events"],
    profileLink: "/vendors/1",
    bookingLink: "/vendors/1/book"
  },
  {
    id: 2,
    name: "Elite Sound & Lighting",
    category: "Entertainment",
    image: cateringImg,
    rating: 4.9,
    reviews: 87,
    location: "Lekki, Lagos",
    specialties: ["Sound Systems", "Lighting Design", "DJ Services"],
    profileLink: "/vendors/2",
    bookingLink: "/vendors/2/book"
  },
  {
    id: 3,
    name: "Elegant Decor Solutions",
    category: "Decoration",
    image: decorationImg,
    rating: 4.7,
    reviews: 62,
    location: "Victoria Island, Lagos",
    specialties: ["Wedding Decor", "Corporate Styling", "Themed Events"],
    profileLink: "/vendors/3",
    bookingLink: "/vendors/3/book"
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
                <img 
                  src={vendor.image} 
                  alt={vendor.name} 
                  className="w-full h-full object-cover"
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
