import { useLocation, Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Search, Calendar, Users, MapPin, Wrench } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      currentPath
    );
  }, [currentPath]);

  // Available routes for suggestions
  const availableRoutes = [
    { path: "/", label: "Home", description: "Main landing page", icon: Home },
    { path: "/about", label: "About Us", description: "Learn more about TPEC", icon: Users },
    { path: "/vendors", label: "Vendors", description: "Find event vendors", icon: MapPin },
    { path: "/vendors/marketplace", label: "Vendor Marketplace", description: "Browse vendor marketplace", icon: MapPin },
    { path: "/blog", label: "Blog", description: "Event planning tips and articles", icon: Search },
    { path: "/planning-tools", label: "Planning Tools", description: "Event planning utilities", icon: Wrench },
    { path: "/budget", label: "Budget Calculator", description: "Track event expenses", icon: Wrench },
    { path: "/checklist", label: "Event Checklist", description: "Never miss a task", icon: Wrench },
    { path: "/guests", label: "Guest Management", description: "Manage invitations and RSVPs", icon: Users },
    { path: "/seating", label: "Seating Chart", description: "Plan seating arrangements", icon: Wrench },
    { path: "/party-crew", label: "Party Crew", description: "Organize your event team", icon: Users },
    { path: "/events", label: "Events", description: "Browse and create events", icon: Calendar },
    { path: "/event-categories", label: "Event Categories", description: "Explore event types", icon: Calendar },
    { path: "/trinity-palace", label: "Trinity Palace", description: "Premium venue services", icon: MapPin },
    { path: "/social-trends", label: "Social & Trends", description: "Latest event trends", icon: Search },
    { path: "/ai-recommendations", label: "AI Recommendations", description: "Personalized suggestions", icon: Search },
    { path: "/advanced-features", label: "Advanced Features", description: "Premium tools", icon: Wrench },
  ];

  // Smart URL matching for suggestions
  const suggestions = useMemo(() => {
    const pathSegments = currentPath.toLowerCase().split('/').filter(Boolean);
    
    return availableRoutes
      .map(route => {
        const routeSegments = route.path.toLowerCase().split('/').filter(Boolean);
        let score = 0;
        
        // Exact segment matches
        pathSegments.forEach(segment => {
          if (routeSegments.includes(segment) || route.label.toLowerCase().includes(segment)) {
            score += 10;
          }
          if (route.description.toLowerCase().includes(segment)) {
            score += 5;
          }
        });
        
        // Handle common misspellings and variations
        if (currentPath.includes('planning') && route.path.includes('planning')) score += 15;
        if (currentPath.includes('vendor') && route.path.includes('vendor')) score += 15;
        if (currentPath.includes('event') && route.path.includes('event')) score += 15;
        if (currentPath.includes('guest') && route.path.includes('guest')) score += 15;
        if (currentPath.includes('budget') && route.path.includes('budget')) score += 15;
        if (currentPath.includes('social') && route.path.includes('social')) score += 15;
        
        return { ...route, score };
      })
      .filter(route => route.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [currentPath]);

  const popularPages = [
    { path: "/", label: "Home", icon: Home },
    { path: "/planning-tools", label: "Planning Tools", icon: Wrench },
    { path: "/vendors", label: "Vendors", icon: MapPin },
    { path: "/events", label: "Events", icon: Calendar },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h1 className="text-8xl font-bold text-gray-200 mb-4">404</h1>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
            <p className="text-xl text-gray-600 mb-2">
              The page <code className="bg-gray-100 px-2 py-1 rounded">{currentPath}</code> doesn't exist.
            </p>
            <p className="text-gray-500">
              Don't worry, let's get you back on track!
            </p>
          </div>

          {suggestions.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Did you mean one of these?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map((route) => {
                  const IconComponent = route.icon;
                  return (
                    <Card key={route.path} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <IconComponent className="h-5 w-5 text-primary" />
                          {route.label}
                        </CardTitle>
                        <CardDescription>{route.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button asChild className="w-full">
                          <Link to={route.path}>Visit Page</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Popular Pages</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {popularPages.map((page) => {
                const IconComponent = page.icon;
                return (
                  <Button key={page.path} asChild variant="outline" className="flex items-center gap-2">
                    <Link to={page.path}>
                      <IconComponent className="h-4 w-4" />
                      {page.label}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/">
                <Home className="mr-2 h-5 w-5" />
                Return Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/search">
                <Search className="mr-2 h-5 w-5" />
                Search Site
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
