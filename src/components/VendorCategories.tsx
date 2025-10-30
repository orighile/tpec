
import { GridFour, MapPin, ForkKnife, MusicNotes, Camera, Palette, Cake, Gift, Car, Flower, TShirt, Users } from "phosphor-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const categories = [
  { 
    id: 1, 
    name: "Venues", 
    icon: <MapPin className="h-6 w-6" />, 
    count: 48,
    description: "Event spaces, halls and outdoor locations"
  },
  { 
    id: 2, 
    name: "Catering", 
    icon: <ForkKnife className="h-6 w-6" />, 
    count: 37,
    description: "Food, drinks, and dessert services"
  },
  { 
    id: 3, 
    name: "Entertainment", 
    icon: <MusicNotes className="h-6 w-6" />, 
    count: 29,
    description: "DJs, live bands, and performers"
  },
  { 
    id: 4, 
    name: "Photography", 
    icon: <Camera className="h-6 w-6" />, 
    count: 41,
    description: "Photographers and videographers"
  },
  { 
    id: 5, 
    name: "Decor", 
    icon: <Palette className="h-6 w-6" />, 
    count: 52,
    description: "Event styling and decoration"
  },
  { 
    id: 6, 
    name: "Cakes", 
    icon: <Cake className="h-6 w-6" />, 
    count: 23,
    description: "Custom cakes and dessert tables"
  },
  { 
    id: 7, 
    name: "Favors & Gifts", 
    icon: <Gift className="h-6 w-6" />, 
    count: 19,
    description: "Guest gifts and party favors"
  },
  { 
    id: 8, 
    name: "Transportation", 
    icon: <Car className="h-6 w-6" />, 
    count: 15,
    description: "Luxury cars and transportation services"
  },
  { 
    id: 9, 
    name: "Flowers", 
    icon: <Flower className="h-6 w-6" />, 
    count: 27,
    description: "Florists and floral arrangements"
  },
  { 
    id: 10, 
    name: "Attire", 
    icon: <TShirt className="h-6 w-6" />, 
    count: 33,
    description: "Event clothing and accessories"
  },
  { 
    id: 11, 
    name: "Staffing", 
    icon: <Users className="h-6 w-6" />, 
    count: 17,
    description: "Event staff, waiters, and security"
  },
  { 
    id: 12, 
    name: "Other Services", 
    icon: <GridFour className="h-6 w-6" />, 
    count: 39,
    description: "Specialty services and rentals"
  }
];

const VendorCategories = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Vendor Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive marketplace of trusted event professionals across various categories
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link 
              to={`/vendors?category=${category.name.toLowerCase()}`} 
              key={category.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
                {category.icon}
              </div>
              <h3 className="font-medium text-lg mb-1">{category.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{category.description}</p>
              <Badge variant="outline" className="bg-gray-100">
                {category.count} vendors
              </Badge>
            </Link>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <p className="mb-4 text-gray-600">Featured vendors include:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((num) => (
              <Link 
                key={num} 
                to={`/vendors/${num}`} 
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 text-center"
              >
                <h3 className="font-medium">
                  {num === 1 ? "Elegant Affairs Nigeria" : 
                   num === 2 ? "Lagos Event Solutions" : 
                   "Premium Catering Services"}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {num === 1 ? "Event Planning & Decor" : 
                   num === 2 ? "Venues & Lighting" : 
                   "Food & Beverage"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorCategories;
