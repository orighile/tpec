import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Smartphone, Tablet, Monitor, Menu, X, ChevronDown, 
  Search, Filter, Heart, Share2, Star, MapPin, Calendar,
  Phone, Mail, MessageCircle, ArrowLeft, Plus, Grid,
  List, Eye, Settings, User, Bell, ShoppingBag
} from 'lucide-react';

interface MobileNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

interface QuickAction {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  href: string;
}

const MobileOptimizations: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems: MobileNavItem[] = [
    { id: 'home', label: 'Home', icon: <Grid className="h-5 w-5" />, href: '/' },
    { id: 'search', label: 'Search', icon: <Search className="h-5 w-5" />, href: '/search' },
    { id: 'events', label: 'Events', icon: <Calendar className="h-5 w-5" />, href: '/events', badge: 3 },
    { id: 'vendors', label: 'Vendors', icon: <ShoppingBag className="h-5 w-5" />, href: '/vendors' },
    { id: 'profile', label: 'Profile', icon: <User className="h-5 w-5" />, href: '/profile' }
  ];

  const quickActions: QuickAction[] = [
    { id: 'create-event', title: 'Create Event', icon: <Plus className="h-6 w-6" />, color: 'bg-primary', href: '/events/create' },
    { id: 'find-vendor', title: 'Find Vendor', icon: <Search className="h-6 w-6" />, color: 'bg-secondary', href: '/vendors' },
    { id: 'book-service', title: 'Book Service', icon: <Calendar className="h-6 w-6" />, color: 'bg-accent', href: '/services' },
    { id: 'get-quote', title: 'Get Quote', icon: <MessageCircle className="h-6 w-6" />, color: 'bg-muted-foreground', href: '/quote' }
  ];

  const sampleEvents = [
    {
      id: '1',
      name: 'Summer Wedding Celebration',
      date: '2024-09-15',
      location: 'Victoria Island, Lagos',
      image: '/api/placeholder/300/200',
      price: '₦500,000',
      rating: 4.8,
      reviews: 156,
      category: 'Wedding'
    },
    {
      id: '2',
      name: 'Corporate Annual Gala',
      date: '2024-10-20',
      location: 'Abuja Convention Center',
      image: '/api/placeholder/300/200',
      price: '₦1,200,000',
      rating: 4.9,
      reviews: 89,
      category: 'Corporate'
    }
  ];

  const sampleVendors = [
    {
      id: '1',
      name: 'Perfect Moments Photography',
      category: 'Photography',
      location: 'Lagos',
      image: '/api/placeholder/100/100',
      rating: 4.9,
      reviews: 245,
      price: '₦75,000',
      verified: true
    },
    {
      id: '2',
      name: 'Elite Catering Services',
      category: 'Catering',
      location: 'Abuja',
      image: '/api/placeholder/100/100',
      rating: 4.7,
      reviews: 189,
      price: '₦2,500/guest',
      verified: true
    }
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const MobileHeader = () => (
    <div className="lg:hidden bg-background border-b sticky top-0 z-40">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <h1 className="text-lg font-bold">TPEC Events</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="p-2">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-xs">
              3
            </Badge>
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );

  const MobileMenu = () => (
    <div className={`
      lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300
      ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `}>
      <div className={`
        fixed left-0 top-0 h-full w-80 bg-background shadow-xl transform transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="p-4 space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-start gap-3 h-12"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <Badge className="ml-auto bg-destructive text-destructive-foreground">
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
          <Separator className="my-4" />
          <Button variant="ghost" className="w-full justify-start gap-3 h-12">
            <Settings className="h-5 w-5" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );

  const MobileSearchBar = () => (
    <div className="lg:hidden p-4 bg-muted">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search events, vendors, services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-2 top-1 p-1"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      {showFilters && (
        <div className="mt-3 p-3 bg-background rounded-lg border space-y-2">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="cursor-pointer">Category</Badge>
            <Badge variant="outline" className="cursor-pointer">Location</Badge>
            <Badge variant="outline" className="cursor-pointer">Price Range</Badge>
            <Badge variant="outline" className="cursor-pointer">Date</Badge>
          </div>
        </div>
      )}
    </div>
  );

  const QuickActionsSection = () => (
    <div className="lg:hidden p-4">
      <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <Button
            key={action.id}
            variant="outline"
            className="h-20 flex-col gap-2 border-2"
          >
            <div className={`p-2 rounded-full text-white ${action.color}`}>
              {action.icon}
            </div>
            <span className="text-sm font-medium">{action.title}</span>
          </Button>
        ))}
      </div>
    </div>
  );

  const MobileEventCard = ({ event }: { event: any }) => (
    <Card className="mb-4">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <Button variant="secondary" size="sm" className="p-2 h-8 w-8">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="sm" className="p-2 h-8 w-8">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          <Badge className="absolute bottom-2 left-2 bg-primary">
            {event.category}
          </Badge>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">{event.name}</h3>
          <div className="flex items-center gap-1 mb-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {event.location}
          </div>
          <div className="flex items-center gap-1 mb-3 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {new Date(event.date).toLocaleDateString()}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{event.rating}</span>
              <span className="text-sm text-muted-foreground">({event.reviews})</span>
            </div>
            <span className="text-lg font-bold text-primary">{event.price}</span>
          </div>
          <div className="flex gap-2 mt-3">
            <Button className="flex-1">View Details</Button>
            <Button variant="outline" className="flex-1">Contact</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const MobileVendorCard = ({ vendor }: { vendor: any }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <img
            src={vendor.image}
            alt={vendor.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm truncate">{vendor.name}</h3>
              {vendor.verified && (
                <Badge variant="secondary" className="text-xs">✓</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-1">{vendor.category}</p>
            <div className="flex items-center gap-1 mb-2">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{vendor.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{vendor.rating}</span>
                <span className="text-xs text-muted-foreground">({vendor.reviews})</span>
              </div>
              <span className="text-sm font-bold text-primary">{vendor.price}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <Button size="sm" className="flex-1 h-8 text-xs">View Profile</Button>
          <Button variant="outline" size="sm" className="h-8 p-2">
            <Phone className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 p-2">
            <Mail className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ViewToggle = () => (
    <div className="lg:hidden flex items-center justify-between p-4 bg-muted">
      <span className="text-sm font-medium">View</span>
      <div className="flex bg-background rounded-lg border p-1">
        <Button
          variant={activeView === 'grid' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('grid')}
          className="h-8 px-3"
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant={activeView === 'list' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('list')}
          className="h-8 px-3"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const MobileBottomNav = () => (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-40">
      <div className="grid grid-cols-5 py-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className="flex flex-col gap-1 h-16 relative"
          >
            {item.icon}
            <span className="text-xs">{item.label}</span>
            {item.badge && (
              <Badge className="absolute top-2 right-2 h-4 w-4 text-xs bg-destructive">
                {item.badge}
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted">
      <MobileHeader />
      <MobileMenu />
      
      {/* Mobile Content */}
      <div className="lg:hidden">
        <MobileSearchBar />
        <QuickActionsSection />
        <ViewToggle />
        
        <div className="px-4 pb-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Featured Events</h2>
            <Button variant="ghost" size="sm">
              View All <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          {activeView === 'grid' ? (
            <div className="space-y-4">
              {sampleEvents.map((event) => (
                <MobileEventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {sampleEvents.map((event) => (
                <Card key={event.id} className="p-3">
                  <div className="flex gap-3">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{event.name}</h3>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                      <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{event.rating}</span>
                        </div>
                        <span className="font-bold text-primary">{event.price}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          <Separator className="my-6" />
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Top Vendors</h2>
            <Button variant="ghost" size="sm">
              View All <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {sampleVendors.map((vendor) => (
              <MobileVendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Desktop View Message */}
      <div className="hidden lg:block p-8 text-center">
        <Monitor className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Mobile Optimization Preview</h2>
        <p className="text-muted-foreground mb-4">
          This component demonstrates mobile-optimized interfaces for the TPEC Events platform.
        </p>
        <p className="text-sm text-muted-foreground">
          Resize your browser window or view on a mobile device to see the mobile interface.
        </p>
      </div>
      
      <MobileBottomNav />
    </div>
  );
};

export default MobileOptimizations;
