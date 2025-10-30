import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

export const useSupabaseBudgetManagement = (eventId?: string) => {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch budget items from database
  const fetchBudgetItems = async () => {
    if (!eventId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('budget_items')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setBudgetItems((data || []).map(item => ({
        ...item,
        status: item.status as 'planned' | 'booked' | 'paid' | 'cancelled',
        priority: item.priority as 'low' | 'medium' | 'high'
      })));
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

  // Add budget item to database
  const addBudgetItem = async (itemData: Omit<BudgetItem, 'id'>) => {
    if (!eventId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('budget_items')
        .insert({
          event_id: eventId,
          user_id: user.id,
          category: itemData.category,
          title: itemData.title,
          description: itemData.description,
          estimated_amount: itemData.estimated_amount,
          actual_amount: itemData.actual_amount || 0,
          paid_amount: itemData.paid_amount || 0,
          status: itemData.status,
          priority: itemData.priority,
          due_date: itemData.due_date,
          notes: itemData.notes
        })
        .select()
        .single();

      if (error) throw error;

      setBudgetItems(prev => [...prev, {
        ...data,
        status: data.status as 'planned' | 'booked' | 'paid' | 'cancelled',
        priority: data.priority as 'low' | 'medium' | 'high'
      }]);
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

  // Update budget item in database
  const updateBudgetItem = async (id: string, itemData: Partial<BudgetItem>) => {
    try {
      const { data, error } = await supabase
        .from('budget_items')
        .update({
          category: itemData.category,
          title: itemData.title,
          description: itemData.description,
          estimated_amount: itemData.estimated_amount,
          actual_amount: itemData.actual_amount,
          paid_amount: itemData.paid_amount,
          status: itemData.status,
          priority: itemData.priority,
          due_date: itemData.due_date,
          notes: itemData.notes
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setBudgetItems(prev => 
        prev.map(item => item.id === id ? {
          ...data,
          status: data.status as 'planned' | 'booked' | 'paid' | 'cancelled',
          priority: data.priority as 'low' | 'medium' | 'high'
        } : item)
      );
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
    }
  };

  // Delete budget item from database
  const deleteBudgetItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('budget_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

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