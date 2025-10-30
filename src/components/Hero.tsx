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
    <div className="relative overflow-hidden">
      {/* Hero Image Section */}
      <div className="relative h-[600px] md:h-[700px]">
        <img 
          src={heroImage}
          alt="Vibrant Nigerian event celebration with traditional decorations"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Subtle dark overlay for text readability only */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Plan Your <span className="text-jara-gold">Nigerian Events</span> with Style and Ease
            </h1>
            
            <p className="text-lg md:text-xl opacity-90 mb-10">
              From corporate conferences to vibrant parties, 
              TPEC helps you create unforgettable experiences.
            </p>
          
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl max-w-xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search for events, vendors, venues, or cultural info..." 
                className="w-full py-3 pl-10 pr-4 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-jara-gold"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              <Button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-jara-green hover:bg-jara-green/90 h-10">
                Search
              </Button>
              
              {/* Enhanced Search suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-50">
                  <ul className="py-1">
                    {suggestions.map((suggestion, index) => (
                      <li 
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-left text-gray-800"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <MagnifyingGlass className="h-4 w-4 mr-2 text-gray-500" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>
          </div>
          </div>
        </div>
        
        {/* Curved bottom edge */}
        <div className="absolute -bottom-1 left-0 right-0 h-12 md:h-16">
          <svg 
            viewBox="0 0 1440 48" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path 
              d="M0 48H1440V0C1440 0 1144.5 48 720 48C295.5 48 0 0 0 0V48Z" 
              fill="white"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Hero;
