import { formatDistanceToNow } from "date-fns";
import { Heart, MessageSquare, TrendingUp, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Discussion, useDiscussions } from "@/hooks/useDiscussions";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface DiscussionCardProps {
  discussion: Discussion;
}

export function DiscussionCard({ discussion }: DiscussionCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toggleDiscussionLike, deleteDiscussion } = useDiscussions();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate("/auth");
      return;
    }
    toggleDiscussionLike.mutate({
      discussionId: discussion.id,
      hasLiked: discussion.has_liked || false,
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this discussion?")) {
      deleteDiscussion.mutate(discussion.id);
    }
  };

  const handleClick = () => {
    navigate(`/community/${discussion.id}`);
  };

  const initials = discussion.author_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?";

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer group"
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="secondary">{discussion.category}</Badge>
              {discussion.is_trending && (
                <Badge className="bg-primary">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {discussion.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Avatar className="h-6 w-6">
                <AvatarImage src={discussion.author_avatar || undefined} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span>{discussion.author_name}</span>
              <span>•</span>
              <span>
                {formatDistanceToNow(new Date(discussion.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
          {user?.id === discussion.user_id && (
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2 mb-4">
          {discussion.content}
        </p>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-1 px-2",
              discussion.has_liked && "text-primary"
            )}
            onClick={handleLike}
          >
            <Heart
              className={cn("h-4 w-4", discussion.has_liked && "fill-primary")}
            />
            <span>{discussion.likes_count}</span>
          </Button>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{discussion.replies_count} replies</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
