import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PartyCrewMember } from "@/components/jarabot";

export interface CrewMemberData {
  name: string;
  role: string;
  contact: string;
  email?: string;
  phone?: string;
  notes?: string;
  tasks: string[];
  eventId?: string;
}

export const useCrewManagement = (eventId?: string) => {
  const { toast } = useToast();
  const [crewMembers, setCrewMembers] = useState<PartyCrewMember[]>([]);
  const [loading, setLoading] = useState(false);

  // In a real implementation, this would fetch from Supabase
  // For now, we'll use local state management with persistence to localStorage
  useEffect(() => {
    const fetchCrewMembers = async () => {
      if (!eventId) return;
      
      setLoading(true);
      try {
        // For demo, load from localStorage
        const stored = localStorage.getItem(`crew-members-${eventId}`);
        if (stored) {
          setCrewMembers(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Error loading crew members:", error);
        toast({
          title: "Error",
          description: "Failed to load crew members",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCrewMembers();
  }, [eventId, toast]);

  const addCrewMember = async (memberData: CrewMemberData) => {
    try {
      const newMember: PartyCrewMember = {
        id: `crew-${Date.now()}`,
        userId: `user-${Date.now()}`,
        name: memberData.name,
        role: memberData.role,
        contact: memberData.contact,
        tasks: memberData.tasks,
        avatarUrl: "/placeholder.svg",
      };

      const updatedMembers = [...crewMembers, newMember];
      setCrewMembers(updatedMembers);
      
      // Persist to localStorage for demo
      if (eventId) {
        localStorage.setItem(`crew-members-${eventId}`, JSON.stringify(updatedMembers));
      }

      toast({
        title: "Success",
        description: "Crew member added successfully",
      });
      
      return newMember;
    } catch (error) {
      console.error("Error adding crew member:", error);
      toast({
        title: "Error",
        description: "Failed to add crew member",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCrewMember = async (id: string, memberData: Partial<CrewMemberData>) => {
    try {
      const updatedMembers = crewMembers.map(member =>
        member.id === id ? { ...member, ...memberData } : member
      );
      
      setCrewMembers(updatedMembers);
      
      // Persist to localStorage for demo
      if (eventId) {
        localStorage.setItem(`crew-members-${eventId}`, JSON.stringify(updatedMembers));
      }

      toast({
        title: "Success",
        description: "Crew member updated successfully",
      });
    } catch (error) {
      console.error("Error updating crew member:", error);
      toast({
        title: "Error",
        description: "Failed to update crew member",
        variant: "destructive",
      });
      throw error;
    }
  };

  const removeCrewMember = async (id: string) => {
    try {
      const updatedMembers = crewMembers.filter(member => member.id !== id);
      setCrewMembers(updatedMembers);
      
      // Persist to localStorage for demo
      if (eventId) {
        localStorage.setItem(`crew-members-${eventId}`, JSON.stringify(updatedMembers));
      }

      toast({
        title: "Success",
        description: "Crew member removed successfully",
      });
    } catch (error) {
      console.error("Error removing crew member:", error);
      toast({
        title: "Error",
        description: "Failed to remove crew member",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    crewMembers,
    loading,
    addCrewMember,
    updateCrewMember,
    removeCrewMember,
  };
};