import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Tag } from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import JaraBot from "../components/jarabot";
import { performSearch, SearchResultItem, getTypeColor } from "@/utils/SearchUtils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Parse search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q");
    if (query) {
      setSearchTerm(query);
      executeSearch(query);
      setHasSearched(true);
    }
  }, [location.search]);

  const executeSearch = (query: string) => {
    setIsSearching(true);
    
    // Use setTimeout to simulate network delay and show loading state
    setTimeout(() => {
      const results = performSearch(query);
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      // Update URL with search query
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      executeSearch(searchTerm);
      setHasSearched(true);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'venue':
        return <MapPin className="h-4 w-4 mr-1" />;
      case 'vendor':
        return <Tag className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  // Generate the correct URL based on result type
  const getResultUrl = (result: SearchResultItem): string => {
    switch (result.type) {
      case 'venue':
        return '/venues';
      case 'vendor':
        return `/vendors/${result.id}`;
      case 'blog':
        return result.id.startsWith('blog-') ? `/blog/${result.id.replace('blog-', '')}` : '/blog';
      case 'event':
        return '/events';
      case 'cultural':
        return '/gallery';
      case 'service':
        return '/services';
      default:
        return '/';
    }
  };

  return (
    <div className="py-12 bg-muted/30 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Search</h1>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search for venues, vendors, events, cultural info..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" disabled={isSearching}>
              <Search className="h-4 w-4 mr-2" />
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>
        
        <div className="max-w-4xl mx-auto">
          {isSearching ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-white overflow-hidden">
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20 rounded" />
                      <Skeleton className="h-6 w-full rounded" />
                      <Skeleton className="h-4 w-4/5 rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {searchResults.length > 0 ? (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Search Results ({searchResults.length})</h2>
                  {searchResults.map((result) => (
                    <Card key={result.id} className="bg-white overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-2">
                          <Badge className={getTypeColor(result.type)}>
                            {getIcon(result.type)}
                            {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                          </Badge>
                          {result.location && (
                            <div className="ml-2 text-sm text-muted-foreground flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {result.location}
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl font-medium mb-2">{result.title}</h3>
                        <p className="text-muted-foreground mb-3">{result.description}</p>
                        
                        {result.tags && result.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {result.tags.map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="bg-muted/50">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="px-6 py-3 bg-muted/30 border-t">
                        <Button variant="link" className="p-0 h-auto text-primary" asChild>
                          <Link to={getResultUrl(result)}>View Details</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                hasSearched && (
                  <div className="text-center py-12 bg-card rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">No results found</h2>
                    <p className="text-muted-foreground">
                      No matches found for "{searchTerm}". Try different keywords or browse our categories.
                    </p>
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>
      <JaraBot />
    </div>
  );
};

export default SearchPage;
