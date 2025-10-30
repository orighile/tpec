import { Users, UserPlus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePartyCrewBuilder } from "./usePartyCrewBuilder";
import AddMemberDialog from "./AddMemberDialog";
import EditMemberDialog from "./EditMemberDialog";
import CrewMemberList from "./CrewMemberList";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { DEFAULT_MEMBER_FORM } from "./types";

const PartyCrewBuilder = () => {
  const {
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
  } = usePartyCrewBuilder();

  const filteredCrewMembers = crewMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Party Crew Builder</h2>
          <p className="text-muted-foreground">Build and manage your event planning team</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setIsAddingMember(true)}>
            <UserPlus className="mr-2 h-4 w-4" /> Add Crew Member
          </Button>
          
          <Button variant="outline" onClick={handleShareCrew}>
            <Share2 className="mr-2 h-4 w-4" /> Share Crew
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search crew members..."
            className="pl-8 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-2">
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredCrewMembers.length} crew members
        </div>
      </div>
      
      <CrewMemberList
        crewMembers={crewMembers}
        searchTerm={searchTerm}
        isSendingEmail={isSendingEmail}
        onEditMember={startEditingMember}
        onRemoveMember={handleRemoveCrewMember}
        onContactMember={handleContactMember}
        onAddMember={() => {
          setSearchTerm("");
          setIsAddingMember(true);
        }}
      />
      
      <AddMemberDialog
        isOpen={isAddingMember}
        onOpenChange={setIsAddingMember}
        formData={memberForm}
        onFormChange={setMemberForm}
        onAddMember={handleAddCrewMember}
      />
      
      <EditMemberDialog
        editingMember={editingMember}
        onCloseDialog={() => setEditingMember(null)}
        formData={memberForm}
        onFormChange={setMemberForm}
        onUpdateMember={handleEditCrewMember}
      />

      <ConfirmationDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={confirmDialog.onConfirm}
        confirmText="Remove"
        variant="destructive"
      />
    </div>
  );
};

export default PartyCrewBuilder;
