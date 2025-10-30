import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, Filter, MapPin, Calendar, Users, DollarSign, 
  Star, Clock, Zap, X, RefreshCw, SlidersHorizontal
} from 'lucide-react';

interface SearchFilters {
  query: string;
  category: string;
  location: string;
  priceRange: [number, number];
  rating: number;
  availability: string[];
  eventType: string;
  guestCount: number;
  verified: boolean;
  featured: boolean;
  tags: string[];
  dateRange: {
    start: string;
    end: string;
  };
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface SearchResult {
  id: string;
  type: 'vendor' | 'event' | 'service';
  title: string;
  description: string;
  category: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  verified: boolean;
  featured: boolean;
  tags: string[];
  availability: string[];
}

const AdvancedSearch: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    location: '',
    priceRange: [0, 500000],
    rating: 0,
    availability: [],
    eventType: '',
    guestCount: 0,
    verified: false,
    featured: false,
    tags: [],
    dateRange: { start: '', end: '' },
    sortBy: 'relevance',
    sortOrder: 'desc'
  });

  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Wedding photographers Lagos',
    'DJ services Abuja',
    'Catering services'
  ]);

  const categories = [
    'Photography', 'Catering', 'DJ/Music', 'Decoration', 'Venue',
    'Transportation', 'Entertainment', 'Security', 'Equipment Rental'
  ];

  const locations = [
    'Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan',
    'Kaduna', 'Jos', 'Enugu', 'Calabar', 'Benin City'
  ];

  const eventTypes = [
    'Wedding', 'Birthday', 'Corporate', 'Conference', 'Concert',
    'Workshop', 'Festival', 'Exhibition', 'Launch Event'
  ];

  const availabilityOptions = [
    'Weekdays', 'Weekends', 'Holidays', 'Evening', 'Morning', 'Afternoon'
  ];

  const popularTags = [
    'Premium', 'Budget-friendly', 'Same-day', 'Customizable', 'Package deals',
    'Professional', 'Local', 'Award-winning', 'Experienced', 'Modern'
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const handleSearch = async () => {
    setIsSearching(true);
    
    // Add to recent searches if query exists
    if (filters.query && !recentSearches.includes(filters.query)) {
      setRecentSearches(prev => [filters.query, ...prev.slice(0, 4)]);
    }

    // Simulate API call
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'vendor',
          title: 'Elite Photography Studios',
          description: 'Professional wedding and event photography with 10+ years experience',
          category: 'Photography',
          location: 'Lagos',
          price: 150000,
          rating: 4.8,
          reviewCount: 127,
          imageUrl: '/api/placeholder/300/200',
          verified: true,
          featured: true,
          tags: ['Premium', 'Professional', 'Award-winning'],
          availability: ['Weekends', 'Weekdays']
        },
        {
          id: '2',
          type: 'vendor',
          title: 'Royal Catering Services',
          description: 'Full-service catering for all event types with continental and local cuisine',
          category: 'Catering',
          location: 'Abuja',
          price: 75000,
          rating: 4.6,
          reviewCount: 89,
          imageUrl: '/api/placeholder/300/200',
          verified: true,
          featured: false,
          tags: ['Package deals', 'Customizable'],
          availability: ['Weekends', 'Holidays']
        },
        {
          id: '3',
          type: 'event',
          title: 'Tech Summit Nigeria 2025',
          description: 'Annual technology conference bringing together industry leaders',
          category: 'Conference',
          location: 'Lagos',
          price: 25000,
          rating: 4.9,
          reviewCount: 245,
          imageUrl: '/api/placeholder/300/200',
          verified: true,
          featured: true,
          tags: ['Professional', 'Networking', 'Technology'],
          availability: ['Weekdays']
        }
      ];
      
      setResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };

  const resetFilters = () => {
    setFilters({
      query: '',
      category: '',
      location: '',
      priceRange: [0, 500000],
      rating: 0,
      availability: [],
      eventType: '',
      guestCount: 0,
      verified: false,
      featured: false,
      tags: [],
      dateRange: { start: '', end: '' },
      sortBy: 'relevance',
      sortOrder: 'desc'
    });
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const toggleAvailability = (option: string) => {
    setFilters(prev => ({
      ...prev,
      availability: prev.availability.includes(option)
        ? prev.availability.filter(a => a !== option)
        : [...prev.availability, option]
    }));
  };

  useEffect(() => {
    if (filters.query) {
      const debounceTimer = setTimeout(handleSearch, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [filters.query]);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Advanced Search
          </CardTitle>
          <CardDescription>Find exactly what you need for your event</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors, events, or services..."
                value={filters.query}
                onChange={(e) => setFilters({...filters, query: e.target.value})}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Search'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Recent:</span>
              {recentSearches.map((search, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => setFilters({...filters, query: search})}
                >
                  {search}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Basic Filters */}
              <div className="space-y-4">
                <h3 className="font-semibold">Basic Filters</h3>
                
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All categories</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select value={filters.location} onValueChange={(value) => setFilters({...filters, location: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="All locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All locations</SelectItem>
                      {locations.map(loc => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <Select value={filters.eventType} onValueChange={(value) => setFilters({...filters, eventType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="All event types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All event types</SelectItem>
                      {eventTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Price & Rating */}
              <div className="space-y-4">
                <h3 className="font-semibold">Price & Quality</h3>
                
                <div className="space-y-2">
                  <Label>
                    Price Range: {formatCurrency(filters.priceRange[0])} - {formatCurrency(filters.priceRange[1])}
                  </Label>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => setFilters({...filters, priceRange: value as [number, number]})}
                    max={500000}
                    step={5000}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Minimum Rating</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <Star
                        key={rating}
                        className={`h-6 w-6 cursor-pointer ${
                          rating <= filters.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                        onClick={() => setFilters({...filters, rating})}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Guest Count</Label>
                  <Input
                    type="number"
                    placeholder="Expected guests"
                    value={filters.guestCount || ''}
                    onChange={(e) => setFilters({...filters, guestCount: parseInt(e.target.value) || 0})}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="verified"
                      checked={filters.verified}
                      onCheckedChange={(checked) => setFilters({...filters, verified: checked as boolean})}
                    />
                    <Label htmlFor="verified">Verified only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={filters.featured}
                      onCheckedChange={(checked) => setFilters({...filters, featured: checked as boolean})}
                    />
                    <Label htmlFor="featured">Featured only</Label>
                  </div>
                </div>
              </div>

              {/* Availability & Tags */}
              <div className="space-y-4">
                <h3 className="font-semibold">Availability & Tags</h3>
                
                <div className="space-y-2">
                  <Label>Availability</Label>
                  <div className="space-y-2">
                    {availabilityOptions.map(option => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={filters.availability.includes(option)}
                          onCheckedChange={() => toggleAvailability(option)}
                        />
                        <Label htmlFor={option} className="text-sm">{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-1">
                    {popularTags.map(tag => (
                      <Badge
                        key={tag}
                        variant={filters.tags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/80"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select value={filters.sortBy} onValueChange={(value) => setFilters({...filters, sortBy: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="reviews">Reviews</SelectItem>
                      <SelectItem value="date">Date Added</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
          <CardDescription>
            {results.length} results found
            {filters.query && ` for "${filters.query}"`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSearching ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Searching...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map(result => (
                <Card key={result.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img 
                        src={result.imageUrl}
                        alt={result.title}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold flex items-center gap-2">
                              {result.title}
                              {result.verified && <Badge variant="secondary">Verified</Badge>}
                              {result.featured && <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>}
                            </h3>
                            <p className="text-sm text-muted-foreground">{result.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-lg">{formatCurrency(result.price)}</div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{result.rating} ({result.reviewCount})</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {result.location}
                          </span>
                          <span>{result.category}</span>
                          <Badge variant="outline">{result.type}</Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {result.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex gap-1">
                            {result.availability.map(avail => (
                              <Badge key={avail} variant="secondary" className="text-xs">
                                {avail}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">View Details</Button>
                            <Button size="sm">
                              {result.type === 'vendor' ? 'Book Now' : 'Get Tickets'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedSearch;
