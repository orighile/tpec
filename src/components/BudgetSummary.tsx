
import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CreditCard } from "phosphor-react";
import { ExpenseItem } from "@/types/budget";

interface BudgetSummaryProps {
  totalBudget: number;
  expenses: ExpenseItem[];
}

const BudgetSummary = ({ totalBudget, expenses }: BudgetSummaryProps) => {
  // Calculate budget metrics
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = totalBudget - totalExpenses;
  const budgetProgress = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

  // Calculate category totals
  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    
    expenses.forEach((expense) => {
      if (!totals[expense.category]) {
        totals[expense.category] = 0;
      }
      totals[expense.category] += expense.amount;
    });
    
    return totals;
  }, [expenses]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Budget Overview
        </CardTitle>
        <CardDescription>
          Manage your event budget and track expenses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
            <p className="text-2xl font-bold text-primary">₦{totalBudget.toLocaleString()}</p>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-secondary-foreground">₦{totalExpenses.toLocaleString()}</p>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Remaining</p>
            <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-primary' : 'text-destructive'}`}>
              ₦{remainingBudget.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Budget utilization</span>
            <span>{budgetProgress.toFixed(0)}%</span>
          </div>
          <Progress 
            value={budgetProgress > 100 ? 100 : budgetProgress} 
            className={`h-2 ${budgetProgress > 90 ? 'bg-destructive/20' : 'bg-muted'}`}
          />
        </div>

        {/* Category breakdown */}
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium mb-3">Expense Breakdown</h3>
          <div className="space-y-2">
            {Object.entries(categoryTotals).map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between text-sm">
                <span>{category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">₦{amount.toLocaleString()}</span>
                  <span className="text-xs text-gray-500">
                    ({totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetSummary;
