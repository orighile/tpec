
import { PartyCrewMember } from "@/components/jarabot";
import CrewMemberCard from "./CrewMemberCard";
import EmptyCrewState from "./EmptyCrewState";

interface CrewMemberListProps {
  crewMembers: PartyCrewMember[];
  searchTerm: string;
  isSendingEmail: boolean;
  onEditMember: (member: PartyCrewMember) => void;
  onRemoveMember: (id: string) => void;
  onContactMember: (member: PartyCrewMember) => void;
  onAddMember: () => void;
}

const CrewMemberList = ({ 
  crewMembers, 
  searchTerm, 
  isSendingEmail,
  onEditMember, 
  onRemoveMember, 
  onContactMember,
  onAddMember
}: CrewMemberListProps) => {
  
  const filteredCrewMembers = crewMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredCrewMembers.length === 0) {
    return <EmptyCrewState searchTerm={searchTerm} onAddMember={onAddMember} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCrewMembers.map((member) => (
        <CrewMemberCard 
          key={member.id}
          member={member}
          onEdit={onEditMember}
          onRemove={onRemoveMember}
          onContact={onContactMember}
          isSendingEmail={isSendingEmail}
        />
      ))}
    </div>
  );
};

export default CrewMemberList;
