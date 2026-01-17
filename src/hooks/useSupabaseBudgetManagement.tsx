import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface BudgetItem {
  id?: string;
  category: string;
  title: string;
  description?: string;
  estimated_amount: number;
  actual_amount?: number;
  paid_amount?: number;
  status: 'planned' | 'booked' | 'paid' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BudgetSummary {
  totalEstimated: number;
  totalActual: number;
  totalPaid: number;
  remainingBudget: number;
  itemsByCategory: Record<string, BudgetItem[]>;
  itemsByStatus: Record<string, BudgetItem[]>;
}

// In-memory storage for budget items
const budgetStorage: Map<string, BudgetItem[]> = new Map();

export const useSupabaseBudgetManagement = (eventId?: string) => {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch budget items from in-memory storage
  const fetchBudgetItems = async () => {
    if (!eventId) return;
    
    setLoading(true);
    try {
      const items = budgetStorage.get(eventId) || [];
      setBudgetItems(items);
    } catch (error) {
      console.error('Error fetching budget items:', error);
      toast({
        title: "Error",
        description: "Failed to load budget items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add budget item to in-memory storage
  const addBudgetItem = async (itemData: Omit<BudgetItem, 'id'>) => {
    if (!eventId) return;

    try {
      const newItem: BudgetItem = {
        ...itemData,
        id: `budget-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const items = budgetStorage.get(eventId) || [];
      items.push(newItem);
      budgetStorage.set(eventId, items);

      setBudgetItems(prev => [...prev, newItem]);
      toast({
        title: "Success",
        description: "Budget item added successfully",
      });
    } catch (error) {
      console.error('Error adding budget item:', error);
      toast({
        title: "Error",
        description: "Failed to add budget item",
        variant: "destructive",
      });
    }
  };

  // Update budget item in storage
  const updateBudgetItem = async (id: string, itemData: Partial<BudgetItem>) => {
    if (!eventId) return;

    try {
      const items = budgetStorage.get(eventId) || [];
      const index = items.findIndex(item => item.id === id);
      
      if (index !== -1) {
        items[index] = { 
          ...items[index], 
          ...itemData, 
          updated_at: new Date().toISOString() 
        };
        budgetStorage.set(eventId, items);

        setBudgetItems(prev => 
          prev.map(item => item.id === id ? items[index] : item)
        );
        toast({
          title: "Success",
          description: "Budget item updated successfully",
        });
      }
    } catch (error) {
      console.error('Error updating budget item:', error);
      toast({
        title: "Error",
        description: "Failed to update budget item",
        variant: "destructive",
      });
    }
  };

  // Delete budget item from storage
  const deleteBudgetItem = async (id: string) => {
    if (!eventId) return;

    try {
      const items = budgetStorage.get(eventId) || [];
      const filtered = items.filter(item => item.id !== id);
      budgetStorage.set(eventId, filtered);

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
    }
  };

  // Get budget summary
  const getBudgetSummary = (): BudgetSummary => {
    const totalEstimated = budgetItems.reduce((sum, item) => sum + (item.estimated_amount || 0), 0);
    const totalActual = budgetItems.reduce((sum, item) => sum + (item.actual_amount || 0), 0);
    const totalPaid = budgetItems.reduce((sum, item) => sum + (item.paid_amount || 0), 0);
    const remainingBudget = totalEstimated - totalActual;

    const itemsByCategory = budgetItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, BudgetItem[]>);

    const itemsByStatus = budgetItems.reduce((acc, item) => {
      if (!acc[item.status]) acc[item.status] = [];
      acc[item.status].push(item);
      return acc;
    }, {} as Record<string, BudgetItem[]>);

    return {
      totalEstimated,
      totalActual,
      totalPaid,
      remainingBudget,
      itemsByCategory,
      itemsByStatus
    };
  };

  // Filter functions
  const getItemsByCategory = (category: string) => 
    budgetItems.filter(item => item.category === category);

  const getItemsByStatus = (status: string) => 
    budgetItems.filter(item => item.status === status);

  // Load data when eventId changes
  useEffect(() => {
    fetchBudgetItems();
  }, [eventId]);

  return {
    budgetItems,
    loading,
    addBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,
    getBudgetSummary,
    getItemsByCategory,
    getItemsByStatus,
    refetch: fetchBudgetItems
  };
};
