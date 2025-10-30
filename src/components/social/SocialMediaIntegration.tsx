import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Share2, Facebook, Twitter, Instagram, Linkedin, Youtube, 
  Calendar, Camera, Users, Heart, MessageCircle, Repeat2,
  Settings, Link, Download, Upload, TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SocialAccount {
  id: string;
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube';
  username: string;
  followers: number;
  connected: boolean;
  lastSync: Date;
  profileUrl: string;
  avatar: string;
}

interface SocialPost {
  id: string;
  platform: string;
  content: string;
  image?: string;
  scheduledDate?: Date;
  postedDate?: Date;
  status: 'draft' | 'scheduled' | 'posted' | 'failed';
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
  };
  eventId?: string;
}

interface SocialTemplate {
  id: string;
  name: string;
  content: string;
  platforms: string[];
  category: 'event_promotion' | 'vendor_spotlight' | 'success_story' | 'general';
}

const SocialMediaIntegration: React.FC = () => {
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([
    {
      id: '1',
      platform: 'facebook',
      username: '@TPECEvents',
      followers: 12500,
      connected: true,
      lastSync: new Date(Date.now() - 30 * 60 * 1000),
      profileUrl: 'https://facebook.com/TPECEvents',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: '2',
      platform: 'instagram',
      username: '@tpec_events',
      followers: 8300,
      connected: true,
      lastSync: new Date(Date.now() - 60 * 60 * 1000),
      profileUrl: 'https://instagram.com/tpec_events',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: '3',
      platform: 'twitter',
      username: '@TPECEvents',
      followers: 5200,
      connected: false,
      lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000),
      profileUrl: 'https://twitter.com/TPECEvents',
      avatar: '/api/placeholder/40/40'
    }
  ]);

  const [posts, setPosts] = useState<SocialPost[]>([
    {
      id: '1',
      platform: 'facebook',
      content: '🎉 Planning your dream wedding? Check out our amazing photography vendors! From candid shots to stunning portraits, find the perfect photographer for your special day. #WeddingPhotography #TPECEvents',
      image: '/api/placeholder/400/300',
      postedDate: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: 'posted',
      engagement: {
        likes: 156,
        comments: 23,
        shares: 18,
        reach: 3420
      }
    },
    {
      id: '2',
      platform: 'instagram',
      content: 'Behind the scenes of an incredible corporate event! 📸✨ Our vendors made it absolutely magical. #CorporateEvents #EventPlanning #BehindTheScenes',
      image: '/api/placeholder/400/300',
      scheduledDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
      status: 'scheduled',
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        reach: 0
      }
    }
  ]);

  const [templates] = useState<SocialTemplate[]>([
    {
      id: '1',
      name: 'Event Promotion',
      content: '🎉 Exciting event coming up! [EVENT_NAME] on [DATE] at [VENUE]. Join us for [DESCRIPTION]. Book your tickets now! #Events #[CATEGORY]',
      platforms: ['facebook', 'twitter', 'instagram'],
      category: 'event_promotion'
    },
    {
      id: '2',
      name: 'Vendor Spotlight',
      content: '✨ Vendor Spotlight: [VENDOR_NAME] specializes in [SERVICE]. With [EXPERIENCE] years of experience, they bring [UNIQUE_VALUE] to every event. #VendorSpotlight #[CATEGORY]',
      platforms: ['facebook', 'instagram', 'linkedin'],
      category: 'vendor_spotlight'
    }
  ]);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [newPost, setNewPost] = useState({
    content: '',
    platforms: [] as string[],
    scheduleDate: '',
    scheduleTime: '',
    image: null as File | null
  });
  const [autoPostSettings, setAutoPostSettings] = useState({
    newEvents: true,
    vendorUpdates: false,
    reviews: true,
    milestones: true
  });

  const { toast } = useToast();

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook className="h-5 w-5" />;
      case 'twitter': return <Twitter className="h-5 w-5" />;
      case 'instagram': return <Instagram className="h-5 w-5" />;
      case 'linkedin': return <Linkedin className="h-5 w-5" />;
      case 'youtube': return <Youtube className="h-5 w-5" />;
      default: return <Share2 className="h-5 w-5" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'facebook': return 'text-blue-600';
      case 'twitter': return 'text-sky-600';
      case 'instagram': return 'text-pink-600';
      case 'linkedin': return 'text-blue-800';
      case 'youtube': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleConnectAccount = (accountId: string) => {
    setSocialAccounts(accounts => accounts.map(account => 
      account.id === accountId 
        ? { ...account, connected: true, lastSync: new Date() }
        : account
    ));
    
    toast({
      title: "Account Connected",
      description: "Your social media account has been connected successfully",
    });
  };

  const handleCreatePost = () => {
    if (!newPost.content || newPost.platforms.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please add content and select at least one platform",
        variant: "destructive"
      });
      return;
    }

    newPost.platforms.forEach(platform => {
      const post: SocialPost = {
        id: Date.now().toString() + platform,
        platform,
        content: newPost.content,
        scheduledDate: newPost.scheduleDate ? new Date(newPost.scheduleDate + 'T' + newPost.scheduleTime) : undefined,
        status: newPost.scheduleDate ? 'scheduled' : 'draft',
        engagement: { likes: 0, comments: 0, shares: 0, reach: 0 }
      };
      
      setPosts(prev => [post, ...prev]);
    });

    setNewPost({ content: '', platforms: [], scheduleDate: '', scheduleTime: '', image: null });
    
    toast({
      title: "Post Created",
      description: newPost.scheduleDate ? "Post scheduled successfully" : "Post saved as draft",
    });
  };

  const handlePlatformToggle = (platform: string) => {
    setNewPost(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const getTotalEngagement = () => {
    return posts.reduce((total, post) => ({
      likes: total.likes + post.engagement.likes,
      comments: total.comments + post.engagement.comments,
      shares: total.shares + post.engagement.shares,
      reach: total.reach + post.engagement.reach
    }), { likes: 0, comments: 0, shares: 0, reach: 0 });
  };

  const totalEngagement = getTotalEngagement();

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Followers</p>
                <p className="text-2xl font-bold">
                  {socialAccounts.reduce((sum, acc) => sum + acc.followers, 0).toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Likes</p>
                <p className="text-2xl font-bold">{totalEngagement.likes.toLocaleString()}</p>
              </div>
              <Heart className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Comments</p>
                <p className="text-2xl font-bold">{totalEngagement.comments.toLocaleString()}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reach</p>
                <p className="text-2xl font-bold">{totalEngagement.reach.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </Button>
            <Button
              variant={activeTab === 'accounts' ? 'default' : 'outline'}
              onClick={() => setActiveTab('accounts')}
            >
              Accounts
            </Button>
            <Button
              variant={activeTab === 'create' ? 'default' : 'outline'}
              onClick={() => setActiveTab('create')}
            >
              Create Post
            </Button>
            <Button
              variant={activeTab === 'templates' ? 'default' : 'outline'}
              onClick={() => setActiveTab('templates')}
            >
              Templates
            </Button>
            <Button
              variant={activeTab === 'settings' ? 'default' : 'outline'}
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Posts</CardTitle>
              <CardDescription>Your recent social media activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="flex gap-4 p-4 border rounded-lg">
                    <div className={`p-2 rounded-full ${getPlatformColor(post.platform)}`}>
                      {getPlatformIcon(post.platform)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusColor(post.status)}>
                          {post.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {post.postedDate ? post.postedDate.toLocaleString() : 
                           post.scheduledDate ? `Scheduled for ${post.scheduledDate.toLocaleString()}` : 
                           'Draft'}
                        </span>
                      </div>
                      <p className="text-sm mb-3">{post.content}</p>
                      {post.status === 'posted' && (
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {post.engagement.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {post.engagement.comments}
                          </span>
                          <span className="flex items-center gap-1">
                            <Repeat2 className="h-3 w-3" />
                            {post.engagement.shares}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {post.engagement.reach} reach
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Accounts Tab */}
      {activeTab === 'accounts' && (
        <div className="space-y-4">
          {socialAccounts.map((account) => (
            <Card key={account.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${getPlatformColor(account.platform)}`}>
                      {getPlatformIcon(account.platform)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{account.username}</h3>
                      <p className="text-sm text-muted-foreground">
                        {account.followers.toLocaleString()} followers
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last sync: {account.lastSync.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {account.connected ? (
                      <Badge className="bg-green-100 text-green-800">Connected</Badge>
                    ) : (
                      <Button onClick={() => handleConnectAccount(account.id)}>
                        Connect
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Post Tab */}
      {activeTab === 'create' && (
        <Card>
          <CardHeader>
            <CardTitle>Create Social Media Post</CardTitle>
            <CardDescription>Share content across your connected platforms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Post Content</Label>
              <Textarea
                placeholder="What's happening? Share your event updates..."
                rows={4}
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              />
              <div className="text-xs text-muted-foreground">
                {newPost.content.length}/280 characters
              </div>
            </div>

            <div className="space-y-2">
              <Label>Select Platforms</Label>
              <div className="flex flex-wrap gap-2">
                {socialAccounts.filter(acc => acc.connected).map((account) => (
                  <div
                    key={account.id}
                    className={`
                      flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors
                      ${newPost.platforms.includes(account.platform)
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/50'
                      }
                    `}
                    onClick={() => handlePlatformToggle(account.platform)}
                  >
                    <div className={getPlatformColor(account.platform)}>
                      {getPlatformIcon(account.platform)}
                    </div>
                    <span className="text-sm">{account.platform}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Schedule Date (Optional)</Label>
                <Input
                  type="date"
                  value={newPost.scheduleDate}
                  onChange={(e) => setNewPost({...newPost, scheduleDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Schedule Time</Label>
                <Input
                  type="time"
                  value={newPost.scheduleTime}
                  onChange={(e) => setNewPost({...newPost, scheduleTime: e.target.value})}
                  disabled={!newPost.scheduleDate}
                />
              </div>
            </div>

            <Button onClick={handleCreatePost} className="w-full">
              {newPost.scheduleDate ? (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Post
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  Post Now
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{template.content}</p>
                    <div className="flex gap-2">
                      <Badge variant="outline">{template.category}</Badge>
                      <div className="flex gap-1">
                        {template.platforms.map(platform => (
                          <div key={platform} className={`${getPlatformColor(platform)} text-xs`}>
                            {getPlatformIcon(platform)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Auto-Post Settings</CardTitle>
              <CardDescription>Automatically share content when certain events happen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>New Event Created</Label>
                  <p className="text-sm text-muted-foreground">Post when a new event is published</p>
                </div>
                <Switch
                  checked={autoPostSettings.newEvents}
                  onCheckedChange={(checked) => setAutoPostSettings({...autoPostSettings, newEvents: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Vendor Updates</Label>
                  <p className="text-sm text-muted-foreground">Share vendor highlights and new additions</p>
                </div>
                <Switch
                  checked={autoPostSettings.vendorUpdates}
                  onCheckedChange={(checked) => setAutoPostSettings({...autoPostSettings, vendorUpdates: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Customer Reviews</Label>
                  <p className="text-sm text-muted-foreground">Share positive customer reviews</p>
                </div>
                <Switch
                  checked={autoPostSettings.reviews}
                  onCheckedChange={(checked) => setAutoPostSettings({...autoPostSettings, reviews: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Milestones</Label>
                  <p className="text-sm text-muted-foreground">Celebrate follower milestones and achievements</p>
                </div>
                <Switch
                  checked={autoPostSettings.milestones}
                  onCheckedChange={(checked) => setAutoPostSettings({...autoPostSettings, milestones: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SocialMediaIntegration;
