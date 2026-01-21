import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, Calendar, Users, Crown } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminData } from '@/hooks/useAdminData';
import { AdminStats } from '@/components/admin/AdminStats';
import { BookingsTable } from '@/components/admin/BookingsTable';
import { UsersTable } from '@/components/admin/UsersTable';
import { PrimeMembersTable } from '@/components/admin/PrimeMembersTable';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: authLoading, user } = useAdminAuth();
  const {
    bookings,
    users,
    primeMembers,
    isLoading: dataLoading,
    updateBookingStatus,
    deleteBooking,
    togglePrimeMemberStatus,
  } = useAdminData();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    } else if (!authLoading && user && !isAdmin) {
      navigate('/');
    }
  }, [authLoading, user, isAdmin, navigate]);

  if (authLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const activePrimeMembers = primeMembers.filter((m) => m.is_active).length;

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage bookings, users, and subscriptions</p>
          </div>
        </div>

        {dataLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : (
          <AdminStats
            totalUsers={users.length}
            totalBookings={bookings.length}
            totalPrimeMembers={primeMembers.length}
            activePrimeMembers={activePrimeMembers}
          />
        )}

        <Tabs defaultValue="bookings" className="mt-8">
          <TabsList>
            <TabsTrigger value="bookings" className="gap-2">
              <Calendar className="h-4 w-4" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="prime" className="gap-2">
              <Crown className="h-4 w-4" />
              Prime Members
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Consultation Bookings</CardTitle>
                <CardDescription>
                  Manage all consultation booking requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <Skeleton className="h-64" />
                ) : (
                  <BookingsTable
                    bookings={bookings}
                    onUpdateStatus={(id, status) => updateBookingStatus.mutate({ id, status })}
                    onDelete={(id) => deleteBooking.mutate(id)}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
                <CardDescription>View all registered user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <Skeleton className="h-64" />
                ) : (
                  <UsersTable users={users} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prime" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Prime Members</CardTitle>
                <CardDescription>
                  Manage vendor and planner Prime subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <Skeleton className="h-64" />
                ) : (
                  <PrimeMembersTable
                    members={primeMembers}
                    onToggleStatus={(id, isActive) =>
                      togglePrimeMemberStatus.mutate({ id, isActive })
                    }
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;
