
import { Button } from "@/components/ui/button";

interface EmptyVendorStateProps {
  onResetFilters: () => void;
}

const EmptyVendorState = ({ onResetFilters }: EmptyVendorStateProps) => {
  return (
    <div className="text-center py-12 border rounded-lg">
      <h3 className="text-lg font-medium">No vendors found</h3>
      <p className="mt-2 text-muted-foreground">
        Try adjusting your search filters or criteria
      </p>
      <Button 
        className="mt-4" 
        onClick={onResetFilters}
      >
        Reset All Filters
      </Button>
    </div>
  );
};

export default EmptyVendorState;
