import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  Mail, Send, Users, Calendar, BarChart3, Clock, 
  Eye, MousePointer, TrendingUp, Filter, Plus, Edit, Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Campaign {
  id: string;
  name: string;
  subject: string;
  type: 'promotional' | 'newsletter' | 'event_reminder' | 'follow_up';
  status: 'draft' | 'scheduled' | 'sent' | 'active';
  audienceSize: number;
  sentCount: number;
  openRate: number;
  clickRate: number;
  createdDate: Date;
  scheduledDate?: Date;
  sentDate?: Date;
  content: string;
  template: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  type: string;
  subject: string;
  preview: string;
  content: string;
  thumbnail: string;
}

interface Audience {
  id: string;
  name: string;
  description: string;
  size: number;
  criteria: string[];
  lastUpdated: Date;
}

const EmailMarketing: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Wedding Season Promotion',
      subject: '🎉 25% Off Wedding Photography Packages',
      type: 'promotional',
      status: 'sent',
      audienceSize: 1250,
      sentCount: 1247,
      openRate: 34.2,
      clickRate: 5.8,
      createdDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      sentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      content: 'Wedding season is here! Book now and save 25% on all photography packages.',
      template: 'promotional'
    },
    {
      id: '2',
      name: 'Monthly Newsletter - January',
      subject: 'TPEC Events Newsletter - January 2025',
      type: 'newsletter',
      status: 'scheduled',
      audienceSize: 3200,
      sentCount: 0,
      openRate: 0,
      clickRate: 0,
      createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      content: 'This month in events: New vendors, success stories, and upcoming features.',
      template: 'newsletter'
    }
  ]);

  const [templates] = useState<EmailTemplate[]>([
    {
      id: '1',
      name: 'Promotional Offer',
      type: 'promotional',
      subject: 'Special Offer Inside!',
      preview: 'Limited time discount on our services',
      content: 'Promotional email template with discount banner',
      thumbnail: '/api/placeholder/200/150'
    },
    {
      id: '2',
      name: 'Event Reminder',
      type: 'event_reminder',
      subject: 'Your Event is Tomorrow!',
      preview: 'Don\'t forget about your upcoming event',
      content: 'Event reminder template with details',
      thumbnail: '/api/placeholder/200/150'
    },
    {
      id: '3',
      name: 'Welcome Series',
      type: 'follow_up',
      subject: 'Welcome to TPEC Events!',
      preview: 'Thank you for joining our community',
      content: 'Welcome email template for new users',
      thumbnail: '/api/placeholder/200/150'
    }
  ]);

  const [audiences] = useState<Audience[]>([
    {
      id: '1',
      name: 'All Subscribers',
      description: 'All newsletter subscribers',
      size: 3200,
      criteria: ['Subscribed to newsletter'],
      lastUpdated: new Date()
    },
    {
      id: '2',
      name: 'Wedding Couples',
      description: 'Users interested in wedding services',
      size: 850,
      criteria: ['Event type: Wedding', 'Active in last 30 days'],
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      name: 'Corporate Clients',
      description: 'Business and corporate event organizers',
      size: 420,
      criteria: ['Event type: Corporate', 'Budget > ₦100,000'],
      lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    type: '',
    audience: '',
    template: '',
    content: '',
    scheduleDate: '',
    scheduleTime: ''
  });

  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Send className="h-4 w-4" />;
      case 'scheduled': return <Clock className="h-4 w-4" />;
      case 'active': return <TrendingUp className="h-4 w-4" />;
      default: return <Edit className="h-4 w-4" />;
    }
  };

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.subject || !newCampaign.type) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const campaign: Campaign = {
      id: Date.now().toString(),
      name: newCampaign.name,
      subject: newCampaign.subject,
      type: newCampaign.type as any,
      status: newCampaign.scheduleDate ? 'scheduled' : 'draft',
      audienceSize: audiences.find(a => a.id === newCampaign.audience)?.size || 0,
      sentCount: 0,
      openRate: 0,
      clickRate: 0,
      createdDate: new Date(),
      scheduledDate: newCampaign.scheduleDate ? new Date(newCampaign.scheduleDate + 'T' + newCampaign.scheduleTime) : undefined,
      content: newCampaign.content,
      template: newCampaign.template
    };

    setCampaigns([campaign, ...campaigns]);
    setNewCampaign({
      name: '', subject: '', type: '', audience: '', template: '', 
      content: '', scheduleDate: '', scheduleTime: ''
    });
    setShowCreateCampaign(false);

    toast({
      title: "Campaign Created",
      description: newCampaign.scheduleDate ? "Campaign scheduled successfully" : "Campaign saved as draft",
    });
  };

  const getTotalStats = () => {
    const totalSent = campaigns.reduce((sum, c) => sum + c.sentCount, 0);
    const totalOpened = campaigns.reduce((sum, c) => sum + (c.sentCount * c.openRate / 100), 0);
    const totalClicked = campaigns.reduce((sum, c) => sum + (c.sentCount * c.clickRate / 100), 0);
    
    return {
      totalSent,
      avgOpenRate: totalSent > 0 ? (totalOpened / totalSent) * 100 : 0,
      avgClickRate: totalSent > 0 ? (totalClicked / totalSent) * 100 : 0,
      totalSubscribers: audiences.find(a => a.name === 'All Subscribers')?.size || 0
    };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Subscribers</p>
                <p className="text-2xl font-bold">{stats.totalSubscribers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+12.5%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Emails Sent</p>
                <p className="text-2xl font-bold">{stats.totalSent.toLocaleString()}</p>
              </div>
              <Send className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+8.3%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Open Rate</p>
                <p className="text-2xl font-bold">{stats.avgOpenRate.toFixed(1)}%</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+2.1%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Click Rate</p>
                <p className="text-2xl font-bold">{stats.avgClickRate.toFixed(1)}%</p>
              </div>
              <MousePointer className="h-8 w-8 text-orange-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+1.4%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <Button
                variant={activeTab === 'campaigns' ? 'default' : 'outline'}
                onClick={() => setActiveTab('campaigns')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Campaigns
              </Button>
              <Button
                variant={activeTab === 'templates' ? 'default' : 'outline'}
                onClick={() => setActiveTab('templates')}
              >
                Templates
              </Button>
              <Button
                variant={activeTab === 'audiences' ? 'default' : 'outline'}
                onClick={() => setActiveTab('audiences')}
              >
                <Users className="h-4 w-4 mr-2" />
                Audiences
              </Button>
              <Button
                variant={activeTab === 'analytics' ? 'default' : 'outline'}
                onClick={() => setActiveTab('analytics')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </div>
            {activeTab === 'campaigns' && (
              <Button onClick={() => setShowCreateCampaign(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Campaign Form */}
      {showCreateCampaign && (
        <Card>
          <CardHeader>
            <CardTitle>Create Email Campaign</CardTitle>
            <CardDescription>Design and schedule your email marketing campaign</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Campaign Name *</Label>
                <Input
                  placeholder="e.g., Spring Promotion 2025"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Campaign Type *</Label>
                <Select value={newCampaign.type} onValueChange={(value) => setNewCampaign({...newCampaign, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="promotional">Promotional</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="event_reminder">Event Reminder</SelectItem>
                    <SelectItem value="follow_up">Follow-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email Subject *</Label>
              <Input
                placeholder="Subject line for your email"
                value={newCampaign.subject}
                onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Select value={newCampaign.audience} onValueChange={(value) => setNewCampaign({...newCampaign, audience: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose audience" />
                  </SelectTrigger>
                  <SelectContent>
                    {audiences.map(audience => (
                      <SelectItem key={audience.id} value={audience.id}>
                        {audience.name} ({audience.size.toLocaleString()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Email Template</Label>
                <Select value={newCampaign.template} onValueChange={(value) => setNewCampaign({...newCampaign, template: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email Content</Label>
              <Textarea
                placeholder="Write your email content here..."
                rows={6}
                value={newCampaign.content}
                onChange={(e) => setNewCampaign({...newCampaign, content: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Schedule Date (Optional)</Label>
                <Input
                  type="date"
                  value={newCampaign.scheduleDate}
                  onChange={(e) => setNewCampaign({...newCampaign, scheduleDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Schedule Time</Label>
                <Input
                  type="time"
                  value={newCampaign.scheduleTime}
                  onChange={(e) => setNewCampaign({...newCampaign, scheduleTime: e.target.value})}
                  disabled={!newCampaign.scheduleDate}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateCampaign}>
                {newCampaign.scheduleDate ? 'Schedule Campaign' : 'Save as Draft'}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateCampaign(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{campaign.name}</h3>
                      <Badge className={getStatusColor(campaign.status)}>
                        {getStatusIcon(campaign.status)}
                        <span className="ml-1">{campaign.status}</span>
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">{campaign.subject}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="font-semibold">{campaign.audienceSize.toLocaleString()}</div>
                        <div className="text-muted-foreground">Audience Size</div>
                      </div>
                      <div>
                        <div className="font-semibold">{campaign.sentCount.toLocaleString()}</div>
                        <div className="text-muted-foreground">Sent</div>
                      </div>
                      <div>
                        <div className="font-semibold">{campaign.openRate}%</div>
                        <div className="text-muted-foreground">Open Rate</div>
                      </div>
                      <div>
                        <div className="font-semibold">{campaign.clickRate}%</div>
                        <div className="text-muted-foreground">Click Rate</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {campaign.status === 'sent' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-1">Open Rate Progress</div>
                      <Progress value={campaign.openRate} className="h-2" />
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Click Rate Progress</div>
                      <Progress value={campaign.clickRate} className="h-2" />
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4 pt-4 border-t text-sm text-muted-foreground">
                  <div>
                    Created: {campaign.createdDate.toLocaleDateString()}
                    {campaign.scheduledDate && (
                      <span> • Scheduled: {campaign.scheduledDate.toLocaleDateString()}</span>
                    )}
                    {campaign.sentDate && (
                      <span> • Sent: {campaign.sentDate.toLocaleDateString()}</span>
                    )}
                  </div>
                  {campaign.status === 'draft' && (
                    <Button size="sm">
                      <Send className="h-4 w-4 mr-1" />
                      Send Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardContent className="p-4">
                <img 
                  src={template.thumbnail} 
                  alt={template.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold mb-2">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{template.preview}</p>
                <Badge variant="outline" className="mb-4">{template.type}</Badge>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">Use Template</Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Audiences Tab */}
      {activeTab === 'audiences' && (
        <div className="space-y-4">
          {audiences.map((audience) => (
            <Card key={audience.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{audience.name}</h3>
                    <p className="text-muted-foreground mb-3">{audience.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {audience.size.toLocaleString()} subscribers
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Updated {audience.lastUpdated.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm font-medium mb-1">Criteria:</div>
                      <div className="flex flex-wrap gap-1">
                        {audience.criteria.map((criterion, index) => (
                          <Badge key={index} variant="secondary">{criterion}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmailMarketing;
