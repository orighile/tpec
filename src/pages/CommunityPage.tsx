import { Users, MessageSquare, Heart, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CommunityPage = () => {
  const discussions = [
    {
      id: 1,
      title: "How much should I budget for a Lagos wedding?",
      author: "Chioma A.",
      replies: 24,
      likes: 45,
      category: "Budget",
      trending: true,
    },
    {
      id: 2,
      title: "Best caterers in Abuja for traditional events",
      author: "Emeka O.",
      replies: 18,
      likes: 32,
      category: "Vendors",
      trending: false,
    },
    {
      id: 3,
      title: "Planning a destination wedding in Calabar - tips?",
      author: "Ada M.",
      replies: 12,
      likes: 28,
      category: "Planning",
      trending: true,
    },
    {
      id: 4,
      title: "How to handle traditional and white wedding on same day",
      author: "Tunde S.",
      replies: 36,
      likes: 67,
      category: "Culture",
      trending: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Community
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Connect with fellow event planners, share experiences, and get advice from the TPEC community
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => alert("Discussion forum coming soon! This feature is under development.")}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Start a Discussion
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">2,543</div>
                <div className="text-sm text-muted-foreground">Members</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <MessageSquare className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">1,234</div>
                <div className="text-sm text-muted-foreground">Discussions</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">5,678</div>
                <div className="text-sm text-muted-foreground">Helpful Replies</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">342</div>
                <div className="text-sm text-muted-foreground">Active Today</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Discussion List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Recent Discussions</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Trending</Button>
              <Button variant="outline" size="sm">Recent</Button>
              <Button variant="outline" size="sm">Popular</Button>
            </div>
          </div>

          {discussions.map((discussion) => (
            <Card key={discussion.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{discussion.category}</Badge>
                      {discussion.trending && (
                        <Badge className="bg-primary">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl mb-2 hover:text-primary transition-colors">
                      {discussion.title}
                    </CardTitle>
                    <CardDescription>
                      Started by {discussion.author}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{discussion.replies} replies</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{discussion.likes} likes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Discussions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
