import React, { useState } from "react";
import { Users, ThumbsUp, MessageSquare, Heart, Share2, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SocialProofPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    location: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  timestamp: string;
  isVerified: boolean;
}

const samplePosts: SocialProofPost[] = [
  {
    id: "1",
    author: {
      name: "Chioma Nwosu",
      avatar: "https://i.pravatar.cc/150?u=chioma",
      location: "Lagos"
    },
    content: "Just had the most amazing traditional wedding at Imperial Hall! The venue was perfect and everyone loved the decor. Special thanks to @LagosCaterers for the amazing food!",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    likes: 152,
    comments: 27,
    shares: 14,
    tags: ["TraditionalWedding", "LagosEvents", "WeddingDone"],
    timestamp: "3 hours ago",
    isVerified: true
  },
  {
    id: "2",
    author: {
      name: "Emeka Okafor",
      avatar: "https://i.pravatar.cc/150?u=emeka",
      location: "Abuja"
    },
    content: "My daughter's 1st birthday celebration was a huge success! The event planning app helped me keep track of everything. Venue: Garden Park Resort, Abuja.",
    image: "https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    likes: 98,
    comments: 15,
    shares: 5,
    tags: ["BirthdayParty", "EventSuccess", "AbujaEvents"],
    timestamp: "1 day ago",
    isVerified: false
  },
  {
    id: "3",
    author: {
      name: "Blessing Adeyemi",
      avatar: "https://i.pravatar.cc/150?u=blessing",
      location: "Port Harcourt"
    },
    content: "Corporate end-of-year party planning made easy! Thanks to this app for helping me organize a memorable event for our company. The budget tracker was particularly helpful.",
    likes: 207,
    comments: 32,
    shares: 21,
    tags: ["CorporateEvent", "EndOfYear", "EventPlanning"],
    timestamp: "2 days ago",
    isVerified: true
  }
];

const SocialProof2: React.FC = () => {
  const [posts, setPosts] = useState<SocialProofPost[]>(samplePosts);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const handleLike = (postId: string) => {
    if (likedPosts.has(postId)) {
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
      setPosts(prev => 
        prev.map(post => 
          post.id === postId ? { ...post, likes: post.likes - 1 } : post
        )
      );
      toast.info("Post unliked");
    } else {
      setLikedPosts(prev => new Set(prev).add(postId));
      setPosts(prev => 
        prev.map(post => 
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
      toast.success("Post liked! Thanks for your feedback.");
    }
  };

  const handleComment = (postId: string) => {
    toast.info("Comments feature coming soon!");
  };

  const handleShare = (postId: string) => {
    toast.success("Link copied to clipboard!");
  };

  const handleBrowseStories = () => {
    toast.info("Loading more stories...");
  };

  const handleShareYourStory = () => {
    toast.info("Story sharing feature coming soon!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Event Success Stories</h2>
          <p className="text-gray-600">See how others planned successful events in Nigeria</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2" onClick={handleShareYourStory}>
          <Users className="h-4 w-4" />
          <span>Share Your Story</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <Card key={post.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <img src={post.author.avatar} alt={post.author.name} />
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <CardTitle className="text-lg">{post.author.name}</CardTitle>
                    {post.isVerified && (
                      <Trophy className="h-4 w-4 text-jara-teal ml-1" />
                    )}
                  </div>
                  <CardDescription>{post.author.location} • {post.timestamp}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="mb-4">{post.content}</p>
              {post.image && (
                <img 
                  src={post.image} 
                  alt="Event" 
                  className="w-full h-48 object-cover rounded-md mb-3" 
                />
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {post.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="bg-jara-teal/10 text-jara-teal text-xs px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between border-t">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`flex items-center gap-1 ${likedPosts.has(post.id) ? 'text-pink-500' : ''}`}
                onClick={() => handleLike(post.id)}
              >
                <Heart className={`h-4 w-4 ${likedPosts.has(post.id) ? 'fill-pink-500' : ''}`} />
                <span>{post.likes}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => handleComment(post.id)}
              >
                <MessageSquare className="h-4 w-4" />
                <span>{post.comments}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => handleShare(post.id)}
              >
                <Share2 className="h-4 w-4" />
                <span>{post.shares}</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <Button variant="outline" className="mt-4" onClick={handleBrowseStories}>
          Load More Stories
        </Button>
      </div>
    </div>
  );
};

export default SocialProof2;
