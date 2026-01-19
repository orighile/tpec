import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bell, BellRing, Mail, MessageSquare, Calendar, DollarSign, 
  Users, Star, AlertTriangle, CheckCircle, X, Settings,
  Send, Clock, Filter, Archive, Trash2, Eye, EyeOff,
  Smartphone, Monitor, Volume2, VolumeX, Vibrate
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'event' | 'review' | 'system' | 'marketing';
  channels: ('push' | 'email' | 'sms' | 'in_app')[];
  enabled: boolean;
  variables: string[];
}

interface NotificationRule {
  id: string;
  name: string;
  trigger: string;
  conditions: { field: string; operator: string; value: string }[];
  templateId: string;
  enabled: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  delay: number; // in minutes
  recipients: string[];
}

interface NotificationChannel {
  id: string;
  name: string;
  type: 'push' | 'email' | 'sms' | 'in_app';
  enabled: boolean;
  config: {
    provider?: string;
    apiKey?: string;
    webhook?: string;
    template?: string;
  };
  statistics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
  };
}

interface UserPreference {
  userId: string;
  channels: {
    push: boolean;
    email: boolean;
    sms: boolean;
    in_app: boolean;
  };
  categories: {
    booking: boolean;
    payment: boolean;
    event: boolean;
    review: boolean;
    system: boolean;
    marketing: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
  };
  frequency: 'instant' | 'daily' | 'weekly';
}

const AdvancedNotificationSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: 'Booking Confirmation',
      title: 'Booking Confirmed - {{eventName}}',
      message: 'Your booking for {{eventName}} on {{eventDate}} has been confirmed. Total amount: {{amount}}',
      type: 'booking',
      channels: ['push', 'email', 'in_app'],
      enabled: true,
      variables: ['eventName', 'eventDate', 'amount', 'vendorName']
    },
    {
      id: '2',
      name: 'Payment Received',
      title: 'Payment Received - {{amount}}',
      message: 'We have received your payment of {{amount}} for {{serviceName}}. Transaction ID: {{transactionId}}',
      type: 'payment',
      channels: ['push', 'email', 'sms'],
      enabled: true,
      variables: ['amount', 'serviceName', 'transactionId']
    },
    {
      id: '3',
      name: 'Event Reminder',
      title: 'Upcoming Event - {{eventName}}',
      message: 'Your event "{{eventName}}" is scheduled for {{eventDate}} at {{venue}}. Don\'t forget!',
      type: 'event',
      channels: ['push', 'email'],
      enabled: true,
      variables: ['eventName', 'eventDate', 'venue']
    }
  ]);

  const [rules, setRules] = useState<NotificationRule[]>([
    {
      id: '1',
      name: 'New Booking Alert',
      trigger: 'booking_created',
      conditions: [
        { field: 'amount', operator: 'greater_than', value: '50000' }
      ],
      templateId: '1',
      enabled: true,
      priority: 'high',
      delay: 0,
      recipients: ['user', 'vendor']
    },
    {
      id: '2',
      name: 'Payment Follow-up',
      trigger: 'payment_overdue',
      conditions: [
        { field: 'days_overdue', operator: 'greater_than', value: '3' }
      ],
      templateId: '2',
      enabled: true,
      priority: 'urgent',
      delay: 60,
      recipients: ['user']
    }
  ]);

  const [channels] = useState<NotificationChannel[]>([
    {
      id: '1',
      name: 'Push Notifications',
      type: 'push',
      enabled: true,
      config: { provider: 'firebase' },
      statistics: { sent: 1250, delivered: 1180, opened: 890, clicked: 245 }
    },
    {
      id: '2',
      name: 'Email',
      type: 'email',
      enabled: true,
      config: { provider: 'sendgrid', template: 'tpec-default' },
      statistics: { sent: 890, delivered: 865, opened: 520, clicked: 180 }
    },
    {
      id: '3',
      name: 'SMS',
      type: 'sms',
      enabled: false,
      config: { provider: 'twilio' },
      statistics: { sent: 0, delivered: 0, opened: 0, clicked: 0 }
    }
  ]);

  const [userPreferences, setUserPreferences] = useState<UserPreference>({
    userId: 'current_user',
    channels: { push: true, email: true, sms: false, in_app: true },
    categories: { booking: true, payment: true, event: true, review: true, system: true, marketing: false },
    quietHours: { enabled: true, start: '22:00', end: '08:00', timezone: 'Africa/Lagos' },
    frequency: 'instant'
  });

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    title: '',
    message: '',
    type: 'booking' as const,
    channels: [] as ('push' | 'email' | 'sms' | 'in_app')[]
  });

  const [testNotification, setTestNotification] = useState({
    templateId: '',
    recipient: '',
    variables: {} as Record<string, string>
  });

  const { toast } = useToast();

  const notificationTypes = ['booking', 'payment', 'event', 'review', 'system', 'marketing'];
  const channelTypes: ('push' | 'email' | 'sms' | 'in_app')[] = ['push', 'email', 'sms', 'in_app'];

  const getTypeColor = (type: string) => {
    const colors = {
      booking: 'bg-primary/10 text-primary',
      payment: 'bg-primary/10 text-primary',
      event: 'bg-accent text-accent-foreground',
      review: 'bg-secondary text-secondary-foreground',
      system: 'bg-destructive/10 text-destructive',
      marketing: 'bg-accent/50 text-accent-foreground'
    };
    return colors[type as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-muted text-muted-foreground',
      medium: 'bg-primary/10 text-primary',
      high: 'bg-secondary text-secondary-foreground',
      urgent: 'bg-destructive/10 text-destructive'
    };
    return colors[priority as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'push': return <Smartphone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'in_app': return <Bell className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.title || !newTemplate.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const template: NotificationTemplate = {
      id: Date.now().toString(),
      ...newTemplate,
      enabled: true,
      variables: extractVariables(newTemplate.message)
    };

    setTemplates([...templates, template]);
    setNewTemplate({ name: '', title: '', message: '', type: 'booking', channels: [] as ('push' | 'email' | 'sms' | 'in_app')[] });

    toast({
      title: "Template Created",
      description: "Notification template has been created successfully",
    });
  };

  const extractVariables = (message: string): string[] => {
    const regex = /\{\{(\w+)\}\}/g;
    const variables: string[] = [];
    let match;
    while ((match = regex.exec(message)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }
    return variables;
  };

  const handleSendTestNotification = () => {
    if (!testNotification.templateId || !testNotification.recipient) {
      toast({
        title: "Missing Information",
        description: "Please select template and enter recipient",
        variant: "destructive"
      });
      return;
    }

    // Simulate sending test notification
    toast({
      title: "Test Notification Sent",
      description: `Test notification sent to ${testNotification.recipient}`,
    });
  };

  const getTotalNotifications = () => {
    return channels.reduce((total, channel) => total + channel.statistics.sent, 0);
  };

  const getDeliveryRate = () => {
    const totalSent = getTotalNotifications();
    const totalDelivered = channels.reduce((total, channel) => total + channel.statistics.delivered, 0);
    return totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 0;
  };

  const getOpenRate = () => {
    const totalDelivered = channels.reduce((total, channel) => total + channel.statistics.delivered, 0);
    const totalOpened = channels.reduce((total, channel) => total + channel.statistics.opened, 0);
    return totalDelivered > 0 ? Math.round((totalOpened / totalDelivered) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BellRing className="h-6 w-6" />
            Advanced Notification System
          </h1>
          <p className="text-muted-foreground">Manage notification templates, rules, and delivery channels</p>
        </div>
        <Button onClick={() => setActiveTab('test')}>
          <Send className="h-4 w-4 mr-2" />
          Send Test
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sent</p>
                <p className="text-2xl font-bold">{getTotalNotifications().toLocaleString()}</p>
              </div>
              <Send className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Delivery Rate</p>
                <p className="text-2xl font-bold">{getDeliveryRate()}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Rate</p>
                <p className="text-2xl font-bold">{getOpenRate()}%</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Rules</p>
                <p className="text-2xl font-bold">{rules.filter(r => r.enabled).length}</p>
              </div>
              <Settings className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 flex-wrap">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </Button>
            <Button
              variant={activeTab === 'templates' ? 'default' : 'outline'}
              onClick={() => setActiveTab('templates')}
            >
              Templates
            </Button>
            <Button
              variant={activeTab === 'rules' ? 'default' : 'outline'}
              onClick={() => setActiveTab('rules')}
            >
              Rules
            </Button>
            <Button
              variant={activeTab === 'channels' ? 'default' : 'outline'}
              onClick={() => setActiveTab('channels')}
            >
              Channels
            </Button>
            <Button
              variant={activeTab === 'preferences' ? 'default' : 'outline'}
              onClick={() => setActiveTab('preferences')}
            >
              User Preferences
            </Button>
            <Button
              variant={activeTab === 'test' ? 'default' : 'outline'}
              onClick={() => setActiveTab('test')}
            >
              Test & Debug
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Channel Performance</CardTitle>
              <CardDescription>Delivery statistics by channel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {channels.map((channel) => (
                  <div key={channel.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getChannelIcon(channel.type)}
                      <div>
                        <h3 className="font-semibold">{channel.name}</h3>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>Sent: {channel.statistics.sent}</span>
                          <span>Delivered: {channel.statistics.delivered}</span>
                          <span>Opened: {channel.statistics.opened}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={channel.enabled ? "default" : "secondary"}>
                        {channel.enabled ? 'Active' : 'Inactive'}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {channel.statistics.delivered > 0 
                            ? Math.round((channel.statistics.delivered / channel.statistics.sent) * 100) 
                            : 0}% delivered
                        </p>
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ 
                              width: `${channel.statistics.delivered > 0 
                                ? (channel.statistics.delivered / channel.statistics.sent) * 100 
                                : 0}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Template Name</Label>
                  <Input
                    placeholder="e.g., Booking Confirmation"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select 
                    value={newTemplate.type} 
                    onValueChange={(value) => setNewTemplate({...newTemplate, type: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {notificationTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="Use {{variable}} for dynamic content"
                  value={newTemplate.title}
                  onChange={(e) => setNewTemplate({...newTemplate, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  placeholder="Use {{variable}} for dynamic content like {{eventName}}, {{amount}}, etc."
                  rows={4}
                  value={newTemplate.message}
                  onChange={(e) => setNewTemplate({...newTemplate, message: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Channels</Label>
                <div className="flex gap-2 flex-wrap">
                  {channelTypes.map(channel => (
                    <div
                      key={channel}
                      className={`
                        flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors
                        ${newTemplate.channels.includes(channel)
                          ? 'border-primary bg-primary/5'
                          : 'border-muted hover:border-primary/50'
                        }
                      `}
                      onClick={() => {
                        const channels = newTemplate.channels.includes(channel)
                          ? newTemplate.channels.filter(c => c !== channel)
                          : [...newTemplate.channels, channel];
                        setNewTemplate({...newTemplate, channels});
                      }}
                    >
                      {getChannelIcon(channel)}
                      <span className="text-sm">{channel}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={handleCreateTemplate}>
                Create Template
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-2">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{template.name}</h3>
                        <Badge className={getTypeColor(template.type)}>
                          {template.type}
                        </Badge>
                        <Badge variant={template.enabled ? "default" : "secondary"}>
                          {template.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{template.title}</p>
                      <p className="text-sm mb-2">{template.message}</p>
                      <div className="flex gap-1">
                        {template.channels.map(channel => (
                          <div key={channel} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                            {getChannelIcon(channel)}
                            {channel}
                          </div>
                        ))}
                      </div>
                      {template.variables.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">Variables:</p>
                          <div className="flex gap-1 flex-wrap">
                            {template.variables.map(variable => (
                              <Badge key={variable} variant="outline" className="text-xs">
                                {`{{${variable}}}`}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Switch
                        checked={template.enabled}
                        onCheckedChange={(checked) => {
                          setTemplates(templates.map(t => 
                            t.id === template.id ? { ...t, enabled: checked } : t
                          ));
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Test Tab */}
      {activeTab === 'test' && (
        <Card>
          <CardHeader>
            <CardTitle>Test Notification</CardTitle>
            <CardDescription>Send a test notification to verify your setup</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Template</Label>
                <Select 
                  value={testNotification.templateId} 
                  onValueChange={(value) => setTestNotification({...testNotification, templateId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
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
              <div className="space-y-2">
                <Label>Recipient</Label>
                <Input
                  placeholder="Email or phone number"
                  value={testNotification.recipient}
                  onChange={(e) => setTestNotification({...testNotification, recipient: e.target.value})}
                />
              </div>
            </div>

            {testNotification.templateId && (
              <div className="space-y-2">
                <Label>Test Variables</Label>
                {templates.find(t => t.id === testNotification.templateId)?.variables.map(variable => (
                  <div key={variable} className="flex gap-2 items-center">
                    <Label className="w-32">{`{{${variable}}}`}</Label>
                    <Input
                      placeholder={`Enter ${variable}`}
                      value={testNotification.variables[variable] || ''}
                      onChange={(e) => setTestNotification({
                        ...testNotification,
                        variables: { ...testNotification.variables, [variable]: e.target.value }
                      })}
                    />
                  </div>
                ))}
              </div>
            )}

            <Button onClick={handleSendTestNotification} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Send Test Notification
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedNotificationSystem;
