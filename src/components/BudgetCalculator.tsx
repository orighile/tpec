
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExpenseItem, ExpenseFilter } from "@/types/budget";
import BudgetSummary from "./BudgetSummary";
import ExpenseFilters from "./ExpenseFilters";
import AddExpenseForm from "./AddExpenseForm";
import ExpenseList from "./ExpenseList";
import BudgetUpdateForm from "./BudgetUpdateForm";

// Common expense categories for events
const expenseCategories = [
  "Venue",
  "Catering",
  "Decoration",
  "Entertainment",
  "Photography",
  "Transportation",
  "Attire",
  "Stationery",
  "Gifts",
  "Other"
];

const defaultExpenses: ExpenseItem[] = [
  {
    id: "1",
    category: "Venue",
    description: "Venue deposit",
    amount: 2000,
    paid: false,
  },
  {
    id: "2",
    category: "Catering",
    description: "Food and drinks",
    amount: 1500,
    paid: false,
  },
  {
    id: "3",
    category: "Decoration",
    description: "Flowers and décor",
    amount: 800,
    paid: false,
  },
];

const BudgetCalculator = () => {
  const { toast } = useToast();
  const [totalBudget, setTotalBudget] = useState<number>(5000);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(defaultExpenses);
  
  // Add filter state
  const [filters, setFilters] = useState<ExpenseFilter>({
    category: "all",
    paidStatus: "all",
    search: "",
  });

  // Calculate paid expenses
  const totalPaid = expenses
    .filter((expense) => expense.paid)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const addExpense = (category: string, description: string, amount: number) => {
    setExpenses([
      ...expenses,
      {
        id: crypto.randomUUID(),
        category,
        description,
        amount,
        paid: false,
      },
    ]);
  };

  const togglePaidStatus = (id: string) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === id ? { ...expense, paid: !expense.paid } : expense
      )
    );
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
    toast({
      title: "Expense removed",
      description: "The expense has been removed from your budget.",
    });
  };

  const clearAllExpenses = () => {
    if (expenses.length > 0) {
      if (confirm("Are you sure you want to clear all expenses?")) {
        setExpenses([]);
        toast({
          title: "Expenses cleared",
          description: "All expenses have been removed.",
        });
      }
    } else {
      toast({
        title: "No expenses",
        description: "There are no expenses to clear.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Budget Overview
          </CardTitle>
          <CardDescription>
            Manage your event budget and track expenses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <BudgetSummary totalBudget={totalBudget} expenses={expenses} />
          
          <BudgetUpdateForm 
            totalBudget={totalBudget} 
            onBudgetUpdate={setTotalBudget} 
          />

          <AddExpenseForm 
            onAddExpense={addExpense} 
            expenseCategories={expenseCategories} 
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Expense List</CardTitle>
            <CardDescription>
              {expenses.length} expense{expenses.length !== 1 ? "s" : ""} (₦{totalPaid.toLocaleString()} paid)
            </CardDescription>
          </div>
          <ExpenseFilters 
            filters={filters} 
            onFilterChange={setFilters} 
            categories={expenseCategories} 
          />
        </CardHeader>
        <CardContent>
          <ExpenseList 
            expenses={expenses} 
            filters={filters} 
            onTogglePaid={togglePaidStatus} 
            onRemoveExpense={removeExpense} 
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            {expenses.filter(e => e.paid).length} of {expenses.length} expenses paid
          </div>
          <Button 
            variant="outline" 
            onClick={clearAllExpenses}
          >
            Clear All
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BudgetCalculator;
