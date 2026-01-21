import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ConsultationBooking {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  consultation_type: string;
  event_type: string | null;
  booking_date: string;
  booking_time: string;
  message: string | null;
  status: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  role: string | null;
}

export interface PrimeMember {
  id: string;
  user_id: string;
  business_name: string;
  membership_type: string;
  category: string | null;
  location: string | null;
  is_active: boolean;
  payment_status: string | null;
  subscription_tier: string | null;
  created_at: string;
}

export const useAdminData = () => {
  const queryClient = useQueryClient();

  // Fetch consultation bookings
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('consultation_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ConsultationBooking[];
    },
  });

  // Fetch user profiles
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserProfile[];
    },
  });

  // Fetch prime members
  const { data: primeMembers = [], isLoading: primeMembersLoading } = useQuery({
    queryKey: ['admin-prime-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prime_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PrimeMember[];
    },
  });

  // Update booking status
  const updateBookingStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('consultation_bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success('Booking status updated');
    },
    onError: (error) => {
      toast.error('Failed to update booking: ' + error.message);
    },
  });

  // Delete booking
  const deleteBooking = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('consultation_bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success('Booking deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete booking: ' + error.message);
    },
  });

  // Toggle prime member active status
  const togglePrimeMemberStatus = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('prime_members')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-prime-members'] });
      toast.success('Prime member status updated');
    },
    onError: (error) => {
      toast.error('Failed to update member: ' + error.message);
    },
  });

  return {
    bookings,
    users,
    primeMembers,
    isLoading: bookingsLoading || usersLoading || primeMembersLoading,
    updateBookingStatus,
    deleteBooking,
    togglePrimeMemberStatus,
  };
};
