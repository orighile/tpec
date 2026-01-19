import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Crown,
  Search,
  X,
  MapPin,
  ArrowRight,
  Users,
  Filter,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePrimeMembership } from "@/hooks/usePrimeMembership";
import { PrimeRegistrationForm } from "@/components/prime/PrimeRegistrationForm";
import { PrimeProfileEditor } from "@/components/prime/PrimeProfileEditor";
import { PrimeMemberCard } from "@/components/prime/PrimeMemberCard";

const LOCATIONS = [
  "All Locations",
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Ibadan",
  "Kano",
  "Enugu",
  "Calabar",
];

const PrimePlannersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [isRegistering, setIsRegistering] = useState(false);

  const {
    membership,
    galleryImages,
    allMembers,
    isLoading,
    isUploading,
    createMembership,
    updateMembership,
    uploadLogo,
    uploadCoverImage,
    uploadVideo,
    addGalleryImage,
    deleteGalleryImage,
  } = usePrimeMembership("planner");

  const filteredMembers = allMembers.filter((member) => {
    const searchMatch =
      searchQuery === "" ||
      member.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const locationMatch =
      selectedLocation === "All Locations" ||
      member.location === selectedLocation;
    return searchMatch && locationMatch;
  });

  const handleCreateMembership = async (data: any) => {
    setIsRegistering(true);
    const result = await createMembership(data);
    setIsRegistering(false);
    if (result) {
      setActiveTab("my-profile");
    }
  };

  const renderBrowseContent = () => (
    <div className="space-y-8">
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search planners by name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {LOCATIONS.map((loc) => (
            <Button
              key={loc}
              variant={selectedLocation === loc ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLocation(loc)}
              className="rounded-full"
            >
              {loc === "All Locations" ? <Filter className="h-4 w-4 mr-1" /> : <MapPin className="h-3 w-3 mr-1" />}
              {loc}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-muted-foreground">
        Showing {filteredMembers.length} Prime{" "}
        {filteredMembers.length === 1 ? "Planner" : "Planners"}
        {selectedLocation !== "All Locations" && ` in ${selectedLocation}`}
        {searchQuery && ` matching "${searchQuery}"`}
      </p>

      {/* Planners Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-40" />
              <CardContent className="p-5 pt-10">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredMembers.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <PrimeMemberCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No planners found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || selectedLocation !== "All Locations"
              ? "Try adjusting your search or filters"
              : "Be the first Prime Planner!"}
          </p>
          {(searchQuery || selectedLocation !== "All Locations") && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedLocation("All Locations");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* CTA Section */}
      {!membership && (
        <Card className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border-2 border-primary/20 overflow-hidden relative mt-12">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full blur-3xl"></div>
          </div>
          <CardContent className="p-12 text-center relative z-10">
            <Crown className="h-16 w-16 text-primary mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-3 text-foreground">
              Become a Prime Planner
            </h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
              Get featured, showcase your portfolio, and connect with clients
              looking for professional event planners across Nigeria!
            </p>
            {user ? (
              <Button
                variant="premium"
                size="lg"
                onClick={() => setActiveTab("register")}
              >
                <Crown className="mr-2 h-5 w-5" />
                Join Prime Planners
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="premium"
                size="lg"
                onClick={() => navigate("/auth")}
              >
                Sign In to Join
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <>
      <SEO
        title="Prime Planners | TPEC Events"
        description="Discover Nigeria's top event planners. Wedding planners, corporate events, traditional ceremonies - all verified Prime members."
        keywords="Nigerian event planners, wedding planners Lagos, corporate event planning, party planner Nigeria, Prime planners"
      />

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Crown className="h-10 w-10 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold gradient-text">
              Prime Planners
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover verified event planners across Nigeria. Expertise, creativity,
            and professionalism - all in one place.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            {user && !membership && (
              <TabsTrigger value="register">Register</TabsTrigger>
            )}
            {user && membership && (
              <TabsTrigger value="my-profile">My Profile</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="browse">{renderBrowseContent()}</TabsContent>

          {user && !membership && (
            <TabsContent value="register">
              <PrimeRegistrationForm
                membershipType="planner"
                onSubmit={handleCreateMembership}
                isSubmitting={isRegistering}
              />
            </TabsContent>
          )}

          {user && membership && (
            <TabsContent value="my-profile">
              <PrimeProfileEditor
                membership={membership}
                galleryImages={galleryImages}
                isUploading={isUploading}
                onUpdate={updateMembership}
                onUploadLogo={uploadLogo}
                onUploadCover={uploadCoverImage}
                onUploadVideo={uploadVideo}
                onAddGalleryImage={addGalleryImage}
                onDeleteGalleryImage={deleteGalleryImage}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </>
  );
};

export default PrimePlannersPage;
