import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSupabaseEventAnalytics } from '@/hooks/useSupabaseEventAnalytics';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, Calendar, DollarSign, Ticket,
  Eye, Share2, MessageSquare, Star, Download, Filter, RefreshCw, Database
} from 'lucide-react';

interface RealEventAnalyticsProps {
  eventId: string;
  eventName: string;
}

const RealEventAnalytics: React.FC<RealEventAnalyticsProps> = ({ eventId, eventName }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const { analyticsData, loading, generateSampleData, recordMetric, refetch } = useSupabaseEventAnalytics(eventId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 mx-auto animate-spin text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData || analyticsData.totalTickets === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Event Analytics
            </CardTitle>
            <CardDescription>{eventName}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Analytics Data Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start collecting data by generating sample metrics or begin real event activities.
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={generateSampleData} disabled={loading}>
                  Generate Sample Data
                </Button>
                <Button variant="outline" onClick={refetch}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Database className="h-7 w-7" />
            Real-Time Analytics
          </h2>
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
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(analyticsData.totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">Live Data</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tickets Sold</p>
                <p className="text-2xl font-bold">{analyticsData.totalTickets}</p>
              </div>
              <Ticket className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">Live Data</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Ticket Price</p>
                <p className="text-2xl font-bold">{formatCurrency(analyticsData.avgTicketPrice)}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">Live Data</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{analyticsData.conversionRate.toFixed(1)}%</p>
              </div>
              <Star className="h-8 w-8 text-orange-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">Live Data</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Daily ticket sales and revenue from database</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.salesData}>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ticket Distribution</CardTitle>
            <CardDescription>Sales by ticket type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.ticketTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analyticsData.ticketTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} tickets`, 'Sold']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {analyticsData.ticketTypeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Engagement</CardTitle>
          <CardDescription>Live engagement metrics from database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {analyticsData.engagementData.map((metric) => (
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
                  {Math.abs(metric.change).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Actions</CardTitle>
          <CardDescription>Manually record metrics or generate test data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant="outline" 
              onClick={() => recordMetric('page_views', 1)}
            >
              Record Page View
            </Button>
            <Button 
              variant="outline" 
              onClick={() => recordMetric('tickets_sold', 1)}
            >
              Record Ticket Sale
            </Button>
            <Button 
              variant="outline" 
              onClick={() => recordMetric('revenue', 5000)}
            >
              Record Revenue (₦5,000)
            </Button>
            <Button 
              variant="outline" 
              onClick={generateSampleData}
            >
              Generate More Sample Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealEventAnalytics;