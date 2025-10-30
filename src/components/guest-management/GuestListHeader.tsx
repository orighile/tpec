
import { Button } from "@/components/ui/button";
import { Filter, UserPlus, Mail, Trash } from "lucide-react";

interface GuestListHeaderProps {
  onAddGuest: () => void;
  onSendInvitations: () => void;
  selectedCount: number;
  onBulkDelete: () => void;
  isSendingInvitation: boolean;
}

const GuestListHeader = ({ 
  onAddGuest, 
  onSendInvitations, 
  selectedCount, 
  onBulkDelete,
  isSendingInvitation 
}: GuestListHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <h2 className="text-2xl font-semibold">Guest List</h2>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={onAddGuest}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Guest
        </Button>
        <Button 
          onClick={onSendInvitations}
          disabled={isSendingInvitation}
          variant="outline"
        >
          <Mail className="mr-2 h-4 w-4" />
          {isSendingInvitation ? 'Sending...' : 'Send Invitations'}
        </Button>
        {selectedCount > 0 && (
          <Button 
            onClick={onBulkDelete}
            variant="destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Selected ({selectedCount})
          </Button>
        )}
      </div>
    </div>
  );
};

export default GuestListHeader;
