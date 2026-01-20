
import { useState, useMemo } from 'react';
import { useSupabaseGuests } from '@/hooks/useSupabaseGuests';
import { Guest, NewGuestForm, UpdateGuestForm, GuestRsvpStatus } from './types';
import { useToast } from '@/hooks/use-toast';

// Sample demo data for first-time visitors
const DEMO_GUESTS: Guest[] = [
  {
    id: 'demo-1',
    event_id: 'sample-event-id',
    full_name: 'Adaeze Okonkwo',
    email: 'adaeze@example.com',
    phone: '+234 801 234 5678',
    rsvp_status: 'confirmed',
    plus_one: true,
    meal_preference: 'Nigerian Jollof',
    notes: 'Bride\'s sister',
    guest_group: 'Family',
    table_assignment: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    event_id: 'sample-event-id',
    full_name: 'Chukwuemeka Eze',
    email: 'chukwuemeka@example.com',
    phone: '+234 802 345 6789',
    rsvp_status: 'confirmed',
    plus_one: false,
    meal_preference: 'Vegetarian',
    notes: 'University friend',
    guest_group: 'Friends',
    table_assignment: '2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    event_id: 'sample-event-id',
    full_name: 'Ngozi Abubakar',
    email: 'ngozi@example.com',
    phone: '+234 803 456 7890',
    rsvp_status: 'pending',
    plus_one: true,
    meal_preference: 'No Preference',
    notes: 'Work colleague',
    guest_group: 'Work',
    table_assignment: '3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-4',
    event_id: 'sample-event-id',
    full_name: 'Oluwaseun Adeleke',
    email: 'seun@example.com',
    phone: '+234 804 567 8901',
    rsvp_status: 'declined',
    plus_one: false,
    meal_preference: 'Seafood',
    notes: 'Cousin - traveling abroad',
    guest_group: 'Family',
    table_assignment: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-5',
    event_id: 'sample-event-id',
    full_name: 'Funke Balogun',
    email: 'funke@example.com',
    phone: '+234 805 678 9012',
    rsvp_status: 'confirmed',
    plus_one: true,
    meal_preference: 'Nigerian Jollof',
    notes: 'Best friend since childhood',
    guest_group: 'Friends',
    table_assignment: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-6',
    event_id: 'sample-event-id',
    full_name: 'Ibrahim Yusuf',
    email: 'ibrahim@example.com',
    phone: '+234 806 789 0123',
    rsvp_status: 'pending',
    plus_one: false,
    meal_preference: 'Halal',
    notes: 'Business partner',
    guest_group: 'Work',
    table_assignment: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const useGuestManager = (eventId: string) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<GuestRsvpStatus | 'all'>('all');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isSendingInvitation, setIsSendingInvitation] = useState(false);

  const { toast } = useToast();
  const {
    useEventGuests,
    createGuest,
    updateGuest,
    deleteGuest,
    sendInvitation
  } = useSupabaseGuests(eventId);

  // Use the query hook - but handle placeholder event IDs gracefully
  const isPlaceholderEvent = eventId === "sample-event-id" || !eventId;
  const { data: dbGuests = [], isLoading: loading, error } = useEventGuests();
  
  // For demo purposes, use sample data if it's a placeholder event
  const guests = isPlaceholderEvent ? DEMO_GUESTS : dbGuests;
  const effectiveLoading = isPlaceholderEvent ? false : loading;

  const handleAddGuest = async (guestData: NewGuestForm) => {
    try {
      await createGuest.mutateAsync({ ...guestData, event_id: eventId });
      setShowAddDialog(false);
      toast({
        title: "Success",
        description: "Guest added successfully",
      });
    } catch (error) {
      console.error('Error adding guest:', error);
      toast({
        title: "Error",
        description: "Failed to add guest",
        variant: "destructive",
      });
    }
  };

  const handleEditGuest = async (guestData: UpdateGuestForm) => {
    if (!editingGuest) return;
    
    try {
      await updateGuest.mutateAsync({ id: editingGuest.id, updates: guestData });
      setShowEditDialog(false);
      setEditingGuest(null);
      toast({
        title: "Success",
        description: "Guest updated successfully",
      });
    } catch (error) {
      console.error('Error updating guest:', error);
      toast({
        title: "Error",
        description: "Failed to update guest",
        variant: "destructive",
      });
    }
  };

  const handleRemoveGuest = async (guestId: string) => {
    try {
      await deleteGuest.mutateAsync(guestId);
      toast({
        title: "Success",
        description: "Guest removed successfully",
      });
    } catch (error) {
      console.error('Error removing guest:', error);
      toast({
        title: "Error",
        description: "Failed to remove guest",
        variant: "destructive",
      });
    }
  };

  const getFilteredGuests = () => {
    return guests.filter(guest => {
      const matchesSearch = guest.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || guest.rsvp_status === filterStatus;
      const matchesGroup = filterGroup === 'all' || guest.guest_group === filterGroup;
      
      return matchesSearch && matchesStatus && matchesGroup;
    });
  };

  const getRsvpStats = () => {
    const stats = guests.reduce((acc, guest) => {
      const status = guest.rsvp_status as GuestRsvpStatus;
      acc[status] = (acc[status] || 0) + 1;
      acc.total += 1;
      if (guest.plus_one) acc.plusOnes += 1;
      return acc;
    }, {
      pending: 0,
      confirmed: 0,
      declined: 0,
      total: 0,
      plusOnes: 0
    });

    return stats;
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedGuests.map(id => deleteGuest.mutateAsync(id)));
      setSelectedGuests([]);
      toast({
        title: "Success",
        description: `${selectedGuests.length} guests removed successfully`,
      });
    } catch (error) {
      console.error('Error in bulk delete:', error);
      toast({
        title: "Error",
        description: "Failed to remove guests",
        variant: "destructive",
      });
    }
  };

  const handleSendInvitations = async () => {
    setIsSendingInvitation(true);
    try {
      // Simulate sending invitations
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Success",
        description: "Invitations sent successfully",
      });
    } catch (error) {
      console.error('Error sending invitations:', error);
      toast({
        title: "Error",
        description: "Failed to send invitations",
        variant: "destructive",
      });
    } finally {
      setIsSendingInvitation(false);
    }
  };

  return {
    guests,
    loading: effectiveLoading,
    error,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterGroup,
    setFilterGroup,
    selectedGuests,
    setSelectedGuests,
    editingGuest,
    setEditingGuest,
    showAddDialog,
    setShowAddDialog,
    showEditDialog,
    setShowEditDialog,
    isSendingInvitation,
    handleAddGuest,
    handleEditGuest,
    handleRemoveGuest,
    handleBulkDelete,
    handleSendInvitations,
    getFilteredGuests,
    getRsvpStats,
  };
};
