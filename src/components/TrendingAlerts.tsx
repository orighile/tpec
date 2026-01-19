
import { useState, useEffect } from "react";
import { WarningCircle, TrendUp, CheckCircle, X, Bell, Calendar, Sparkle, MapPin, Star } from "phosphor-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";

// Types for trending alerts
interface TrendingAlert {
  id: string;
  type: "vendor" | "venue" | "trend" | "date" | "discount";
  title: string;
  description: string;
  date: Date;
  importance: "low" | "medium" | "high";
  read: boolean;
  image?: string;
  actionLabel?: string;
  actionLink?: string;
  likeCount?: number;
  tags?: string[];
}

// Alert categories for filtering
const alertCategories = [
  { id: "all", name: "All Alerts", icon: WarningCircle },
  { id: "vendor", name: "Vendors", icon: CheckCircle },
  { id: "venue", name: "Venues", icon: MapPin },
  { id: "trend", name: "Trends", icon: TrendUp },
  { id: "date", name: "Hot Dates", icon: Calendar },
  { id: "discount", name: "Deals", icon: Sparkle },
];

// Sample trending alerts data
const sampleAlerts: TrendingAlert[] = [
  {
    id: "1",
    type: "vendor",
    title: "Rising Wedding Photographer",
    description: "Adebayo Studios is getting rave reviews and booking up fast for next season. Check their portfolio!",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    importance: "high",
    read: false,
    image: "/placeholder.svg",
    actionLabel: "View Portfolio",
    actionLink: "/vendors/photographer",
    likeCount: 145,
    tags: ["Photography", "Wedding", "Lagos"]
  },
  {
    id: "2",
    type: "venue",
    title: "New Exclusive Venue Open",
    description: "The Pavilion, a luxurious new venue in Abuja, has started accepting bookings. Early birds get 15% off!",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    importance: "medium",
    read: false,
    image: "/placeholder.svg",
    actionLabel: "View Venue",
    actionLink: "/venues/the-pavilion",
    likeCount: 89,
    tags: ["Venue", "Abuja", "Luxury"]
  },
  {
    id: "3",
    type: "trend",
    title: "Trend Alert: Minimalist Decor",
    description: "Minimalist decor is trending for 2023 weddings and events. Clean lines, subtle colors, and sustainable materials are in!",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    importance: "medium",
    read: true,
    image: "/placeholder.svg",
    tags: ["Decor", "Minimalist", "Sustainable"]
  },
  {
    id: "4",
    type: "date",
    title: "December 2023 Booking Rush",
    description: "December 2023 weekend dates are filling up quickly. Secure your vendors and venues now!",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    importance: "high",
    read: false,
    actionLabel: "Check Availability",
    actionLink: "/planning-tools/calendar",
    tags: ["December", "Holiday Season", "Booking"]
  },
  {
    id: "5",
    type: "discount",
    title: "Flash Sale: Premium Catering",
    description: "Flavor Haven Catering is offering a 20% discount for events booked in the next 7 days.",
    date: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    importance: "high",
    read: false,
    image: "/placeholder.svg",
    actionLabel: "Get Discount",
    actionLink: "/vendors/catering/flavor-haven",
    likeCount: 72,
    tags: ["Catering", "Discount", "Food"]
  },
  {
    id: "6",
    type: "trend",
    title: "Nigerian Fusion Themes Popular",
    description: "Events that blend traditional Nigerian elements with modern aesthetics are seeing increased popularity.",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    importance: "low",
    read: true,
    image: "/placeholder.svg",
    likeCount: 213,
    tags: ["Culture", "Fusion", "Tradition"]
  },
];

