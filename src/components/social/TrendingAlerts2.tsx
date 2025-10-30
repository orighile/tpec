import React, { useState } from "react";
import { TrendingUp, Calendar, MapPin, Bell, ExternalLink, Filter } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface TrendingItem {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  trending: number;
  tags: string[];
  image?: string;
}

const sampleTrends: TrendingItem[] = [
  {
    id: "1",
    title: "Asoebi Styles: Velvet & Sequins",
    description: "The hottest trend for Nigerian weddings this season is combining velvet and sequin fabrics for asoebi outfits.",
    category: "Fashion",
    location: "Nationwide",
    date: "Trending this month",
    trending: 87,
    tags: ["WeddingFashion", "AsoebiStyles", "NigerianWeddings"],
    image: "https://images.unsplash.com/photo-1615395641882-a05f9cf4e3a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  },
  {
    id: "2",
    title: "Cultural Dance Interludes",
    description: "Traditional dance groups performing during wedding ceremonies is becoming a must-have entertainment feature.",
    category: "Entertainment",
    location: "Lagos, Abuja, Port Harcourt",
    date: "Rising trend",
    trending: 65,
    tags: ["TraditionalDance", "WeddingEntertainment", "CulturalCelebration"],
    image: "https://images.unsplash.com/photo-1496024840928-4c417adf211d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  },
  {
    id: "3",
    title: "Tech-Integrated Gift Registries",
    description: "Digital gift registries with mobile payment options are replacing traditional gift tables at Nigerian events.",
    category: "Technology",
    location: "Urban areas",
    date: "New trend",
    trending: 72,
    tags: ["GiftRegistry", "TechWeddings", "DigitalGifting"],
    image: "https://images.unsplash.com/photo-1556742031-c6961e8560b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  },
  {
    id: "4",
    title: "Personalized Food Stations",
    description: "Event planners are moving away from standard buffets to interactive, personalized food stations with Nigerian cuisine.",
    category: "Catering",
    location: "Major cities",
    date: "Fast-growing trend",
    trending: 93,
    tags: ["FoodStations", "NigerianCuisine", "EventCatering"],
    image: "https://images.unsplash.com/photo-1630323252783-144e2b6de183?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  }
];

const TrendingAlerts2: React.FC = () => {
  const [trends, setTrends] = useState<TrendingItem[]>(sampleTrends);
  const [subscribed, setSubscribed] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("all");

  const handleSubscribe = (trendId: string) => {
    if (subscribed.has(trendId)) {
      setSubscribed(prev => {
        const newSet = new Set(prev);
        newSet.delete(trendId);
        return newSet;
      });
      toast.info("Unsubscribed from trend alerts");
    } else {
      setSubscribed(prev => new Set(prev).add(trendId));
      toast.success("You'll receive alerts about this trend!");
    }
  };

  const handleExploreMoreTrends = () => {
    toast.info("Loading more trend data...");
    // In a real implementation, this would fetch more trends
  };

  const handleReadMore = (trendId: string) => {
    toast.info(`Opening detailed view for trend #${trendId}`);
    // In a real implementation, this would navigate to a detailed view
  };

  const filteredTrends = activeTab === "all" 
    ? trends 
    : trends.filter(trend => trend.category.toLowerCase() === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-jara-teal" />
            <span>Trending in Nigerian Events</span>
          </h2>
          <p className="text-gray-600">Stay updated with the latest trends in event planning</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button size="sm" className="bg-jara-teal hover:bg-jara-teal/90 flex items-center gap-1">
            <Bell className="h-4 w-4" />
            <span>All Alerts</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full max-w-lg mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="fashion">Fashion</TabsTrigger>
          <TabsTrigger value="entertainment">Entertainment</TabsTrigger>
          <TabsTrigger value="technology">Technology</TabsTrigger>
          <TabsTrigger value="catering">Catering</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTrends.map(trend => (
              <Card key={trend.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Badge 
                        variant="outline" 
                        className={`
                          ${trend.trending > 80 ? 'bg-red-50 text-red-600 border-red-200' : ''}
                          ${trend.trending > 60 && trend.trending <= 80 ? 'bg-amber-50 text-amber-600 border-amber-200' : ''}
                          ${trend.trending <= 60 ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
                        `}
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {trend.trending}% trending
                      </Badge>
                      <Badge className="bg-jara-teal/10 text-jara-teal border-jara-teal/20">
                        {trend.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{trend.title}</CardTitle>
                  </div>
                  <Button 
                    variant={subscribed.has(trend.id) ? "default" : "outline"} 
                    size="sm" 
                    className={`flex-shrink-0 ${subscribed.has(trend.id) ? 'bg-jara-teal hover:bg-jara-teal/90' : ''}`}
                    onClick={() => handleSubscribe(trend.id)}
                  >
                    <Bell className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex mb-4">
                    {trend.image && (
                      <img 
                        src={trend.image} 
                        alt={trend.title} 
                        className="w-24 h-24 object-cover rounded-md mr-3" 
                      />
                    )}
                    <div>
                      <p className="text-sm mb-2">{trend.description}</p>
                      <div className="flex flex-col text-xs text-gray-500">
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {trend.location}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {trend.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {trend.tags.map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="p-0 text-jara-teal flex items-center gap-1"
                    onClick={() => handleReadMore(trend.id)}
                  >
                    Read more about this trend
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="text-center mt-6">
        <Button variant="outline" onClick={handleExploreMoreTrends}>
          Explore More Trends
        </Button>
      </div>
    </div>
  );
};

export default TrendingAlerts2;
