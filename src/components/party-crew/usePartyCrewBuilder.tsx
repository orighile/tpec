
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { PartyCrewMember } from "@/components/jarabot";
import { MemberFormData, DEFAULT_MEMBER_FORM } from "./types";
import { supabase } from "@/integrations/supabase/client";

export const usePartyCrewBuilder = (eventId?: string) => {
  const { toast } = useToast();
  const [crewMembers, setCrewMembers] = useState<PartyCrewMember[]>([]);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editingMember, setEditingMember] = useState<PartyCrewMember | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [memberForm, setMemberForm] = useState<MemberFormData>({ ...DEFAULT_MEMBER_FORM });
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {}
  });

  const handleAddCrewMember = () => {
    if (!memberForm.name || !memberForm.role) {
      toast({
        title: "Missing information",
        description: "Please provide at least the member's name and role.",
        variant: "destructive",
      });
      return;
    }

    const filteredTasks = memberForm.tasks.filter(task => task.trim() !== "");

    const newMember: PartyCrewMember = {
      id: crypto.randomUUID(),
      userId: `user${Math.floor(Math.random() * 1000)}`,
      name: memberForm.name,
      role: memberForm.role,
      avatarUrl: "/placeholder.svg",
      tasks: filteredTasks,
      contact: memberForm.contact
    };

    setCrewMembers([...crewMembers, newMember]);
    setMemberForm({ ...DEFAULT_MEMBER_FORM });
    setIsAddingMember(false);

    toast({
      title: "Crew member added",
      description: `${newMember.name} has been added to your party crew.`,
    });
  };

  const handleEditCrewMember = () => {
    if (!editingMember) return;
    
    if (!memberForm.name || !memberForm.role) {
      toast({
        title: "Missing information",
        description: "Please provide at least the member's name and role.",
        variant: "destructive",
      });
      return;
    }

    const filteredTasks = memberForm.tasks.filter(task => task.trim() !== "");

    const updatedMember: PartyCrewMember = {
      ...editingMember,
      name: memberForm.name,
      role: memberForm.role,
      tasks: filteredTasks,
      contact: memberForm.contact
    };

    setCrewMembers(crewMembers.map(member => 
      member.id === editingMember.id ? updatedMember : member
    ));

    setEditingMember(null);
    setMemberForm({ ...DEFAULT_MEMBER_FORM });

    toast({
      title: "Crew member updated",
      description: `${updatedMember.name}'s information has been updated.`,
    });
  };

  const handleRemoveCrewMember = (id: string) => {
    const memberToRemove = crewMembers.find(member => member.id === id);
    if (!memberToRemove) return;
    
    setConfirmDialog({
      open: true,
      title: "Remove Crew Member",
      description: `Are you sure you want to remove ${memberToRemove.name} from your party crew? This action cannot be undone.`,
      onConfirm: () => {
        setCrewMembers(crewMembers.filter(member => member.id !== id));
        toast({
          title: "Crew member removed",
          description: `${memberToRemove.name} has been removed from your party crew.`,
        });
      }
    });
  };

  const startEditingMember = (member: PartyCrewMember) => {
    setEditingMember(member);
    setMemberForm({
      name: member.name,
      role: member.role,
      contact: member.contact,
      tasks: member.tasks.length > 0 ? member.tasks : [""]
    });
  };

  const handleShareCrew = () => {
    toast({
      title: "Crew information shared",
      description: "Your party crew information has been shared successfully.",
    });
  };

  const handleContactMember = (member: PartyCrewMember) => {
    if (!member.contact) {
      toast({
        title: "Missing contact information",
        description: "This crew member doesn't have contact information.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingEmail(true);
    
    setTimeout(() => {
      setIsSendingEmail(false);
      toast({
        title: "Message sent",
        description: `Your message has been sent to ${member.name} at ${member.contact}.`,
      });
    }, 1500);
  };

  return {
    crewMembers,
    isAddingMember,
    setIsAddingMember,
    editingMember,
    setEditingMember,
    searchTerm,
    setSearchTerm,
    isSendingEmail,
    memberForm,
    setMemberForm,
    confirmDialog,
    setConfirmDialog,
    handleAddCrewMember,
    handleEditCrewMember,
    handleRemoveCrewMember,
    startEditingMember,
    handleShareCrew,
    handleContactMember
  };
};
