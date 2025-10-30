
import { useState } from "react";
import { ShareNetwork, Heart, ChatCircle, User, Calendar, Image as ImageIcon } from "phosphor-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
const eventTypes = [
  "Wedding",
  "Birthday",
  "Graduation",
  "Corporate",
  "Anniversary",
  "Baby Shower",
  "Traditional Ceremony",
  "Naming Ceremony"
];

// Sample data
const samplePosts: SocialPost[] = [
  {
    id: "1",
    userId: "user1",
    username: "Chinwe_Elegance",
    userAvatar: "/placeholder.svg",
    content: "Our traditional wedding was absolutely beautiful! Thanks to all our vendors who made it perfect. #TraditionalWedding #NigerianWedding",
    imageUrl: "/placeholder.svg",
    date: new Date("2023-10-15"),
    likes: 124,
    comments: [
      {
        id: "c1",
        userId: "user2",
        username: "AishaEvents",
        userAvatar: "/placeholder.svg",
        content: "The decor was gorgeous! Who was your vendor?",
        date: new Date("2023-10-15T15:30:00")
      },
      {
        id: "c2",
        userId: "user3",
        username: "DeborahFashion",
        userAvatar: "/placeholder.svg",
        content: "Your outfits were stunning! 😍",
        date: new Date("2023-10-16T09:15:00")
      }
    ],
    tags: ["Traditional Wedding", "Nigerian Culture", "Igbo Wedding"],
    eventType: "Wedding"
  },
  {
    id: "2",
    userId: "user4",
    username: "OlaTechCEO",
    userAvatar: "/placeholder.svg",
    content: "Our company's end-of-year party was a huge success! The venue recommendation from this platform was spot on. #CorporateEvent",
    imageUrl: "/placeholder.svg",
    date: new Date("2023-12-20"),
    likes: 87,
    comments: [
      {
        id: "c3",
        userId: "user5",
        username: "LagosVenues",
        userAvatar: "/placeholder.svg",
        content: "Thank you for choosing our venue! Your team was amazing to work with.",
        date: new Date("2023-12-21T10:20:00")
      }
    ],
    tags: ["Corporate Event", "End of Year", "Tech Company"],
    eventType: "Corporate"
  },
  {
    id: "3",
    userId: "user6",
    username: "TosinTurns30",
    userAvatar: "/placeholder.svg",
    content: "My 30th birthday was everything I wanted and more! The party crew builder on this app helped me organize everyone's responsibilities perfectly.",
    imageUrl: "/placeholder.svg",
    date: new Date("2023-11-05"),
    likes: 156,
    comments: [
      {
        id: "c4",
        userId: "user7",
        username: "PartyQueenLagos",
        userAvatar: "/placeholder.svg",
        content: "It was so much fun! The DJ was amazing too.",
        date: new Date("2023-11-06T14:10:00")
      },
      {
        id: "c5",
        userId: "user8",
        username: "CakeMasterNG",
        userAvatar: "/placeholder.svg",
        content: "Your cake design was one of my favorites to make this year!",
        date: new Date("2023-11-07T08:45:00")
      }
    ],
    tags: ["Birthday Party", "30th Birthday", "Lagos Party"],
    eventType: "Birthday"
  },
];

const SocialProofGallery = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<SocialPost[]>(samplePosts);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [commentInput, setCommentInput] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");

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
    
    // If we're in the detail view, update the selected post
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
    // In a real app, this would open a share dialog
    toast({
      title: "Share post",
      description: "Post sharing functionality would open here.",
    });
    
    console.log("Sharing post:", post.id);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Event Gallery</CardTitle>
              <CardDescription>
                Browse real events and get inspiration for your own
              </CardDescription>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Search posts..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
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
                <TabsTrigger value="all">All Events</TabsTrigger>
                {eventTypes.map(type => (
                  <TabsTrigger key={type} value={type.toLowerCase()}>
                    {type}
                  </TabsTrigger>
                ))}
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
                    <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No matching posts</h3>
                    <p className="text-muted-foreground mt-1">
                      Try adjusting your search or filter to find posts
                    </p>
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
              
              {selectedPost.imageUrl && (
                <div className="my-2">
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={selectedPost.imageUrl}
                      alt="Event"
                      className="rounded-md object-cover w-full h-full"
                    />
                  </AspectRatio>
                </div>
              )}
              
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
              <CardTitle className="text-base">{post.username}</CardTitle>
              <CardDescription className="text-xs">
                {formatDate(post.date)}
              </CardDescription>
            </div>
          </div>
          <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
            {post.eventType}
          </span>
        </div>
      </CardHeader>
      
      {post.imageUrl && (
        <div className="px-6">
          <AspectRatio ratio={16 / 9}>
            <img
              src={post.imageUrl}
              alt="Event"
              className="rounded-md object-cover w-full h-full"
            />
          </AspectRatio>
        </div>
      )}
      
      <CardContent className="py-3 flex-1">
        <p className="text-sm line-clamp-3">{post.content}</p>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {post.tags.slice(0, 3).map(tag => (
            <span 
              key={tag} 
              className="px-2 py-0.5 bg-muted rounded-full text-xs"
            >
              #{tag.replace(/\s/g, '')}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="px-2 py-0.5 bg-muted rounded-full text-xs">
              +{post.tags.length - 3}
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 border-t">
        <div className="flex justify-between items-center w-full">
          <Button variant="ghost" size="sm" onClick={() => onLike(post.id)}>
            <Heart className="mr-1 h-4 w-4" />
            {post.likes}
          </Button>
          <Button variant="ghost" size="sm" onClick={onComment}>
            <ChatCircle className="mr-1 h-4 w-4" />
            {post.comments.length}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onShare(post)}>
            <ShareNetwork className="mr-1 h-4 w-4" />
            Share
          </Button>
          
          <DialogTrigger asChild>
            <Button variant="link" size="sm" onClick={onComment}>
              View Details
            </Button>
          </DialogTrigger>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SocialProofGallery;
