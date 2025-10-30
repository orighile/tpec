
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";

interface EmptyCrewStateProps {
  searchTerm: string;
  onAddMember: () => void;
}

const EmptyCrewState = ({ searchTerm, onAddMember }: EmptyCrewStateProps) => {
  return (
    <div className="col-span-full text-center py-12 border rounded-lg">
      <Users className="h-12 w-12 mx-auto text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">No crew members found</h3>
      <p className="mt-2 text-muted-foreground">
        {searchTerm 
          ? "Try adjusting your search criteria" 
          : "Add your first crew member to get started"}
      </p>
      <Button 
        className="mt-4" 
        onClick={onAddMember}
      >
        <UserPlus className="mr-2 h-4 w-4" /> Add Crew Member
      </Button>
    </div>
  );
};

export default EmptyCrewState;
