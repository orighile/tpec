import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, Crown, TrendingUp } from 'lucide-react';

interface AdminStatsProps {
  totalUsers: number;
  totalBookings: number;
  totalPrimeMembers: number;
  activePrimeMembers: number;
}

export const AdminStats = ({
  totalUsers,
  totalBookings,
  totalPrimeMembers,
  activePrimeMembers,
}: AdminStatsProps) => {
  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      description: 'Registered accounts',
    },
    {
      title: 'Consultation Bookings',
      value: totalBookings,
      icon: Calendar,
      description: 'Total bookings',
    },
    {
      title: 'Prime Members',
      value: totalPrimeMembers,
      icon: Crown,
      description: `${activePrimeMembers} active`,
    },
    {
      title: 'Conversion Rate',
      value: totalUsers > 0 ? `${((totalPrimeMembers / totalUsers) * 100).toFixed(1)}%` : '0%',
      icon: TrendingUp,
      description: 'Users to Prime',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
