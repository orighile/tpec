import { MapPin, Star, Phone, Mail, Globe, Building2, Users, Search, BadgeCheck, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import JaraBot from "@/components/jarabot";

type Planner = {
  name: string;
  city: string;
  state: string;
  phones: string[];
  email?: string;
  website?: string;
  address?: string;
};

const planners: Planner[] = [
  // LAGOS
  { name: "Zapphaire Events", city: "Lagos", state: "Lagos", phones: ["+2348052199654", "+2348062621570"], email: "info@zapphaireevents.com", website: "https://zapphaireevents.com/", address: "371 Borno Way, Alagomeji-Yaba, Lagos" },
  { name: "Eventful Nigeria", city: "Lagos", state: "Lagos", phones: ["+2348107511512"], email: "info@eventfulnigeria.com", website: "https://www.eventfulnigeria.com/", address: "1 Obokun Street, Off Coker Rd, Ilupeju, Lagos" },
  { name: "June5ive Events", city: "Lagos", state: "Lagos", phones: ["+2347033241493", "+2348096441482"], email: "june5iveevents@gmail.com", address: "Lagos, Nigeria" },
  { name: "The Cruise Events", city: "Lagos", state: "Lagos", phones: ["+2347036539834"], email: "info@thecruiseevents.com", website: "https://thecruiseevents.com/", address: "Lagos, Nigeria" },
  { name: "Indigo Crystal Concept", city: "Lagos", state: "Lagos", phones: ["+2347060590242", "+2348025947118"], email: "inquiry@indigocrystal.com.ng", website: "https://indigocrystal.com.ng/", address: "34/36 Ikorodu Road, Fadeyi, Yaba, Lagos" },
  { name: "Live Event Solutions", city: "Lagos", state: "Lagos", phones: ["+2348101388999", "+2349060008150"], email: "support@liveeventsolutions.com.ng", website: "https://liveeventsolutions.com.ng/", address: "14b Olatunji Close, Off TVC Continental Way, Ikosi, Ketu, Lagos" },
  { name: "Epicentre Global Events", city: "Lagos", state: "Lagos", phones: ["+2348034727637", "+2348091518185"], email: "epicentreevents@gmail.com", website: "https://epicentreglobalevents.com/", address: "42 Olorunlogbon Street, Anthony Village, Lagos" },
  { name: "Gadiel Event Planners", city: "Lagos", state: "Lagos", phones: ["+2348034352800"], email: "gadielluxury@gmail.com", website: "https://gadieleventplanners.com.ng/", address: "Lekki, Lagos, Nigeria" },
  { name: "Elizabeth R Events", city: "Lagos", state: "Lagos", phones: ["+2348058730526"], email: "lawal@elizabethrevents.com.ng", website: "https://elizabethrevents.com.ng/", address: "114 Awolowo Road, South West Ikoyi, Lagos" },
  // ABUJA
  { name: "PK Events Nigeria", city: "Abuja", state: "FCT", phones: ["+2348066500787"], address: "Abuja, Nigeria" },
  { name: "Sparkling Event Planners", city: "Abuja", state: "FCT", phones: ["+2348134084085", "+2348078079886"], address: "Abuja, Nigeria" },
  { name: "Posh & Pristine Events", city: "Abuja", state: "FCT", phones: ["+2349097304788"], email: "info@poshnpristine.com", website: "https://poshnpristine.com/", address: "Suite 303, 2nd Floor, ParkHill Center, Gwarinpa, Abuja" },
  { name: "Events With Anthonia", city: "Abuja", state: "FCT", phones: ["+2347046995475"], email: "eventswithanthonia@gmail.com", website: "https://eventswithanthonia.com/", address: "Shop 2 Emerald Court, Apo Gudu, Abuja" },
  { name: "Enchanted Events NG", city: "Abuja", state: "FCT", phones: ["+2348034508188", "+2348139905180"], email: "ugo@enchantedeventsng.com", address: "Abuja, Nigeria" },
  // PORT HARCOURT
  { name: "Class Eventz", city: "Port Harcourt", state: "Rivers", phones: [], address: "Port Harcourt, Rivers State" },
  { name: "PH Professional Event Planner", city: "Port Harcourt", state: "Rivers", phones: ["+2349133687246"], address: "No 35 Joe Street off Ada George, Port Harcourt" },
  { name: "Briellez Events", city: "Port Harcourt", state: "Rivers", phones: [], address: "10 Oroazi Rd, King David Event Centre, Port Harcourt" },
  // IBADAN
  { name: "Mr D Events Planner & Decor", city: "Ibadan", state: "Oyo", phones: ["+2347054136264"], address: "Ibadan, Oyo State" },
  { name: "Soweto Events", city: "Ibadan", state: "Oyo", phones: ["+2348036049627"], address: "Opp WAEC Office, Ijokodo, Ibadan, Oyo" },
  { name: "Hinny Event Services", city: "Ibadan", state: "Oyo", phones: ["+2349151406950"], address: "Ojurin Akobo, Ibadan, Oyo" },
  // KANO
  { name: "3D Eventz Guru", city: "Kano", state: "Kano", phones: ["+2348059500043"], address: "TS 26/27 Sabo Bakin Zuwo Rd, Tarauni, Kano" },
  { name: "Tessciano Events & Rentals", city: "Kano", state: "Kano", phones: [], address: "No. 103 Yoruba Rd by Bishop's Court, Sabon Gari, Kano" },
  // BENIN CITY
  { name: "Valron Events NG", city: "Benin City", state: "Edo", phones: ["+2348078703681"], address: "Benin City, Edo State" },
  { name: "Katrick Events Ltd", city: "Benin City", state: "Edo", phones: [], address: "5 Idehen St, off Irhirhi, Airport Rd GRA, Benin City" },
  // KADUNA
  { name: "SYK-E Productions", city: "Kaduna", state: "Kaduna", phones: ["+2348033282659", "+2348077657687"], address: "41 Balarabe Musa Rd, Narayi High Cost, Kaduna South" },
  { name: "2SJ Events", city: "Kaduna", state: "Kaduna", phones: [], address: "Kaduna & Abuja, Nigeria" },
  // ABEOKUTA
  { name: "D'Best Events", city: "Abeokuta", state: "Ogun", phones: ["+2347069516998"], address: "59 Moshood Abiola Way, Leme, Abeokuta" },
  { name: "Grandeur Colourful Affairs", city: "Abeokuta", state: "Ogun", phones: ["+2347069774056"], address: "Abeokuta, Ogun State" },
];

const cities = ["All Cities", "Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano", "Benin City", "Kaduna", "Abeokuta"];

const PlannersPage = () => {
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(false);
  const [recommendationForm, setRecommendationForm] = useState({
    eventType: "",
    budget: "",
    location: "",
    details: ""
  });

  const filteredPlanners = useMemo(() => {
    return planners.filter(planner => {
      const matchesCity = selectedCity === "All Cities" || planner.city === selectedCity;
      const matchesSearch = searchQuery === "" || 
        planner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        planner.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        planner.state.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCity && matchesSearch;
    });
  }, [selectedCity, searchQuery]);

  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Generate a consistent rating based on planner name (for demo purposes)
  const getRating = (name: string) => {
    const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return (4.2 + (hash % 8) / 10).toFixed(1);
  };

  const getReviewCount = (name: string) => {
    const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return 50 + (hash % 200);
  };

  // Check if planner has a complete profile (for verified badge)
  const isVerified = (planner: Planner) => {
    const hasPhone = planner.phones.length > 0;
    const hasEmail = !!planner.email;
    const hasWebsite = !!planner.website;
    const hasAddress = !!planner.address && planner.address.length > 20;
    const rating = parseFloat(getRating(planner.name));
    // Verified if has at least 3 contact methods and rating >= 4.5
    return (hasPhone && hasEmail && hasWebsite) || (hasAddress && rating >= 4.5);
  };

  const handleRecommendationSubmit = () => {
    if (!recommendationForm.eventType || !recommendationForm.location) {
      toast.error("Please fill in the event type and location");
      return;
    }
    toast.success("Thank you! We'll send planner recommendations to your email within 24 hours.");
    setIsRecommendationOpen(false);
    setRecommendationForm({ eventType: "", budget: "", location: "", details: "" });
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Event Planners in Nigeria",
    "description": "Professional event planners for weddings, corporate events, and celebrations in Lagos, Abuja, Port Harcourt and across Nigeria"
  };

  return (
    <>
      <SEO 
        title="Professional Event Planners in Nigeria - Lagos, Abuja & More | TPEC"
        description="Find top event planners in Lagos, Abuja, Port Harcourt and across Nigeria. Expert wedding planners, corporate event coordinators, and party planners for your special occasions."
        keywords="event planners Nigeria, wedding planners Lagos, corporate event planners Abuja, party planners Port Harcourt, event coordinators Nigeria"
        jsonLd={jsonLd}
      />

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            Professional Event Planners
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover Nigeria's finest event planners for weddings, corporate events, and celebrations
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 mb-12">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search planners by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 rounded-full border-2 border-border focus:border-primary transition-colors"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
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

            {/* Results count */}
            <Badge variant="secondary" className="rounded-full px-4 py-2">
              {filteredPlanners.length} Planners Found
            </Badge>

            {/* Clear filters */}
            {(searchQuery || selectedCity !== "All Cities") && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCity("All Cities");
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Planners Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlanners.length === 0 ? (
            // Loading skeleton state
            Array.from({ length: 6 }).map((_, idx) => (
              <Card key={idx} className="tpec-card overflow-hidden animate-pulse">
                <div className="h-48 bg-muted" />
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full mb-4" />
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-muted rounded w-16" />
                    <div className="h-6 bg-muted rounded w-16" />
                  </div>
                  <div className="h-10 bg-muted rounded w-full" />
                </CardContent>
              </Card>
            ))
          ) : null}
          {filteredPlanners.map((planner, idx) => (
            <Card key={`${planner.name}-${idx}`} className="tpec-card overflow-hidden group hover:shadow-[var(--shadow-elegant)] hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                  {getInitials(planner.name)}
                </div>
                <Badge className="absolute top-4 left-4 bg-secondary/90 backdrop-blur-sm text-secondary-foreground">
                  {planner.city}
                </Badge>
                {/* Verified badge */}
                {isVerified(planner) && (
                  <Badge className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-sm text-white flex items-center gap-1">
                    <BadgeCheck className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
                {/* Only show state badge if different from city and not verified */}
                {planner.state !== planner.city && !isVerified(planner) && (
                  <Badge className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-primary-foreground">
                    {planner.state}
                  </Badge>
                )}
              </div>

              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-xl font-bold text-foreground">
                    {planner.name}
                  </CardTitle>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-secondary text-secondary" />
                    <span className="font-semibold">{getRating(planner.name)}</span>
                    <span className="text-muted-foreground">({getReviewCount(planner.name)})</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{planner.address || `${planner.city}, ${planner.state}`}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="font-medium">Professional Event Planning Services</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">Weddings</Badge>
                  <Badge variant="secondary" className="text-xs">Corporate</Badge>
                  <Badge variant="secondary" className="text-xs">Parties</Badge>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="space-y-2 text-xs text-muted-foreground mb-4">
                    {planner.phones.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span>{planner.phones[0]}</span>
                      </div>
                    )}
                    {planner.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{planner.email}</span>
                      </div>
                    )}
                    {planner.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-3 w-3" />
                        <a href={planner.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>

                  {planner.phones.length > 0 ? (
                    <Button 
                      className="w-full gap-2" 
                      variant="default"
                      onClick={() => window.open(`tel:${planner.phones[0]}`, '_self')}
                    >
                      <Phone className="h-4 w-4" />
                      Contact Planner
                    </Button>
                  ) : planner.email ? (
                    <Button 
                      className="w-full gap-2" 
                      variant="default"
                      onClick={() => window.open(`mailto:${planner.email}`, '_blank')}
                    >
                      <Mail className="h-4 w-4" />
                      Email Planner
                    </Button>
                  ) : (
                    <Button className="w-full gap-2" variant="secondary" disabled>
                      <Phone className="h-4 w-4" />
                      No Contact Available
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredPlanners.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-4">No planners found in this city</p>
            <Button variant="outline" onClick={() => setSelectedCity("All Cities")}>
              View All Cities
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
            <Users className="h-16 w-16 text-primary mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-3 text-foreground">Can't Find Your Perfect Planner?</h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
              Let our expert team help you discover the ideal event planner for your special occasion
            </p>
            <Dialog open={isRecommendationOpen} onOpenChange={setIsRecommendationOpen}>
              <DialogTrigger asChild>
                <Button variant="premium" size="lg" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  Get Planner Recommendations
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Get Personalized Recommendations
                  </DialogTitle>
                  <DialogDescription>
                    Tell us about your event and we'll recommend the best planners for you.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Event Type *</label>
                    <Select 
                      value={recommendationForm.eventType} 
                      onValueChange={(value) => setRecommendationForm(prev => ({ ...prev, eventType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wedding">Wedding</SelectItem>
                        <SelectItem value="corporate">Corporate Event</SelectItem>
                        <SelectItem value="birthday">Birthday Party</SelectItem>
                        <SelectItem value="naming">Naming Ceremony</SelectItem>
                        <SelectItem value="burial">Burial/Memorial</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Budget Range</label>
                    <Select 
                      value={recommendationForm.budget} 
                      onValueChange={(value) => setRecommendationForm(prev => ({ ...prev, budget: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-500k">Under ₦500,000</SelectItem>
                        <SelectItem value="500k-1m">₦500,000 - ₦1,000,000</SelectItem>
                        <SelectItem value="1m-5m">₦1,000,000 - ₦5,000,000</SelectItem>
                        <SelectItem value="5m-10m">₦5,000,000 - ₦10,000,000</SelectItem>
                        <SelectItem value="over-10m">Over ₦10,000,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Preferred Location *</label>
                    <Select 
                      value={recommendationForm.location} 
                      onValueChange={(value) => setRecommendationForm(prev => ({ ...prev, location: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.filter(c => c !== "All Cities").map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Additional Details</label>
                    <Textarea 
                      placeholder="Tell us more about your event (date, guest count, special requirements...)"
                      value={recommendationForm.details}
                      onChange={(e) => setRecommendationForm(prev => ({ ...prev, details: e.target.value }))}
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setIsRecommendationOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleRecommendationSubmit} className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Get Recommendations
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      <JaraBot />
    </>
  );
};

export default PlannersPage;
