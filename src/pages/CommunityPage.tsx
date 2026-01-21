import { useState } from "react";
import { Users, MessageSquare, Heart, TrendingUp, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDiscussions, DISCUSSION_CATEGORIES } from "@/hooks/useDiscussions";
import { DiscussionCard } from "@/components/community/DiscussionCard";
import { CreateDiscussionDialog } from "@/components/community/CreateDiscussionDialog";

type SortOption = "recent" | "trending" | "popular";

const CommunityPage = () => {
  const { discussions, isLoading } = useDiscussions();
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  // Sort and filter discussions
  const filteredDiscussions = discussions
    .filter((d) => !filterCategory || d.category === filterCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case "trending":
          return (b.is_trending ? 1 : 0) - (a.is_trending ? 1 : 0) || 
            b.likes_count - a.likes_count;
        case "popular":
          return b.likes_count - a.likes_count;
        case "recent":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  // Calculate stats
  const totalMembers = 2543; // Placeholder - could be fetched from profiles count
  const totalDiscussions = discussions.length;
  const totalReplies = discussions.reduce((sum, d) => sum + d.replies_count, 0);
  const activeToday = discussions.filter(
    (d) => new Date(d.created_at).toDateString() === new Date().toDateString()
  ).length;

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
          <CreateDiscussionDialog>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <MessageSquare className="mr-2 h-4 w-4" />
              Start a Discussion
            </Button>
          </CreateDiscussionDialog>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{totalMembers.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Members</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <MessageSquare className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{totalDiscussions.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Discussions</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{totalReplies.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Replies</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{activeToday}</div>
                <div className="text-sm text-muted-foreground">Active Today</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={filterCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterCategory(null)}
            >
              All
            </Button>
            {DISCUSSION_CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={filterCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortBy === "trending" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("trending")}
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Trending
            </Button>
            <Button
              variant={sortBy === "recent" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("recent")}
            >
              Recent
            </Button>
            <Button
              variant={sortBy === "popular" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("popular")}
            >
              Popular
            </Button>
          </div>
        </div>

        {/* Discussion List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredDiscussions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No discussions yet</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to start a conversation in this community!
                </p>
                <CreateDiscussionDialog>
                  <Button>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Start a Discussion
                  </Button>
                </CreateDiscussionDialog>
              </CardContent>
            </Card>
          ) : (
            filteredDiscussions.map((discussion) => (
              <DiscussionCard key={discussion.id} discussion={discussion} />
            ))
          )}
        </div>

        {/* Load More - could be implemented with pagination */}
        {filteredDiscussions.length > 0 && filteredDiscussions.length >= 10 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Discussions
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
