import { MapPin, Star, Calendar, Building2, Tag, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import JaraBot from "@/components/jarabot";
import { vendors } from "@/data/vendors/vendorsList";

const VendorsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Vendors");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("any");
  const [ratingFilter, setRatingFilter] = useState("any");
  const [sortBy, setSortBy] = useState("relevance");

  const categories = [
    "All Vendors", "Catering", "Decoration", "Entertainment", 
    "Photography", "Cakes & Desserts"
  ];
  
  const cities = ["All Cities", "Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano", "Enugu"];

  const vendorsWithCity = vendors.map(vendor => ({
    ...vendor,
    city: vendor.location.split(",")[0].trim()
  }));

  const filteredVendors = useMemo(() => {
    let result = vendorsWithCity.filter(vendor => {
      const categoryMatch = selectedCategory === "All Vendors" || vendor.category === selectedCategory;
      const cityMatch = selectedCity === "All Cities" || vendor.city === selectedCity;
      const searchMatch = !searchTerm || 
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const priceMatch = priceFilter === "any" || 
        (priceFilter === "budget" && vendor.priceRange.length <= 2) ||
        (priceFilter === "mid" && vendor.priceRange.length === 3) ||
        (priceFilter === "premium" && vendor.priceRange.length >= 4);
      
      const ratingMatch = ratingFilter === "any" ||
        vendor.rating >= parseInt(ratingFilter);

      return categoryMatch && cityMatch && searchMatch && priceMatch && ratingMatch;
    });

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.priceRange.length - b.priceRange.length);
        break;
      case "price-high":
        result.sort((a, b) => b.priceRange.length - a.priceRange.length);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [vendorsWithCity, selectedCategory, selectedCity, searchTerm, priceFilter, ratingFilter, sortBy]);

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
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            Premium Event Vendors
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover Nigeria's finest event vendors for weddings, corporate events, and celebrations
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search vendors by name, category, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 h-12 text-base rounded-full"
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8 justify-center flex-wrap">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-[160px] rounded-full">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent className="bg-card/98 backdrop-blur-xl border border-border z-[100]">
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger className="w-[140px] rounded-full">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Price</SelectItem>
              <SelectItem value="budget">Budget</SelectItem>
              <SelectItem value="mid">Mid-Range</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>

          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-[140px] rounded-full">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Rating</SelectItem>
              <SelectItem value="3">3+ Stars</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] rounded-full">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-low">Price: Low→High</SelectItem>
              <SelectItem value="price-high">Price: High→Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Buttons */}
        <div className="flex items-center gap-3 flex-wrap justify-center mb-12">
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

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-6">
          {filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''} found
        </p>

        {/* Vendors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVendors.map((vendor) => (
            <Link key={vendor.id} to={`/vendors/${vendor.id}`} className="block">
              <Card className="tpec-card overflow-hidden group hover:shadow-[var(--shadow-elegant)] transition-all duration-300 h-full">
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
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
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
                    <Button className="w-full gap-2" variant="default">
                      <Calendar className="h-4 w-4" />
                      View & Book
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredVendors.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-4">No vendors found matching your criteria</p>
            <Button variant="outline" onClick={() => { 
              setSelectedCategory("All Vendors"); 
              setSelectedCity("All Cities"); 
              setSearchTerm("");
              setPriceFilter("any");
              setRatingFilter("any");
              setSortBy("relevance");
            }}>
              Reset All Filters
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
            <Button variant="premium" size="lg" asChild>
              <Link to="/ai-recommendations">Get AI Recommendations</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <JaraBot />
    </>
  );
};

export default VendorsPage;
