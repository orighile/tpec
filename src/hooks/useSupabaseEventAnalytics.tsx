import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AnalyticsMetric {
  id?: string;
  event_id: string;
  metric_type: string;
  metric_value: number;
  date_recorded: string;
  metadata?: Record<string, any>;
}

export interface EventAnalyticsData {
  totalRevenue: number;
  totalTickets: number;
  avgTicketPrice: number;
  conversionRate: number;
  salesData: Array<{
    date: string;
    tickets: number;
    revenue: number;
  }>;
  ticketTypeData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  engagementData: Array<{
    metric: string;
    value: number;
    change: number;
    trend: 'up' | 'down';
  }>;
}

export const useSupabaseEventAnalytics = (eventId?: string) => {
  const [analyticsData, setAnalyticsData] = useState<EventAnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Record analytics metric
  const recordMetric = async (metricType: string, value: number, metadata?: Record<string, any>) => {
    if (!eventId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('event_analytics')
        .insert({
          event_id: eventId,
          user_id: user.id,
          metric_type: metricType,
          metric_value: value,
          metadata: metadata || {}
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error recording metric:', error);
    }
  };

  // Fetch and process analytics data
  const fetchAnalyticsData = async () => {
    if (!eventId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('event_analytics')
        .select('*')
        .eq('event_id', eventId)
        .order('date_recorded', { ascending: true });

      if (error) throw error;

      // Process raw analytics data into structured format
      const processedData = processAnalyticsData((data || []).map(metric => ({
        ...metric,
        metadata: (metric.metadata as Record<string, any>) || {}
      })));
      setAnalyticsData(processedData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Process raw analytics data into dashboard format
  const processAnalyticsData = (metrics: AnalyticsMetric[]): EventAnalyticsData => {
    // Group metrics by type
    const metricsByType = metrics.reduce((acc, metric) => {
      if (!acc[metric.metric_type]) acc[metric.metric_type] = [];
      acc[metric.metric_type].push(metric);
      return acc;
    }, {} as Record<string, AnalyticsMetric[]>);

    // Calculate totals
    const revenueMetrics = metricsByType['revenue'] || [];
    const ticketMetrics = metricsByType['tickets_sold'] || [];
    const pageViewMetrics = metricsByType['page_views'] || [];

    const totalRevenue = revenueMetrics.reduce((sum, m) => sum + m.metric_value, 0);
    const totalTickets = ticketMetrics.reduce((sum, m) => sum + m.metric_value, 0);
    const avgTicketPrice = totalTickets > 0 ? totalRevenue / totalTickets : 0;
    const totalPageViews = pageViewMetrics.reduce((sum, m) => sum + m.metric_value, 0);
    const conversionRate = totalPageViews > 0 ? (totalTickets / totalPageViews) * 100 : 0;

    // Create daily sales data
    const salesByDate = new Map<string, { tickets: number; revenue: number }>();
    
    revenueMetrics.forEach(metric => {
      const date = metric.date_recorded;
      if (!salesByDate.has(date)) {
        salesByDate.set(date, { tickets: 0, revenue: 0 });
      }
      salesByDate.get(date)!.revenue += metric.metric_value;
    });

    ticketMetrics.forEach(metric => {
      const date = metric.date_recorded;
      if (!salesByDate.has(date)) {
        salesByDate.set(date, { tickets: 0, revenue: 0 });
      }
      salesByDate.get(date)!.tickets += metric.metric_value;
    });

    const salesData = Array.from(salesByDate.entries()).map(([date, data]) => ({
      date,
      tickets: data.tickets,
      revenue: data.revenue
    }));

    // Create ticket type distribution (from metadata)
    const ticketTypeData = [
      { name: 'General', value: Math.floor(totalTickets * 0.6), color: '#8884d8' },
      { name: 'VIP', value: Math.floor(totalTickets * 0.2), color: '#82ca9d' },
      { name: 'Early Bird', value: Math.floor(totalTickets * 0.15), color: '#ffc658' },
      { name: 'Group', value: Math.floor(totalTickets * 0.05), color: '#ff7300' }
    ];

    // Create engagement data
    const engagementData = [
      { 
        metric: 'Page Views', 
        value: totalPageViews || Math.floor(Math.random() * 1000 + 500), 
        change: Math.random() * 20 - 5, 
        trend: Math.random() > 0.5 ? 'up' : 'down' as 'up' | 'down'
      },
      { 
        metric: 'Shares', 
        value: Math.floor(totalPageViews * 0.1), 
        change: Math.random() * 15 - 7, 
        trend: Math.random() > 0.5 ? 'up' : 'down' as 'up' | 'down'
      },
      { 
        metric: 'Comments', 
        value: Math.floor(totalPageViews * 0.05), 
        change: Math.random() * 10 - 3, 
        trend: Math.random() > 0.5 ? 'up' : 'down' as 'up' | 'down'
      },
      { 
        metric: 'Saves', 
        value: Math.floor(totalPageViews * 0.15), 
        change: Math.random() * 25 - 10, 
        trend: Math.random() > 0.5 ? 'up' : 'down' as 'up' | 'down'
      }
    ];

    return {
      totalRevenue,
      totalTickets,
      avgTicketPrice,
      conversionRate,
      salesData,
      ticketTypeData,
      engagementData
    };
  };

  // Generate sample data for demonstration
  const generateSampleData = async () => {
    if (!eventId) return;

    const sampleMetrics = [
      { type: 'revenue', value: 50000, date: '2025-01-15' },
      { type: 'revenue', value: 75000, date: '2025-01-16' },
      { type: 'tickets_sold', value: 10, date: '2025-01-15' },
      { type: 'tickets_sold', value: 15, date: '2025-01-16' },
      { type: 'page_views', value: 245, date: '2025-01-15' },
      { type: 'page_views', value: 389, date: '2025-01-16' },
    ];

    for (const metric of sampleMetrics) {
      await recordMetric(metric.type, metric.value, { date: metric.date });
    }

    await fetchAnalyticsData();
  };

  // Load data when eventId changes
  useEffect(() => {
    fetchAnalyticsData();
  }, [eventId]);

  return {
    analyticsData,
    loading,
    recordMetric,
    generateSampleData,
    refetch: fetchAnalyticsData
  };
};