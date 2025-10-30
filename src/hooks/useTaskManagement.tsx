import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  event_id?: string;
  user_id: string;
}

export const useTaskManagement = (eventId?: string) => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch tasks from Supabase
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (eventId) {
        query = query.eq('event_id', eventId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform Supabase data to match our Task interface
      const transformedTasks: Task[] = (data || []).map(task => ({
        ...task,
        status: task.status as 'pending' | 'in_progress' | 'completed',
        priority: task.priority as 'low' | 'medium' | 'high'
      }));

      setTasks(transformedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new task
  const createTask = async (taskData: {
    title: string;
    description?: string;
    due_date?: string;
    priority?: 'low' | 'medium' | 'high';
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to create tasks",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...taskData,
          user_id: user.id,
          event_id: eventId || null,
          status: 'pending',
          priority: taskData.priority || 'medium'
        }])
        .select()
        .single();

      if (error) throw error;

      const transformedTask: Task = {
        ...data,
        status: data.status as 'pending' | 'in_progress' | 'completed',
        priority: data.priority as 'low' | 'medium' | 'high'
      };

      setTasks(prev => [transformedTask, ...prev]);
      
      toast({
        title: "Success",
        description: "Task created successfully",
      });

      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update a task
  const updateTask = async (id: string, updates: Partial<{
    title: string;
    description: string;
    due_date: string;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
  }>) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, ...updates } : task
      ));

      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== id));
      
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Mark task as completed
  const completeTask = async (id: string) => {
    await updateTask(id, { status: 'completed' });
  };

  // Get tasks by status
  const getTasksByStatus = (status: 'pending' | 'in_progress' | 'completed') => {
    return tasks.filter(task => task.status === status);
  };

  // Get tasks by priority
  const getTasksByPriority = (priority: 'low' | 'medium' | 'high') => {
    return tasks.filter(task => task.priority === priority);
  };

  // Get overdue tasks
  const getOverdueTasks = () => {
    const now = new Date();
    return tasks.filter(task => 
      task.due_date && 
      new Date(task.due_date) < now && 
      task.status !== 'completed'
    );
  };

  useEffect(() => {
    fetchTasks();
  }, [eventId]);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    getTasksByStatus,
    getTasksByPriority,
    getOverdueTasks,
    refetch: fetchTasks,
  };
};