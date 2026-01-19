import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Bell, CheckCircle, AlertCircle, Info, X, Settings,
  Calendar, Users, CreditCard, Ticket, MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  category: 'booking' | 'payment' | 'event' | 'guest' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionable?: boolean;
  actionText?: string;
  onAction?: () => void;
}

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  categories: {
    booking: boolean;
    payment: boolean;
    event: boolean;
    guest: boolean;
    system: boolean;
  };
}

const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      category: 'payment',
      title: 'Payment Received',
      message: 'Payment of ₦50,000 received for VIP ticket booking',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      actionable: true,
      actionText: 'View Receipt'
    },
    {
      id: '2',
      type: 'info',
      category: 'guest',
      title: 'New RSVP',
      message: 'John Doe confirmed attendance for Tech Summit 2025',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false
    },
    {
      id: '3',
      type: 'warning',
      category: 'event',
      title: 'Event Reminder',
      message: 'Tech Summit 2025 is happening tomorrow. Final preparations needed.',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: true,
      actionable: true,
      actionText: 'View Checklist'
    },
    {
      id: '4',
      type: 'error',
      category: 'booking',
      title: 'Booking Issue',
      message: 'Catering vendor booking requires attention - payment overdue',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      actionable: true,
      actionText: 'Contact Vendor'
    }
  ]);

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: true,
    push: true,
    sms: false,
    categories: {
      booking: true,
      payment: true,
      event: true,
      guest: true,
      system: true
    }
  });

  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string, category: string) => {
    if (category === 'payment') return <CreditCard className="h-4 w-4" />;
    if (category === 'booking') return <Calendar className="h-4 w-4" />;
    if (category === 'guest') return <Users className="h-4 w-4" />;
    if (category === 'event') return <Ticket className="h-4 w-4" />;
    
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-primary/10 text-primary';
      case 'warning': return 'bg-secondary text-secondary-foreground';
      case 'error': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    toast({
      title: "All notifications marked as read",
      description: `${unreadCount} notifications updated`,
    });
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const updatePreferences = (key: string, value: boolean) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      setPreferences(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev.categories],
          [child]: value
        }
      }));
    } else {
      setPreferences(prev => ({
        ...prev,
        [key]: value
      }));
    }
    
    toast({
      title: "Preferences Updated",
      description: "Notification settings have been saved",
    });
  };

  const filteredNotifications = notifications.filter(notif => 
    preferences.categories[notif.category]
  );

  if (showSettings) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Back
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Delivery Methods */}
          <div>
            <h3 className="font-semibold mb-3">Delivery Methods</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notif">Email Notifications</Label>
                <Switch
                  id="email-notif"
                  checked={preferences.email}
                  onCheckedChange={(checked) => updatePreferences('email', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notif">Push Notifications</Label>
                <Switch
                  id="push-notif"
                  checked={preferences.push}
                  onCheckedChange={(checked) => updatePreferences('push', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notif">SMS Notifications</Label>
                <Switch
                  id="sms-notif"
                  checked={preferences.sms}
                  onCheckedChange={(checked) => updatePreferences('sms', checked)}
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-3">Notification Categories</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <Label htmlFor="booking-notif">Booking Updates</Label>
                </div>
                <Switch
                  id="booking-notif"
                  checked={preferences.categories.booking}
                  onCheckedChange={(checked) => updatePreferences('categories.booking', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <Label htmlFor="payment-notif">Payment Alerts</Label>
                </div>
                <Switch
                  id="payment-notif"
                  checked={preferences.categories.payment}
                  onCheckedChange={(checked) => updatePreferences('categories.payment', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ticket className="h-4 w-4" />
                  <Label htmlFor="event-notif">Event Updates</Label>
                </div>
                <Switch
                  id="event-notif"
                  checked={preferences.categories.event}
                  onCheckedChange={(checked) => updatePreferences('categories.event', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <Label htmlFor="guest-notif">Guest Activity</Label>
                </div>
                <Switch
                  id="guest-notif"
                  checked={preferences.categories.guest}
                  onCheckedChange={(checked) => updatePreferences('categories.guest', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <Label htmlFor="system-notif">System Messages</Label>
                </div>
                <Switch
                  id="system-notif"
                  checked={preferences.categories.system}
                  onCheckedChange={(checked) => updatePreferences('categories.system', checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Stay updated with your events and bookings</CardDescription>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark All Read
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                <p className="text-muted-foreground">You're all caught up!</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`
                    p-4 rounded-lg border transition-colors cursor-pointer
                    ${notification.read 
                      ? 'bg-muted/30 border-muted' 
                      : 'bg-background border-border hover:bg-muted/50'
                    }
                  `}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(notification.type, notification.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <Badge className={getBadgeColor(notification.type)}>
                            {notification.type}
                          </Badge>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatTime(notification.timestamp)}
                          </span>
                          {notification.actionable && (
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                notification.onAction?.();
                              }}
                            >
                              {notification.actionText}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificationSystem;
