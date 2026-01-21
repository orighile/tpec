import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Heart, MessageSquare, Trash2, Send } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useDiscussions } from "@/hooks/useDiscussions";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout";

const DiscussionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [replyContent, setReplyContent] = useState("");

  const {
    useDiscussionDetail,
    useDiscussionReplies,
    createReply,
    toggleDiscussionLike,
    toggleReplyLike,
    deleteDiscussion,
    deleteReply,
  } = useDiscussions();

  const { data: discussion, isLoading: loadingDiscussion } = useDiscussionDetail(id || "");
  const { data: replies = [], isLoading: loadingReplies } = useDiscussionReplies(id || "");

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!replyContent.trim() || !id) return;

    await createReply.mutateAsync({ discussionId: id, content: replyContent });
    setReplyContent("");
  };

  const handleLikeDiscussion = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (discussion) {
      toggleDiscussionLike.mutate({
        discussionId: discussion.id,
        hasLiked: discussion.has_liked || false,
      });
    }
  };

  const handleLikeReply = (replyId: string, hasLiked: boolean, currentLikes: number) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (id) {
      toggleReplyLike.mutate({ replyId, discussionId: id, hasLiked, currentLikes });
    }
  };

  const handleDeleteDiscussion = () => {
    if (confirm("Are you sure you want to delete this discussion?")) {
      deleteDiscussion.mutate(discussion!.id, {
        onSuccess: () => navigate("/community"),
      });
    }
  };

  const handleDeleteReply = (replyId: string) => {
    if (confirm("Are you sure you want to delete this reply?")) {
      deleteReply.mutate({ replyId, discussionId: id! });
    }
  };

  if (loadingDiscussion) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-6" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!discussion) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
          <h1 className="text-2xl font-bold mb-4">Discussion not found</h1>
          <Button onClick={() => navigate("/community")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Community
          </Button>
        </div>
      </Layout>
    );
  }

  const authorInitials = discussion.author_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/community")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Community
        </Button>

        {/* Main discussion */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Badge variant="secondary" className="mb-3">
                  {discussion.category}
                </Badge>
                <h1 className="text-2xl font-bold mb-3">{discussion.title}</h1>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={discussion.author_avatar || undefined} />
                    <AvatarFallback>{authorInitials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-medium text-foreground">
                      {discussion.author_name}
                    </span>
                    <span className="mx-2">•</span>
                    <span>
                      {formatDistanceToNow(new Date(discussion.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
              {user?.id === discussion.user_id && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={handleDeleteDiscussion}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground whitespace-pre-wrap mb-6">
              {discussion.content}
            </p>
            <div className="flex items-center gap-4 pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                className={cn("gap-2", discussion.has_liked && "text-primary")}
                onClick={handleLikeDiscussion}
              >
                <Heart
                  className={cn(
                    "h-4 w-4",
                    discussion.has_liked && "fill-primary"
                  )}
                />
                <span>{discussion.likes_count} likes</span>
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>{replies.length} replies</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reply form */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmitReply}>
              <Textarea
                placeholder={
                  user
                    ? "Write a reply..."
                    : "Sign in to reply to this discussion"
                }
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={3}
                disabled={!user}
                className="mb-3"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!user || !replyContent.trim() || createReply.isPending}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {createReply.isPending ? "Posting..." : "Post Reply"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Replies */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Replies ({replies.length})
          </h2>

          {loadingReplies ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-4">
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : replies.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No replies yet. Be the first to reply!
              </CardContent>
            </Card>
          ) : (
            replies.map((reply) => {
              const replyInitials = reply.author_name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "?";

              return (
                <Card key={reply.id} className="group">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={reply.author_avatar || undefined} />
                        <AvatarFallback className="text-xs">
                          {replyInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {reply.author_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(reply.created_at), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-wrap">
                          {reply.content}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "gap-1 px-2 h-7 text-xs",
                              reply.has_liked && "text-primary"
                            )}
                            onClick={() =>
                              handleLikeReply(
                                reply.id,
                                reply.has_liked || false,
                                reply.likes_count
                              )
                            }
                          >
                            <Heart
                              className={cn(
                                "h-3 w-3",
                                reply.has_liked && "fill-primary"
                              )}
                            />
                            <span>{reply.likes_count}</span>
                          </Button>
                          {user?.id === reply.user_id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1 px-2 h-7 text-xs text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleDeleteReply(reply.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DiscussionDetailPage;