const TrendingAlerts = () => {
  const { toast: myToast } = useToast();
  const [alerts, setAlerts] = useState<TrendingAlert[]>(sampleAlerts);
  const [filteredAlerts, setFilteredAlerts] = useState<TrendingAlert[]>(sampleAlerts);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState<boolean>(false);
  const [alertPreferences, setAlertPreferences] = useState({
    vendors: true,
    venues: true,
    trends: true,
    dates: false,
    discounts: true,
    emailNotifications: false,
    pushNotifications: true,
  });

  // Filter alerts when category or unread filter changes
  useEffect(() => {
    let result = alerts;
    
    // Filter by category
    if (activeCategory !== "all") {
      result = result.filter(alert => alert.type === activeCategory);
    }
    
    // Filter by read status if needed
    if (showUnreadOnly) {
      result = result.filter(alert => !alert.read);
    }
    
    setFilteredAlerts(result);
  }, [alerts, activeCategory, showUnreadOnly]);

  // Format the date in a readable way
  const formatAlertDate = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  // Mark an alert as read
  const markAsRead = (alertId: string) => {
    const updatedAlerts = alerts.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    );
    setAlerts(updatedAlerts);
  };

  // Dismiss an alert
  const dismissAlert = (alertId: string) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
    setAlerts(updatedAlerts);
    
    myToast({
      title: "Alert dismissed",
      description: "The alert has been removed from your feed.",
    });
  };

  // Take action on an alert
  const handleAlertAction = (alert: TrendingAlert) => {
    // Mark as read when action is taken
    markAsRead(alert.id);
    
    // In a real app, this would navigate to the action link
    myToast({
      title: "Action taken",
      description: `You clicked on: ${alert.actionLabel}`,
    });
    
    console.log("Action taken:", alert.actionLink);
  };

  // Save alert preferences
  const saveAlertPreferences = () => {
    myToast({
      title: "Preferences saved",
      description: "Your alert preferences have been updated.",
    });
  };

  // Generate a new random alert for demo purposes
  const generateDemoAlert = () => {
    const types = ["vendor", "venue", "trend", "date", "discount"] as const;
    const importances = ["low", "medium", "high"] as const;
    const titles = [
      "New Vendor Alert", 
      "Upcoming Event Trend", 
      "Popular Date Booking Fast",
      "Special Discount Available",
      "New Venue Opening Soon"
    ];
    
    const newAlert: TrendingAlert = {
      id: crypto.randomUUID(),
      type: types[Math.floor(Math.random() * types.length)],
      title: titles[Math.floor(Math.random() * titles.length)],
      description: "This is a demo alert generated to showcase the real-time alert functionality.",
      date: new Date(),
      importance: importances[Math.floor(Math.random() * importances.length)],
      read: false,
      image: "/placeholder.svg",
      actionLabel: "View Details",
      actionLink: "#",
      likeCount: Math.floor(Math.random() * 100),
      tags: ["Demo", "Example", "New"]
    };
    
    setAlerts([newAlert, ...alerts]);
    
    toast("New Alert", {
      description: "A new trending alert has been added to your feed.",
      icon: <TrendUp className="h-4 w-4" />,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <TrendUp className="h-6 w-6" /> Trending Alerts
          </CardTitle>
          <CardDescription>
            Stay updated with the latest trends, hot vendors, and exclusive deals
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Alert category filter */}
          <div className="flex flex-wrap gap-2">
            {alertCategories.map(category => (
              <Button 
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-1.5"
                onClick={() => setActiveCategory(category.id)}
              >
                <category.icon className="h-4 w-4" />
                {category.name}
                {category.id !== "all" && (
                  <Badge variant="secondary" className="ml-1">
                    {alerts.filter(a => a.type === category.id).length}
                  </Badge>
                )}
              </Button>
            ))}
            
            <div className="ml-auto flex items-center gap-2">
              <Label htmlFor="unread-filter" className="text-sm">Unread only</Label>
              <Switch 
                id="unread-filter" 
                checked={showUnreadOnly}
                onCheckedChange={setShowUnreadOnly}
              />
            </div>
          </div>
          
          <Separator />
          
          {/* Alert list */}
          <div className="space-y-4">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map(alert => (
                <div 
                  key={alert.id} 
                  className={`
                    relative rounded-lg border p-4 transition-all
                    ${!alert.read ? 'bg-muted/50' : 'bg-background'}
                    ${alert.importance === 'high' ? 'border-destructive/20' : 
                      alert.importance === 'medium' ? 'border-secondary' : 'border'}
                  `}
                >
                  {/* Dismiss button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => dismissAlert(alert.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex items-start gap-4">
                    {/* Alert image */}
                    {alert.image && (
                      <div className="hidden sm:block flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                        <img src={alert.image} alt={alert.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      {/* Alert header */}
                      <div className="flex items-center gap-2 mb-1">
                        {alert.type === 'vendor' && <CheckCircle className="h-4 w-4 text-primary" />}
                        {alert.type === 'venue' && <MapPin className="h-4 w-4 text-accent-foreground" />}
                        {alert.type === 'trend' && <TrendUp className="h-4 w-4 text-primary" />}
                        {alert.type === 'date' && <Calendar className="h-4 w-4 text-destructive" />}
                        {alert.type === 'discount' && <Sparkle className="h-4 w-4 text-secondary-foreground" />}
                        
                        <h3 className="font-medium">{alert.title}</h3>
                        
                        {alert.importance === 'high' && (
                          <Badge variant="destructive" className="ml-auto">Important</Badge>
                        )}
                      </div>
                      
                      {/* Alert content */}
                      <p className="text-sm text-muted-foreground mb-2">
                        {alert.description}
                      </p>
                      
                      {/* Alert tags */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {alert.tags?.map(tag => (
                          <Badge variant="outline" key={tag} className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Alert footer */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatAlertDate(alert.date)}</span>
                        
                        {alert.likeCount && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                            <span>{alert.likeCount} people found this helpful</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Action button */}
                      {alert.actionLabel && (
                        <Button
                          variant="default"
                          size="sm"
                          className="mt-3"
                          onClick={() => handleAlertAction(alert)}
                        >
                          {alert.actionLabel}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <WarningCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No alerts found</h3>
                <p className="mt-1 text-muted-foreground">
                  There are no alerts matching your current filters
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setActiveCategory("all");
                    setShowUnreadOnly(false);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between gap-3 border-t pt-6">
          <div className="text-sm text-muted-foreground">
            {alerts.filter(a => !a.read).length} unread alerts
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={generateDemoAlert}>
              <Bell className="mr-2 h-4 w-4" />
              Demo New Alert
            </Button>
            <Button onClick={() => setActiveCategory("all")}>
              View All
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Alert Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Preferences</CardTitle>
          <CardDescription>
            Customize what types of alerts you want to receive
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <h3 className="font-medium">Alert Categories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="vendors" 
                    checked={alertPreferences.vendors}
                    onCheckedChange={(checked) => setAlertPreferences({...alertPreferences, vendors: checked})}
                  />
                  <Label htmlFor="vendors">Vendor alerts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="venues" 
                    checked={alertPreferences.venues}
                    onCheckedChange={(checked) => setAlertPreferences({...alertPreferences, venues: checked})}
                  />
                  <Label htmlFor="venues">Venue alerts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="trends" 
                    checked={alertPreferences.trends}
                    onCheckedChange={(checked) => setAlertPreferences({...alertPreferences, trends: checked})}
                  />
                  <Label htmlFor="trends">Trending themes and styles</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="dates" 
                    checked={alertPreferences.dates}
                    onCheckedChange={(checked) => setAlertPreferences({...alertPreferences, dates: checked})}
                  />
                  <Label htmlFor="dates">Hot date warnings</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="discounts" 
                    checked={alertPreferences.discounts}
                    onCheckedChange={(checked) => setAlertPreferences({...alertPreferences, discounts: checked})}
                  />
                  <Label htmlFor="discounts">Deals and discounts</Label>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid gap-3">
              <h3 className="font-medium">Notification Settings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="email" 
                    checked={alertPreferences.emailNotifications}
                    onCheckedChange={(checked) => setAlertPreferences({
                      ...alertPreferences, 
                      emailNotifications: checked
                    })}
                  />
                  <Label htmlFor="email">Email notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="push" 
                    checked={alertPreferences.pushNotifications}
                    onCheckedChange={(checked) => setAlertPreferences({
                      ...alertPreferences, 
                      pushNotifications: checked
                    })}
                  />
                  <Label htmlFor="push">Push notifications</Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button onClick={saveAlertPreferences}>Save Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TrendingAlerts;
