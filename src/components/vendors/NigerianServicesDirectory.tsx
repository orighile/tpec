import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { nigerianServices, categoryLabels, type NigerianService } from "@/data/vendors/nigerianServicesData";
import { Instagram, Globe, MapPin } from "lucide-react";
import { usePlannerImages } from "@/hooks/usePlannerImages";

const NigerianServicesDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = Object.keys(categoryLabels);

  const filteredServices = useMemo(() => {
    let filtered = nigerianServices;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((s) => s.category === selectedCategory);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(term) ||
          service.description.toLowerCase().includes(term) ||
          service.specialties.some((s) => s.toLowerCase().includes(term)) ||
          service.location.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [searchTerm, selectedCategory]);

  const { getImage, isLoading } = usePlannerImages(
    filteredServices.map(service => ({ 
      name: service.name, 
      website: service.website || service.instagramUrl 
    }))
  );

  const stats = useMemo(() => {
    const uniqueCategories = new Set(nigerianServices.map((s) => s.category)).size;
    const uniqueLocations = new Set(nigerianServices.map((s) => s.location)).size;
    return {
      total: nigerianServices.length,
      categories: uniqueCategories,
      locations: uniqueLocations,
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">🎉 Nigerian Events Services Directory</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Complete Guide to Event Planners, Caterers, Venues, DJs, Photographers & More
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center">
        <Input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          onClick={() => setSelectedCategory("all")}
          size="sm"
        >
          All Services
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            size="sm"
          >
            {categoryLabels[category]}
          </Button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service, index) => {
          const fetchedImage = getImage(service.name);
          const loading = isLoading(service.name);
          // Use local image if available, otherwise use fetched image
          const imageUrl = service.localImage || fetchedImage;

          return (
            <div key={`${service.name}-${index}`} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image Section */}
              <div className="relative w-full h-[280px] bg-muted">
                {loading && !service.localImage ? (
                  <Skeleton className="w-full h-full" />
                ) : imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary">
                        {service.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">{service.name}</h3>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary">{categoryLabels[service.category]}</Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {service.description}
                </p>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.specialties.slice(0, 3).map((specialty, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {service.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{service.specialties.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  {/* Location */}
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{service.location}</span>
                  </div>

                  {/* Established */}
                  {service.established && (
                    <div className="text-xs">Est. {service.established}</div>
                  )}
                </div>

                {/* Social Links */}
                {(service.instagramUrl || service.website) && (
                  <div className="flex gap-3 pt-3 border-t">
                    {service.instagramUrl && (
                      <a
                        href={service.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <Instagram className="h-4 w-4" />
                        Instagram
                      </a>
                    )}
                    {service.website && (
                      <a
                        href={service.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <Globe className="h-4 w-4" />
                        Website
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">
            No services found matching your criteria. Try adjusting your search or filters.
          </p>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-muted rounded-lg">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary">{stats.total}</div>
          <div className="text-sm text-muted-foreground mt-1">Total Services</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-primary">{stats.categories}</div>
          <div className="text-sm text-muted-foreground mt-1">Categories</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-primary">{stats.locations}</div>
          <div className="text-sm text-muted-foreground mt-1">Locations</div>
        </div>
      </div>
    </div>
  );
};

export default NigerianServicesDirectory;
