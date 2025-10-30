
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CrewMemberForm from "./CrewMemberForm";
import { MemberFormData } from "./types";

interface AddMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: MemberFormData;
  onFormChange: (newFormData: MemberFormData) => void;
  onAddMember: () => void;
}

const AddMemberDialog = ({ 
  isOpen, 
  onOpenChange, 
  formData, 
  onFormChange, 
  onAddMember 
}: AddMemberDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Crew Member</DialogTitle>
          <DialogDescription>
            Add details about your new party crew member below.
          </DialogDescription>
        </DialogHeader>
        <CrewMemberForm 
          formData={formData} 
          onFormChange={onFormChange}
          onSubmit={onAddMember}
          submitLabel="Add Crew Member"
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
