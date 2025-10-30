import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface BudgetItem {
  id: string;
  category: string;
  description: string;
  budgeted_amount: number;
  actual_amount?: number;
  status: 'planned' | 'confirmed' | 'paid';
  vendor_id?: string;
  event_id?: string;
  notes?: string;
  created_at: string;
}

export interface BudgetSummary {
  total_budget: number;
  total_spent: number;
  total_planned: number;
  remaining_budget: number;
  categories: {
    [key: string]: {
      budgeted: number;
      spent: number;
      remaining: number;
    };
  };
}

export const useBudgetManagement = (eventId?: string) => {
  const { toast } = useToast();
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Load budget data from localStorage for demo
  useEffect(() => {
    if (!eventId) return;
    
    const loadBudgetData = () => {
      try {
        const storedItems = localStorage.getItem(`budget-items-${eventId}`);
        const storedTotal = localStorage.getItem(`budget-total-${eventId}`);
        
        if (storedItems) {
          setBudgetItems(JSON.parse(storedItems));
        }
        if (storedTotal) {
          setTotalBudget(parseFloat(storedTotal));
        }
      } catch (error) {
        console.error("Error loading budget data:", error);
      }
    };

    loadBudgetData();
  }, [eventId]);

  // Save data to localStorage
  const saveData = () => {
    if (!eventId) return;
    
    try {
      localStorage.setItem(`budget-items-${eventId}`, JSON.stringify(budgetItems));
      localStorage.setItem(`budget-total-${eventId}`, totalBudget.toString());
    } catch (error) {
      console.error("Error saving budget data:", error);
    }
  };

  // Create a new budget item
  const addBudgetItem = async (itemData: {
    category: string;
    description: string;
    budgeted_amount: number;
    vendor_id?: string;
    notes?: string;
  }) => {
    try {
      const newItem: BudgetItem = {
        id: `budget-${Date.now()}`,
        ...itemData,
        status: 'planned',
        event_id: eventId,
        created_at: new Date().toISOString(),
      };

      setBudgetItems(prev => [...prev, newItem]);
      
      toast({
        title: "Success",
        description: "Budget item added successfully",
      });

      return newItem;
    } catch (error) {
      console.error('Error adding budget item:', error);
      toast({
        title: "Error",
        description: "Failed to add budget item",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update a budget item
  const updateBudgetItem = async (id: string, updates: Partial<BudgetItem>) => {
    try {
      setBudgetItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ));

      toast({
        title: "Success",
        description: "Budget item updated successfully",
      });
    } catch (error) {
      console.error('Error updating budget item:', error);
      toast({
        title: "Error",
        description: "Failed to update budget item",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Delete a budget item
  const deleteBudgetItem = async (id: string) => {
    try {
      setBudgetItems(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Success",
        description: "Budget item deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting budget item:', error);
      toast({
        title: "Error",
        description: "Failed to delete budget item",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Calculate budget summary
  const getBudgetSummary = (): BudgetSummary => {
    const categories: { [key: string]: { budgeted: number; spent: number; remaining: number } } = {};
    let total_planned = 0;
    let total_spent = 0;

    budgetItems.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = { budgeted: 0, spent: 0, remaining: 0 };
      }

      categories[item.category].budgeted += item.budgeted_amount;
      total_planned += item.budgeted_amount;

      if (item.actual_amount) {
        categories[item.category].spent += item.actual_amount;
        total_spent += item.actual_amount;
      }

      categories[item.category].remaining = 
        categories[item.category].budgeted - categories[item.category].spent;
    });

    return {
      total_budget: totalBudget,
      total_spent,
      total_planned,
      remaining_budget: totalBudget - total_spent,
      categories,
    };
  };

  // Get items by category
  const getItemsByCategory = (category: string) => {
    return budgetItems.filter(item => item.category === category);
  };

  // Get items by status
  const getItemsByStatus = (status: 'planned' | 'confirmed' | 'paid') => {
    return budgetItems.filter(item => item.status === status);
  };

  // Auto-save when data changes
  useEffect(() => {
    saveData();
  }, [budgetItems, totalBudget]);

  return {
    budgetItems,
    totalBudget,
    loading,
    setTotalBudget,
    addBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,
    getBudgetSummary,
    getItemsByCategory,
    getItemsByStatus,
  };
};