import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, Calendar, DollarSign, Star, 
  Download, Filter, RefreshCw, Eye, MessageSquare, Heart,
  UserPlus, ShoppingBag, CreditCard, MapPin, Clock
} from 'lucide-react';

interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

interface ChartData {
  name: string;
  value: number;
  revenue?: number;
  users?: number;
  events?: number;
}

const ReportingDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('last30days');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['revenue', 'users', 'events', 'bookings']);
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data
  const metrics: DashboardMetric[] = [
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: '₦2,450,000',
      change: 12.5,
      changeType: 'increase',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'text-green-600'
    },
    {
      id: 'users',
      title: 'Active Users',
      value: 8542,
      change: 8.2,
      changeType: 'increase',
      icon: <Users className="h-6 w-6" />,
      color: 'text-blue-600'
    },
    {
      id: 'events',
      title: 'Events Created',
      value: 156,
      change: -3.1,
      changeType: 'decrease',
      icon: <Calendar className="h-6 w-6" />,
      color: 'text-purple-600'
    },
    {
      id: 'bookings',
      title: 'Vendor Bookings',
      value: 892,
      change: 15.8,
      changeType: 'increase',
      icon: <ShoppingBag className="h-6 w-6" />,
      color: 'text-orange-600'
    },
    {
      id: 'rating',
      title: 'Avg. Rating',
      value: 4.8,
      change: 2.1,
      changeType: 'increase',
      icon: <Star className="h-6 w-6" />,
      color: 'text-yellow-600'
    },
    {
      id: 'conversion',
      title: 'Conversion Rate',
      value: '23.4%',
      change: 5.6,
      changeType: 'increase',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'text-indigo-600'
    }
  ];

  const revenueData: ChartData[] = [
    { name: 'Jan', value: 180000, revenue: 180000, users: 1200, events: 45 },
    { name: 'Feb', value: 220000, revenue: 220000, users: 1450, events: 52 },
    { name: 'Mar', value: 250000, revenue: 250000, users: 1680, events: 48 },
    { name: 'Apr', value: 280000, revenue: 280000, users: 1820, events: 61 },
    { name: 'May', value: 310000, revenue: 310000, users: 2100, events: 55 },
    { name: 'Jun', value: 340000, revenue: 340000, users: 2350, events: 68 },
    { name: 'Jul', value: 380000, revenue: 380000, users: 2680, events: 72 },
    { name: 'Aug', value: 420000, revenue: 420000, users: 2950, events: 78 },
    { name: 'Sep', value: 390000, revenue: 390000, users: 2800, events: 69 },
    { name: 'Oct', value: 460000, revenue: 460000, users: 3200, events: 85 },
    { name: 'Nov', value: 520000, revenue: 520000, users: 3650, events: 92 },
    { name: 'Dec', value: 580000, revenue: 580000, users: 4100, events: 98 }
  ];

  const categoryData: ChartData[] = [
    { name: 'Weddings', value: 45, revenue: 1200000 },
    { name: 'Corporate', value: 25, revenue: 800000 },
    { name: 'Birthday', value: 15, revenue: 350000 },
    { name: 'Anniversary', value: 10, revenue: 200000 },
    { name: 'Other', value: 5, revenue: 100000 }
  ];

  const vendorPerformance = [
    { name: 'Photography', bookings: 245, revenue: 450000, rating: 4.8 },
    { name: 'Catering', bookings: 189, revenue: 380000, rating: 4.6 },
    { name: 'Decoration', bookings: 156, revenue: 290000, rating: 4.7 },
    { name: 'Music/DJ', bookings: 134, revenue: 180000, rating: 4.5 },
    { name: 'Venue', bookings: 98, revenue: 650000, rating: 4.9 },
    { name: 'Transportation', bookings: 67, revenue: 120000, rating: 4.4 }
  ];

  const regionData = [
    { name: 'Lagos', events: 320, revenue: 1200000, users: 2800 },
    { name: 'Abuja', events: 185, revenue: 780000, users: 1650 },
    { name: 'Port Harcourt', events: 142, revenue: 540000, users: 1200 },
    { name: 'Kano', events: 98, revenue: 380000, users: 890 },
    { name: 'Ibadan', events: 87, revenue: 320000, users: 760 },
    { name: 'Benin', events: 65, revenue: 250000, users: 580 }
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  const getChangeIcon = (changeType: 'increase' | 'decrease' | 'neutral') => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decrease':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getChangeColor = (changeType: 'increase' | 'decrease' | 'neutral') => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const exportReport = (format: 'pdf' | 'excel') => {
    // Mock export functionality
    console.log(`Exporting ${activeTab} report as ${format}`);
  };

  const refreshData = () => {
    console.log('Refreshing dashboard data...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Monitor your platform performance and insights</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="last30days">Last 30 days</SelectItem>
              <SelectItem value="last90days">Last 90 days</SelectItem>
              <SelectItem value="last12months">Last 12 months</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={refreshData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => exportReport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => exportReport('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'outline'}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </Button>
            <Button
              variant={activeTab === 'revenue' ? 'default' : 'outline'}
              onClick={() => setActiveTab('revenue')}
            >
              Revenue
            </Button>
            <Button
              variant={activeTab === 'users' ? 'default' : 'outline'}
              onClick={() => setActiveTab('users')}
            >
              Users
            </Button>
            <Button
              variant={activeTab === 'vendors' ? 'default' : 'outline'}
              onClick={() => setActiveTab('vendors')}
            >
              Vendors
            </Button>
            <Button
              variant={activeTab === 'geography' ? 'default' : 'outline'}
              onClick={() => setActiveTab('geography')}
            >
              Geography
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={metric.color}>
                  {metric.icon}
                </div>
                {getChangeIcon(metric.changeType)}
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{metric.title}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className={`text-xs ${getChangeColor(metric.changeType)}`}>
                  {metric.changeType === 'increase' ? '+' : ''}
                  {metric.change}% vs last period
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Growth Trend</CardTitle>
              <CardDescription>Monthly revenue and user growth over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(value as number) : value,
                    name === 'revenue' ? 'Revenue' : name === 'users' ? 'Users' : 'Events'
                  ]} />
                  <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="users" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Event Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Event Categories</CardTitle>
                <CardDescription>Distribution of events by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <UserPlus className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">New user registration</p>
                      <p className="text-xs text-muted-foreground">5 new users joined today</p>
                    </div>
                    <Badge variant="outline">+5</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Event created</p>
                      <p className="text-xs text-muted-foreground">"Summer Wedding" by Sarah M.</p>
                    </div>
                    <Badge variant="outline">2h ago</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <ShoppingBag className="h-5 w-5 text-orange-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Vendor booking</p>
                      <p className="text-xs text-muted-foreground">Photography service booked</p>
                    </div>
                    <Badge variant="outline">₦85,000</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">New review</p>
                      <p className="text-xs text-muted-foreground">5-star review for DJ Service</p>
                    </div>
                    <Badge variant="outline">⭐ 5.0</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>Detailed revenue breakdown and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryData.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(category.revenue)}</p>
                      <p className="text-sm text-muted-foreground">{category.value}% of total</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>User acquisition and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold">4,127</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Eye className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold">2,856</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <UserPlus className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold">145</p>
                <p className="text-sm text-muted-foreground">New This Month</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Vendors Tab */}
      {activeTab === 'vendors' && (
        <Card>
          <CardHeader>
            <CardTitle>Vendor Performance</CardTitle>
            <CardDescription>Analytics for vendor categories and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vendorPerformance.map((vendor) => (
                <div key={vendor.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">{vendor.name}</h3>
                    <div className="flex gap-4 mt-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Bookings: </span>
                        <span className="font-medium">{vendor.bookings}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Revenue: </span>
                        <span className="font-medium">{formatCurrency(vendor.revenue)}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Rating: </span>
                        <span className="font-medium flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {vendor.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Geography Tab */}
      {activeTab === 'geography' && (
        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>Performance across different regions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {regionData.map((region, index) => (
                <div key={region.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold">{region.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {region.events} events • {region.users.toLocaleString()} users
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(region.revenue)}</p>
                    <div className="w-24 bg-muted rounded-full h-2 mt-1">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(region.revenue / Math.max(...regionData.map(r => r.revenue))) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportingDashboard;
