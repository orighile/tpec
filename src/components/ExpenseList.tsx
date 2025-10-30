
import { Button } from "@/components/ui/button";
import { Trash } from "phosphor-react";
import { ExpenseItem, ExpenseFilter } from "@/types/budget";

interface ExpenseListProps {
  expenses: ExpenseItem[];
  filters: ExpenseFilter;
  onTogglePaid: (id: string) => void;
  onRemoveExpense: (id: string) => void;
}

const ExpenseList = ({ 
  expenses, 
  filters, 
  onTogglePaid, 
  onRemoveExpense 
}: ExpenseListProps) => {
  
  // Filter expenses based on criteria
  const filteredExpenses = expenses.filter((expense) => {
    // Filter by category
    if (filters.category !== "all" && expense.category !== filters.category) {
      return false;
    }
    
    // Filter by paid status
    if (filters.paidStatus === "paid" && !expense.paid) {
      return false;
    }
    if (filters.paidStatus === "unpaid" && expense.paid) {
      return false;
    }
    
    // Filter by search term
    if (filters.search && 
        !expense.description.toLowerCase().includes(filters.search.toLowerCase()) &&
        !expense.category.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-8 bg-slate-50 p-3 font-medium text-sm">
        <div className="col-span-2">Category</div>
        <div className="col-span-3">Description</div>
        <div className="col-span-1 text-right">Amount</div>
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-1 text-center">Action</div>
      </div>
      
      {filteredExpenses.length > 0 ? (
        <div className="divide-y">
          {filteredExpenses.map((expense) => (
            <div key={expense.id} className="grid grid-cols-8 p-3 text-sm items-center">
              <div className="col-span-2 font-medium">{expense.category}</div>
              <div className="col-span-3">{expense.description}</div>
              <div className="col-span-1 text-right">₦{expense.amount.toLocaleString()}</div>
              <div className="col-span-1 text-center">
                <Button
                  variant={expense.paid ? "default" : "outline"}
                  size="sm"
                  onClick={() => onTogglePaid(expense.id)}
                  className={`text-xs px-2 py-1 h-auto ${
                    expense.paid
                      ? "bg-green-600 hover:bg-green-700"
                      : "text-gray-600"
                  }`}
                >
                  {expense.paid ? "Paid" : "Unpaid"}
                </Button>
              </div>
              <div className="col-span-1 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveExpense(expense.id)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">
          {expenses.length > 0 
            ? "No expenses match your filters. Try adjusting your search criteria."
            : "No expenses yet. Add some expenses to track your budget."
          }
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
