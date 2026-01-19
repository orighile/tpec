import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, Calendar, DollarSign, Ticket,
  Eye, Share2, MessageSquare, Star, Download, Filter, RefreshCw
} from 'lucide-react';
import { useSupabaseEventAnalytics } from '@/hooks/useSupabaseEventAnalytics';

interface EventAnalyticsProps {
  eventId: string;
  eventName: string;
}

const EventAnalytics: React.FC<EventAnalyticsProps> = ({ eventId, eventName }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const { analyticsData, loading, generateSampleData, refetch } = useSupabaseEventAnalytics(eventId);

  // Default demographic data (this could also be stored in analytics)
  const demographicData = [
    { age: '18-25', count: 85 },
    { age: '26-35', count: 120 },
    { age: '36-45', count: 75 },
    { age: '46-55', count: 35 },
    { age: '55+', count: 15 }
  ];

  // Use real data if available, otherwise show empty state
  const salesData = analyticsData?.salesData || [];
  const ticketTypeData = analyticsData?.ticketTypeData || [];
  const engagementData = analyticsData?.engagementData || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const totalRevenue = analyticsData?.totalRevenue || 0;
  const totalTickets = analyticsData?.totalTickets || 0;
  const avgTicketPrice = analyticsData?.avgTicketPrice || 0;
  const conversionRate = analyticsData?.conversionRate || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold">Event Analytics</h2>
          <p className="text-muted-foreground">{eventName}</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
            <Badge variant="outline" className="px-3">
            <Filter className="mr-1 h-3 w-3" />
            {timeRange}
          </Badge>
          <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
            <RefreshCw className={`mr-1 h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={generateSampleData} disabled={loading}>
            Generate Sample Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+18.2%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tickets Sold</p>
                <p className="text-2xl font-bold">{totalTickets}</p>
              </div>
              <Ticket className="h-8 w-8 text-blue-600" />
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
                <p className="text-sm font-medium text-muted-foreground">Avg Ticket Price</p>
                <p className="text-2xl font-bold">{formatCurrency(avgTicketPrice)}</p>
              </div>
              <Users className="h-8 w-8 text-accent-foreground" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingDown className="h-4 w-4 text-destructive mr-1" />
              <span className="text-sm text-destructive">-2.1%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{conversionRate.toFixed(1)}%</p>
              </div>
              <Star className="h-8 w-8 text-secondary-foreground" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-primary mr-1" />
              <span className="text-sm text-primary">+0.5%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Daily ticket sales and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            {salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis yAxisId="tickets" orientation="left" />
                  <YAxis yAxisId="revenue" orientation="right" tickFormatter={(value) => `₦${value/1000}k`} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(value as number) : value,
                      name === 'revenue' ? 'Revenue' : 'Tickets'
                    ]}
                  />
                  <Area yAxisId="revenue" type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  <Bar yAxisId="tickets" dataKey="tickets" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                  <p>No sales data available yet</p>
                  <p className="text-sm">Generate sample data or start recording metrics</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ticket Distribution</CardTitle>
            <CardDescription>Sales by ticket type</CardDescription>
          </CardHeader>
          <CardContent>
            {ticketTypeData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={ticketTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {ticketTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} tickets`, 'Sold']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {ticketTypeData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-300 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Ticket className="h-12 w-12 mx-auto mb-4" />
                  <p>No ticket data available</p>
                  <p className="text-sm">Start selling tickets to see distribution</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Demographics & Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Age Demographics</CardTitle>
            <CardDescription>Attendee age distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={demographicData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
            <CardDescription>Social media and web engagement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {engagementData.map((metric) => (
              <div key={metric.metric} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {metric.metric === 'Page Views' && <Eye className="h-4 w-4 text-muted-foreground" />}
                  {metric.metric === 'Shares' && <Share2 className="h-4 w-4 text-muted-foreground" />}
                  {metric.metric === 'Comments' && <MessageSquare className="h-4 w-4 text-muted-foreground" />}
                  {metric.metric === 'Saves' && <Download className="h-4 w-4 text-muted-foreground" />}
                  <span className="text-sm font-medium">{metric.metric}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{metric.value.toLocaleString()}</div>
                  <div className={`flex items-center text-sm ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(metric.change)}%
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Performance Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Goals</CardTitle>
          <CardDescription>Progress towards event targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Ticket Sales</span>
                <span>{totalTickets}/500</span>
              </div>
              <Progress value={(totalTickets / 500) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">54% of target</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Revenue Goal</span>
                <span>{formatCurrency(totalRevenue)}/{formatCurrency(2000000)}</span>
              </div>
              <Progress value={(totalRevenue / 2000000) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">32% of target</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Social Reach</span>
                <span>12.5k/25k</span>
              </div>
              <Progress value={50} className="h-2" />
              <p className="text-xs text-muted-foreground">50% of target</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventAnalytics;
