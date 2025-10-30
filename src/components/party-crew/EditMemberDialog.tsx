
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PartyCrewMember } from "@/components/jarabot";
import CrewMemberForm from "./CrewMemberForm";
import { MemberFormData } from "./types";

interface EditMemberDialogProps {
  editingMember: PartyCrewMember | null;
  onCloseDialog: () => void;
  formData: MemberFormData;
  onFormChange: (newFormData: MemberFormData) => void;
  onUpdateMember: () => void;
}

const EditMemberDialog = ({ 
  editingMember, 
  onCloseDialog,
  formData, 
  onFormChange, 
  onUpdateMember 
}: EditMemberDialogProps) => {
  return (
    <Dialog open={!!editingMember} onOpenChange={(open) => !open && onCloseDialog()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Crew Member</DialogTitle>
          <DialogDescription>
            Update information for {editingMember?.name}
          </DialogDescription>
        </DialogHeader>
        <CrewMemberForm 
          formData={formData} 
          onFormChange={onFormChange}
          onSubmit={onUpdateMember}
          submitLabel="Update Crew Member"
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberDialog;
