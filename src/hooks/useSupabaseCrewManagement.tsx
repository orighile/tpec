import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CrewMemberData {
  id?: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  tasks?: string[];
  notes?: string;
}

// Helper to transform DB data to CrewMemberData
const transformCrewMember = (dbData: any): CrewMemberData => ({
  id: dbData.id,
  name: dbData.name,
  role: dbData.role || '',
  email: dbData.email,
  phone: dbData.phone,
  tasks: [],
  notes: dbData.notes,
});

export const useSupabaseCrewManagement = (eventId?: string) => {
  const [crewMembers, setCrewMembers] = useState<CrewMemberData[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch crew members from database
  const fetchCrewMembers = async () => {
    if (!eventId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('crew_members')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setCrewMembers((data || []).map(transformCrewMember));
    } catch (error) {
      console.error('Error fetching crew members:', error);
      toast({
        title: "Error",
        description: "Failed to load crew members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add crew member to database
  const addCrewMember = async (memberData: Omit<CrewMemberData, 'id'>) => {
    if (!eventId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('crew_members')
        .insert({
          event_id: eventId,
          user_id: user.id,
          name: memberData.name,
          role: memberData.role,
          email: memberData.email,
          phone: memberData.phone,
          tasks: memberData.tasks
        })
        .select()
        .single();

      if (error) throw error;

      setCrewMembers(prev => [...prev, transformCrewMember(data)]);
      toast({
        title: "Success",
        description: "Crew member added successfully",
      });
    } catch (error) {
      console.error('Error adding crew member:', error);
      toast({
        title: "Error",
        description: "Failed to add crew member",
        variant: "destructive",
      });
    }
  };

  // Update crew member in database
  const updateCrewMember = async (id: string, memberData: Partial<CrewMemberData>) => {
    try {
      const { data, error } = await supabase
        .from('crew_members')
        .update({
          name: memberData.name,
          role: memberData.role,
          email: memberData.email,
          phone: memberData.phone,
          tasks: memberData.tasks
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCrewMembers(prev => 
        prev.map(member => member.id === id ? transformCrewMember(data) : member)
      );
      toast({
        title: "Success",
        description: "Crew member updated successfully",
      });
    } catch (error) {
      console.error('Error updating crew member:', error);
      toast({
        title: "Error",
        description: "Failed to update crew member",
        variant: "destructive",
      });
    }
  };

  // Remove crew member from database
  const removeCrewMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('crew_members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCrewMembers(prev => prev.filter(member => member.id !== id));
      toast({
        title: "Success",
        description: "Crew member removed successfully",
      });
    } catch (error) {
      console.error('Error removing crew member:', error);
      toast({
        title: "Error",
        description: "Failed to remove crew member",
        variant: "destructive",
      });
    }
  };

  // Load data when eventId changes
  useEffect(() => {
    fetchCrewMembers();
  }, [eventId]);

  return {
    crewMembers,
    loading,
    addCrewMember,
    updateCrewMember,
    removeCrewMember,
    refetch: fetchCrewMembers
  };
};