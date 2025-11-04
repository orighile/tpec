import { MagnifyingGlass, CaretRight } from "phosphor-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { nigerianLocations } from "@/components/jarabot/utils";
import heroImage from "@/assets/hero-celebration.jpg";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  // Create enhanced suggestions based on JaraBot's data
  const getSuggestions = () => {
    const query = searchQuery.toLowerCase().trim();
    if (query.length < 2) return [];

    const suggestions = [];

    // Add location-based suggestions
    const locationMatches = nigerianLocations
      .filter(location => location.toLowerCase().includes(query))
      .slice(0, 3);

    if (locationMatches.length > 0) {
      suggestions.push(...locationMatches.map(location => `Events in ${location.charAt(0).toUpperCase() + location.slice(1)}`));
      suggestions.push(...locationMatches.map(location => `Venues in ${location.charAt(0).toUpperCase() + location.slice(1)}`));
    }

    // Add general event types
    const eventTypes = ["Wedding", "Birthday", "Corporate", "Cultural celebration", "Anniversary", "Baby Shower"];
    const eventMatches = eventTypes
      .filter(type => type.toLowerCase().includes(query))
      .slice(0, 3);
    
    if (eventMatches.length > 0) {
      suggestions.push(...eventMatches.map(type => `${type} planning`));
    }

    // Add vendor-related suggestions
    const vendorTypes = ["Catering", "Photography", "Venue", "Decoration", "Music", "Security", "Cakes"];
    const vendorMatches = vendorTypes
      .filter(type => type.toLowerCase().includes(query))
      .slice(0, 3);
    
    if (vendorMatches.length > 0) {
      suggestions.push(...vendorMatches.map(type => `${type} vendors`));
    }

    // Add cultural suggestions
    const culturalItems = ["Traditional wedding", "Aso ebi", "Yoruba customs", "Igbo wedding", "Hausa ceremony"];
    const culturalMatches = culturalItems
      .filter(item => item.toLowerCase().includes(query))
      .slice(0, 2);
      
    if (culturalMatches.length > 0) {
      suggestions.push(...culturalMatches);
    }

    return suggestions.slice(0, 7); // Limit to 7 suggestions max for better UX
  };

  const suggestions = getSuggestions();

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/8 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <span className="text-sm font-semibold text-primary">🎉 Nigeria's #1 Event Planning Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Plan Your{" "}
              <span className="gradient-text">
                Dream Events
              </span>{" "}
              with Confidence
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              From vibrant Nigerian weddings to corporate excellence. 
              Connect with verified vendors, explore stunning venues, and bring your vision to life.
            </p>
          
            <div className="glass-card p-6 space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <MagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" weight="bold" />
                  <input 
                    type="text" 
                    placeholder="Search events, vendors, venues, or cultural info..." 
                    className="w-full py-4 pl-12 pr-32 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground transition-all"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                  />
                  <Button 
                    type="submit" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 px-6"
                  >
                    Search
                  </Button>
                </div>
                
                {/* Enhanced Search suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute mt-2 w-full bg-card rounded-xl shadow-[var(--shadow-elegant)] border border-border z-50 overflow-hidden">
                    <ul className="py-2">
                      {suggestions.map((suggestion, index) => (
                        <li 
                          key={index}
                          className="px-4 py-3 hover:bg-primary/5 cursor-pointer flex items-center text-left text-foreground transition-colors group"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <MagnifyingGlass className="h-4 w-4 mr-3 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="group-hover:text-primary transition-colors">{suggestion}</span>
                          <CaretRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </form>
              
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Popular:</span>
                {["Lagos Weddings", "Corporate Events", "Birthday Parties", "Venues"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleSuggestionClick(tag)}
                    className="px-3 py-1 text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/vendors/marketplace">
                <Button variant="premium" size="lg" className="gap-2">
                  Explore Vendors
                  <CaretRight weight="bold" />
                </Button>
              </Link>
              <Link to="/planners">
                <Button variant="outline" size="lg" className="gap-2">
                  Find Planners
                  <CaretRight weight="bold" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl blur-2xl"></div>
            <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-[var(--shadow-elegant)] transform hover:scale-105 transition-transform duration-500">
              <img 
                src={heroImage}
                alt="Vibrant Nigerian event celebration with traditional decorations"
                className="w-full h-auto object-cover"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
