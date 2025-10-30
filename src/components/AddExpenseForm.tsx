
import { useState } from "react";
import { Plus } from "phosphor-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { ExpenseCategory } from "@/types/budget";

interface AddExpenseFormProps {
  onAddExpense: (category: string, description: string, amount: number) => void;
  expenseCategories: string[];
}

const AddExpenseForm = ({ onAddExpense, expenseCategories }: AddExpenseFormProps) => {
  const { toast } = useToast();
  const [newExpense, setNewExpense] = useState<{
    category: string;
    description: string;
    amount: number;
  }>({
    category: "",
    description: "",
    amount: 0,
  });

  const handleAddExpense = () => {
    if (!newExpense.category || !newExpense.description || newExpense.amount <= 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields with valid values.",
        variant: "destructive",
      });
      return;
    }

    onAddExpense(
      newExpense.category,
      newExpense.description,
      newExpense.amount
    );
    
    setNewExpense({
      category: "",
      description: "",
      amount: 0,
    });
    
    toast({
      title: "Expense added",
      description: `${newExpense.description} has been added to your budget.`,
    });
  };

  return (
    <div className="pt-4">
      <h3 className="font-medium mb-3">Add New Expense</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select 
            value={newExpense.category} 
            onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {expenseCategories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={newExpense.description}
            onChange={(e) =>
              setNewExpense({ ...newExpense, description: e.target.value })
            }
            placeholder="Describe the expense"
          />
        </div>
        <div>
          <Label htmlFor="amount">Amount (₦)</Label>
          <Input
            id="amount"
            type="number"
            value={newExpense.amount || ""}
            onChange={(e) =>
              setNewExpense({
                ...newExpense,
                amount: Number(e.target.value),
              })
            }
            placeholder="Enter amount"
          />
        </div>
      </div>
      <Button onClick={handleAddExpense} className="mt-3 w-full md:w-auto">
        <Plus className="h-4 w-4 mr-2" />
        Add Expense
      </Button>
    </div>
  );
};

export default AddExpenseForm;
