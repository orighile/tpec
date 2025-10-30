import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, Shield, Bell, Eye, EyeOff, Smartphone, Mail, 
  Globe, Palette, Download, Upload, Trash2, Key, 
  Camera, MapPin, Calendar, Clock, Languages,
  Monitor, Volume2, VolumeX, Lock, Unlock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  avatar: string;
  website: string;
  dateOfBirth: string;
  gender: string;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  allowMessages: boolean;
  allowEventInvitations: boolean;
  showOnlineStatus: boolean;
  indexProfile: boolean;
}

interface NotificationSettings {
  email: {
    bookings: boolean;
    payments: boolean;
    events: boolean;
    marketing: boolean;
    reminders: boolean;
  };
  push: {
    bookings: boolean;
    messages: boolean;
    events: boolean;
    reminders: boolean;
  };
  sms: {
    bookings: boolean;
    payments: boolean;
    reminders: boolean;
  };
  frequency: 'instant' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  currency: string;
  dateFormat: string;
  timeFormat: '12' | '24';
  fontSize: 'small' | 'medium' | 'large';
  colorScheme: string;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  sessionTimeout: number;
  passwordLastChanged: Date;
  trustedDevices: string[];
  loginHistory: Array<{
    date: Date;
    location: string;
    device: string;
    ip: string;
  }>;
}

const AdvancedUserSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<UserProfile>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+234 801 234 5678',
    bio: 'Event planning enthusiast with 5+ years experience',
    location: 'Lagos, Nigeria',
    avatar: '/api/placeholder/100/100',
    website: 'https://johndoe.com',
    dateOfBirth: '1990-01-15',
    gender: 'male'
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showLocation: true,
    allowMessages: true,
    allowEventInvitations: true,
    showOnlineStatus: true,
    indexProfile: true
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: {
      bookings: true,
      payments: true,
      events: true,
      marketing: false,
      reminders: true
    },
    push: {
      bookings: true,
      messages: true,
      events: true,
      reminders: true
    },
    sms: {
      bookings: false,
      payments: true,
      reminders: false
    },
    frequency: 'instant',
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    }
  });

  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: 'light',
    language: 'en',
    currency: 'NGN',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24',
    fontSize: 'medium',
    colorScheme: 'blue'
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: 30,
    passwordLastChanged: new Date('2024-01-15'),
    trustedDevices: ['iPhone 15', 'MacBook Pro'],
    loginHistory: [
      {
        date: new Date('2024-08-25T14:30:00'),
        location: 'Lagos, Nigeria',
        device: 'iPhone 15',
        ip: '197.210.xxx.xxx'
      },
      {
        date: new Date('2024-08-24T09:15:00'),
        location: 'Lagos, Nigeria',
        device: 'MacBook Pro',
        ip: '197.210.xxx.xxx'
      }
    ]
  });

  const { toast } = useToast();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá' },
    { code: 'ig', name: 'Igbo', nativeName: 'Igbo' },
    { code: 'ha', name: 'Hausa', nativeName: 'Hausa' }
  ];

  const currencies = [
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' }
  ];

  const colorSchemes = [
    { id: 'blue', name: 'Blue', color: 'bg-blue-500' },
    { id: 'green', name: 'Green', color: 'bg-green-500' },
    { id: 'purple', name: 'Purple', color: 'bg-purple-500' },
    { id: 'orange', name: 'Orange', color: 'bg-orange-500' },
    { id: 'red', name: 'Red', color: 'bg-red-500' }
  ];

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully",
    });
  };

  const handleExportData = () => {
    const userData = {
      profile,
      privacy,
      notifications,
      appearance,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tpec-user-data.json';
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "Your data has been exported successfully",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deletion",
      description: "Please contact support to delete your account",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6" />
            Advanced Settings
          </h1>
          <p className="text-muted-foreground">Manage your account preferences and privacy settings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 flex-wrap">
            <Button
              variant={activeTab === 'profile' ? 'default' : 'outline'}
              onClick={() => setActiveTab('profile')}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button
              variant={activeTab === 'privacy' ? 'default' : 'outline'}
              onClick={() => setActiveTab('privacy')}
            >
              <Shield className="h-4 w-4 mr-2" />
              Privacy
            </Button>
            <Button
              variant={activeTab === 'notifications' ? 'default' : 'outline'}
              onClick={() => setActiveTab('notifications')}
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button
              variant={activeTab === 'appearance' ? 'default' : 'outline'}
              onClick={() => setActiveTab('appearance')}
            >
              <Palette className="h-4 w-4 mr-2" />
              Appearance
            </Button>
            <Button
              variant={activeTab === 'security' ? 'default' : 'outline'}
              onClick={() => setActiveTab('security')}
            >
              <Lock className="h-4 w-4 mr-2" />
              Security
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={profile.avatar}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{profile.firstName} {profile.lastName}</h3>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Change Photo
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input
                    value={profile.firstName}
                    onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input
                    value={profile.lastName}
                    onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  placeholder="Tell us about yourself..."
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={profile.location}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                    placeholder="City, Country"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input
                    value={profile.website}
                    onChange={(e) => setProfile({...profile, website: e.target.value})}
                    placeholder="https://"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile({...profile, dateOfBirth: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={profile.gender} onValueChange={(value) => setProfile({...profile, gender: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Privacy Tab */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control who can see your information and interact with you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Profile Visibility</Label>
                    <p className="text-sm text-muted-foreground">Who can see your profile</p>
                  </div>
                  <Select 
                    value={privacy.profileVisibility} 
                    onValueChange={(value) => setPrivacy({...privacy, profileVisibility: value as any})}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  {[
                    { key: 'showEmail', label: 'Show Email Address', desc: 'Allow others to see your email' },
                    { key: 'showPhone', label: 'Show Phone Number', desc: 'Allow others to see your phone' },
                    { key: 'showLocation', label: 'Show Location', desc: 'Display your location on profile' },
                    { key: 'allowMessages', label: 'Allow Messages', desc: 'Let others send you messages' },
                    { key: 'allowEventInvitations', label: 'Event Invitations', desc: 'Receive event invitations' },
                    { key: 'showOnlineStatus', label: 'Show Online Status', desc: 'Display when you\'re online' },
                    { key: 'indexProfile', label: 'Search Engine Indexing', desc: 'Allow search engines to index your profile' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between">
                      <div>
                        <Label>{setting.label}</Label>
                        <p className="text-sm text-muted-foreground">{setting.desc}</p>
                      </div>
                      <Switch
                        checked={privacy[setting.key as keyof PrivacySettings] as boolean}
                        onCheckedChange={(checked) => setPrivacy({...privacy, [setting.key]: checked})}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how and when you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Notification Frequency</Label>
                  <Select 
                    value={notifications.frequency} 
                    onValueChange={(value) => setNotifications({...notifications, frequency: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instant">Instant</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Notifications
                  </h3>
                  {Object.entries(notifications.email).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => setNotifications({
                          ...notifications,
                          email: { ...notifications.email, [key]: checked }
                        })}
                      />
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Push Notifications
                  </h3>
                  {Object.entries(notifications.push).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => setNotifications({
                          ...notifications,
                          push: { ...notifications.push, [key]: checked }
                        })}
                      />
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Quiet Hours</Label>
                      <p className="text-sm text-muted-foreground">Disable notifications during these hours</p>
                    </div>
                    <Switch
                      checked={notifications.quietHours.enabled}
                      onCheckedChange={(checked) => setNotifications({
                        ...notifications,
                        quietHours: { ...notifications.quietHours, enabled: checked }
                      })}
                    />
                  </div>

                  {notifications.quietHours.enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Time</Label>
                        <Input
                          type="time"
                          value={notifications.quietHours.start}
                          onChange={(e) => setNotifications({
                            ...notifications,
                            quietHours: { ...notifications.quietHours, start: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Time</Label>
                        <Input
                          type="time"
                          value={notifications.quietHours.end}
                          onChange={(e) => setNotifications({
                            ...notifications,
                            quietHours: { ...notifications.quietHours, end: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Appearance Tab */}
      {activeTab === 'appearance' && (
        <Card>
          <CardHeader>
            <CardTitle>Appearance & Language</CardTitle>
            <CardDescription>Customize how the app looks and behaves</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={appearance.theme} onValueChange={(value) => setAppearance({...appearance, theme: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto (System)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={appearance.language} onValueChange={(value) => setAppearance({...appearance, language: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.nativeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={appearance.currency} onValueChange={(value) => setAppearance({...appearance, currency: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(currency => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Time Format</Label>
                <Select value={appearance.timeFormat} onValueChange={(value) => setAppearance({...appearance, timeFormat: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12-hour (AM/PM)</SelectItem>
                    <SelectItem value="24">24-hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color Scheme</Label>
              <div className="flex gap-2">
                {colorSchemes.map(scheme => (
                  <Button
                    key={scheme.id}
                    variant={appearance.colorScheme === scheme.id ? "default" : "outline"}
                    onClick={() => setAppearance({...appearance, colorScheme: scheme.id})}
                    className="flex items-center gap-2"
                  >
                    <div className={`w-4 h-4 rounded-full ${scheme.color}`} />
                    {scheme.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security and login preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  checked={security.twoFactorEnabled}
                  onCheckedChange={(checked) => setSecurity({...security, twoFactorEnabled: checked})}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Password</Label>
                  <Button variant="outline">Change Password</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Last changed: {security.passwordLastChanged.toLocaleDateString()}
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Login History</Label>
                <div className="space-y-2">
                  {security.loginHistory.map((login, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{login.device}</p>
                        <p className="text-sm text-muted-foreground">
                          {login.location} • {login.date.toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-destructive">Danger Zone</Label>
                <div className="p-4 border border-destructive rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-destructive">Delete Account</h3>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdvancedUserSettings;
