import { MapPin, Star, Phone, Mail, Calendar, Building2, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import JaraBot from "@/components/jarabot";
import { vendors } from "@/data/vendors/vendorsList";

const VendorMarketplacePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Vendors");
  const [selectedCity, setSelectedCity] = useState("All Cities");

  // Categories - Only removed "Venue" (Planners wasn't in the original list)
  const categories = [
    "All Vendors", 
    "Catering", 
    "Decoration", 
    "Entertainment", 
    "Photography", 
    "Cakes & Desserts"
  ];
  
  const cities = ["All Cities", "Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano", "Enugu"];

  // Transform vendor data to extract city from location
  const vendorsWithCity = vendors.map(vendor => ({
    ...vendor,
    city: vendor.location.split(",")[0].trim()
  }));

  const filteredVendors = vendorsWithCity.filter(vendor => {
    const categoryMatch = selectedCategory === "All Vendors" || vendor.category === selectedCategory;
    const cityMatch = selectedCity === "All Cities" || vendor.city === selectedCity;
    return categoryMatch && cityMatch;
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Event Vendors in Nigeria",
    "description": "Premium event vendors for weddings, corporate events, and celebrations in Lagos, Abuja, Port Harcourt and across Nigeria"
  };

  return (
    <>
      <SEO 
        title="Top Event Vendors in Nigeria - Caterers, DJs, Photographers | TPEC Events"
        description="Discover premium event vendors in Lagos, Abuja, Port Harcourt and across Nigeria. Find caterers, photographers, DJs, decorators, and more for your perfect event."
        keywords="event vendors Nigeria, wedding vendors Lagos, caterers Abuja, photographers Port Harcourt, DJs Nigeria, decorators Lagos, event services"
        jsonLd={jsonLd}
      />

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            Premium Event Vendors
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover Nigeria's finest event vendors for weddings, corporate events, and celebrations
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-12 justify-center">
          {/* City Dropdown */}
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-[180px] rounded-full">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent className="bg-card/98 backdrop-blur-xl border border-border z-[100]">
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Buttons */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="default"
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Vendors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVendors.map((vendor) => (
            <Card key={vendor.id} className="tpec-card overflow-hidden group hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={vendor.imageUrl}
                  alt={vendor.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <Badge className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm">
                  {vendor.category}
                </Badge>
                <Badge className="absolute top-4 left-4 bg-secondary/90 backdrop-blur-sm text-secondary-foreground">
                  {vendor.city}
                </Badge>
                {vendor.verified && (
                  <Badge className="absolute bottom-4 right-4 bg-green-600/90 backdrop-blur-sm text-white">
                    Verified
                  </Badge>
                )}
              </div>

              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-xl font-bold text-foreground">
                    {vendor.name}
                  </CardTitle>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-secondary text-secondary" />
                    <span className="font-semibold">{vendor.rating}</span>
                    <span className="text-muted-foreground">({vendor.reviewCount})</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{vendor.location}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {vendor.description}
                </p>

                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-primary" />
                  <span className="font-medium">Price: {vendor.priceRange}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {vendor.specialties.slice(0, 3).map((specialty, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="space-y-2 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      <span>{vendor.contactInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{vendor.contactInfo.email}</span>
                    </div>
                  </div>

                  <Button className="w-full gap-2" variant="default">
                    <Calendar className="h-4 w-4" />
                    Book Vendor
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredVendors.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-4">No vendors found matching your criteria</p>
            <Button variant="outline" onClick={() => { setSelectedCategory("All Vendors"); setSelectedCity("All Cities"); }}>
              Reset Filters
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <Card className="mt-16 bg-gradient-to-br from-primary/8 via-background to-secondary/8 border-2 border-dashed border-primary/30 overflow-hidden relative">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary rounded-full blur-3xl"></div>
          </div>
          <CardContent className="p-12 text-center relative z-10">
            <Tag className="h-16 w-16 text-primary mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-3 text-foreground">Can't Find Your Perfect Vendor?</h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
              Let our expert team help you discover the ideal vendor for your special event
            </p>
            <Button variant="premium" size="lg">
              Get Vendor Recommendations
            </Button>
          </CardContent>
        </Card>
      </div>

      <JaraBot />
    </>
  );
};

export default VendorMarketplacePage;
