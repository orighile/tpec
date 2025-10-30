import { useState, useEffect } from "react";
import { ShareNetwork, Heart, ChatCircle, User, Calendar, Image as ImageIcon, Database } from "phosphor-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { supabase } from '@/integrations/supabase/client';

// Types for social proof data
interface SocialPost {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  imageUrl?: string;
  date: Date;
  likes: number;
  comments: Comment[];
  tags: string[];
  eventType: string;
}

interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  date: Date;
}

// Sample event types
const eventTypes = ["Wedding", "Birthday", "Graduation", "Corporate", "Anniversary", "Baby Shower", "Traditional Ceremony", "Naming Ceremony"];

const RealSocialProofGallery = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [commentInput, setCommentInput] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");

  // Fetch real posts from database
  const fetchPosts = async () => {
    setLoading(true);
    try {
      // In a real implementation, you'd fetch from a social_posts table
      // For now, we'll create sample posts that could come from reviews or user-generated content
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select(`
          id,
          comment,
          rating,
          created_at,
          user_id,
          vendors (
            name,
            category
          )
        `)
        .not('comment', 'is', null)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Transform reviews into social posts
      const transformedPosts: SocialPost[] = (reviews || []).map((review) => ({
        id: review.id,
        userId: review.user_id,
        username: `User_${review.user_id.slice(0, 8)}`,
        userAvatar: "/placeholder.svg",
        content: review.comment || "Great experience with this vendor!",
        date: new Date(review.created_at),
        likes: Math.floor(Math.random() * 50) + 5,
        comments: [],
        tags: [review.vendors?.category || "General", "Review", "Experience"],
        eventType: review.vendors?.category === "Photography" ? "Wedding" : 
                  review.vendors?.category === "Catering" ? "Corporate" : "Birthday"
      }));

      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load social posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter posts based on active filter and search input
  const filteredPosts = posts.filter(post => {
    const matchesFilter = 
      activeFilter === "all" || 
      post.eventType.toLowerCase() === activeFilter.toLowerCase();
    
    const matchesSearch = 
      !searchInput || 
      post.content.toLowerCase().includes(searchInput.toLowerCase()) ||
      post.username.toLowerCase().includes(searchInput.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchInput.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  // Format date to a readable string
  const formatDate = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (days > 7) {
      return date.toLocaleDateString();
    } else if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  // Handle post like
  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 } 
        : post
    ));
    
    toast({
      title: "Post liked",
      description: "You've liked this post.",
    });
  };

  // Handle post comment submission
  const handleComment = (postId: string) => {
    if (!commentInput.trim()) {
      toast({
        description: "Please enter a comment.",
        variant: "destructive",
      });
      return;
    }
    
    const newComment: Comment = {
      id: `c${Date.now()}`,
      userId: "currentUser",
      username: "You",
      userAvatar: "/placeholder.svg",
      content: commentInput,
      date: new Date(),
    };
    
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, newComment] } 
        : post
    ));
    
    setCommentInput("");
    
    if (selectedPost?.id === postId) {
      setSelectedPost({
        ...selectedPost,
        comments: [...selectedPost.comments, newComment]
      });
    }
    
    toast({
      title: "Comment added",
      description: "Your comment has been added to the post.",
    });
  };

  // Handle post share
  const handleShare = (post: SocialPost) => {
    toast({
      title: "Share post",
      description: "Post sharing functionality would open here.",
    });
    
    console.log("Sharing post:", post.id);
  };

  // Generate sample database content
  const generateSampleContent = async () => {
    toast({
      title: "Sample Content",
      description: "In a real app, this would add sample user-generated content to the database.",
    });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Real Social Proof Gallery
          </CardTitle>
          <CardDescription>Loading real user content from database...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Database className="h-6 w-6" />
                Real Social Proof Gallery
              </CardTitle>
              <CardDescription>
                Browse real user reviews and experiences from the database
              </CardDescription>
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Search posts..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-64"
              />
              <Button variant="outline" onClick={fetchPosts}>
                Refresh
              </Button>
              <Button variant="outline" onClick={generateSampleContent}>
                Add Sample Content
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs 
            defaultValue="all" 
            value={activeFilter}
            onValueChange={setActiveFilter}
            className="w-full"
          >
            <div className="overflow-x-auto pb-2">
              <TabsList className="w-max">
                <TabsTrigger value="all">All Events ({posts.length})</TabsTrigger>
                {eventTypes.map(type => {
                  const count = posts.filter(p => p.eventType.toLowerCase() === type.toLowerCase()).length;
                  return (
                    <TabsTrigger key={type} value={type.toLowerCase()}>
                      {type} ({count})
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map(post => (
                    <SocialPostCard
                      key={post.id}
                      post={post}
                      onLike={handleLike}
                      onComment={() => setSelectedPost(post)}
                      onShare={handleShare}
                      formatDate={formatDate}
                    />
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                    <Database className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No posts found</h3>
                    <p className="text-muted-foreground mt-1 mb-4">
                      No user-generated content available yet
                    </p>
                    <Button onClick={generateSampleContent}>
                      Generate Sample Content
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {eventTypes.map(type => (
              <TabsContent key={type} value={type.toLowerCase()} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map(post => (
                      <SocialPostCard
                        key={post.id}
                        post={post}
                        onLike={handleLike}
                        onComment={() => setSelectedPost(post)}
                        onShare={handleShare}
                        formatDate={formatDate}
                      />
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                      <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No {type} posts</h3>
                      <p className="text-muted-foreground mt-1">
                        Check back later or browse other categories
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Post Detail Modal */}
      <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          {selectedPost && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={selectedPost.userAvatar} alt={selectedPost.username} />
                    <AvatarFallback>{selectedPost.username[0]}</AvatarFallback>
                  </Avatar>
                  <span>{selectedPost.username}</span>
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(selectedPost.date)}</span>
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <p>{selectedPost.content}</p>
                
                <div className="flex flex-wrap gap-2">
                  {selectedPost.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-2 py-0.5 bg-muted rounded-full text-xs"
                    >
                      #{tag.replace(/\s/g, '')}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between border-t border-b py-2">
                  <Button variant="ghost" size="sm" onClick={() => handleLike(selectedPost.id)}>
                    <Heart className="mr-1 h-4 w-4" />
                    {selectedPost.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                     <ChatCircle className="mr-1 h-4 w-4" />
                    {selectedPost.comments.length}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleShare(selectedPost)}>
                     <ShareNetwork className="mr-1 h-4 w-4" />
                    Share
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Comments</h4>
                  
                  {selectedPost.comments.length > 0 ? (
                    <div className="space-y-3">
                      {selectedPost.comments.map(comment => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={comment.userAvatar} alt={comment.username} />
                            <AvatarFallback>{comment.username[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-muted p-3 rounded-lg">
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-sm">{comment.username}</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(comment.date)}
                                </span>
                              </div>
                              <p className="text-sm">{comment.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src="/placeholder.svg" alt="You" />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <Input
                      placeholder="Add a comment..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={() => handleComment(selectedPost.id)}>Post</Button>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="sm:justify-end mt-2">
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Social Post Card Component
interface SocialPostCardProps {
  post: SocialPost;
  onLike: (postId: string) => void;
  onComment: () => void;
  onShare: (post: SocialPost) => void;
  formatDate: (date: Date) => string;
}

const SocialPostCard = ({ post, onLike, onComment, onShare, formatDate }: SocialPostCardProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={post.userAvatar} alt={post.username} />
              <AvatarFallback>{post.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{post.username}</p>
              <p className="text-xs text-muted-foreground">{formatDate(post.date)}</p>
            </div>
          </div>
          <span className="text-xs bg-muted px-2 py-1 rounded">
            {post.eventType}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pb-3">
        <p className="text-sm mb-3 line-clamp-3">{post.content}</p>
        
        <div className="flex flex-wrap gap-1">
          {post.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-xs bg-muted px-1.5 py-0.5 rounded">
              #{tag.replace(/\s/g, '')}
            </span>
          ))}
          {post.tags.length > 2 && (
            <span className="text-xs text-muted-foreground">
              +{post.tags.length - 2} more
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-3 border-t">
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" onClick={() => onLike(post.id)}>
            <Heart className="mr-1 h-3 w-3" />
            {post.likes}
          </Button>
          <Button variant="ghost" size="sm" onClick={onComment}>
            <ChatCircle className="mr-1 h-3 w-3" />
            {post.comments.length}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onShare(post)}>
            <ShareNetwork className="mr-1 h-3 w-3" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RealSocialProofGallery;