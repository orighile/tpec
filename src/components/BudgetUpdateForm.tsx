
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BudgetUpdateFormProps {
  totalBudget: number;
  onBudgetUpdate: (budget: number) => void;
}

const BudgetUpdateForm = ({ totalBudget, onBudgetUpdate }: BudgetUpdateFormProps) => {
  const { toast } = useToast();
  
  const handleUpdateBudget = () => {
    toast({
      title: "Budget updated",
      description: `Your budget has been updated to ₦${totalBudget.toLocaleString()}.`,
    });
    onBudgetUpdate(totalBudget);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Update Total Budget</h3>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            type="number"
            value={totalBudget}
            onChange={(e) => onBudgetUpdate(Number(e.target.value))}
            placeholder="Enter your total budget"
            className="w-full"
          />
        </div>
        <Button onClick={handleUpdateBudget}>
          Update
        </Button>
      </div>
    </div>
  );
};

export default BudgetUpdateForm;
