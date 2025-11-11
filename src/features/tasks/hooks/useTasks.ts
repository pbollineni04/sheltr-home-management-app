
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  title: string;
  description?: string;
  list_type: 'maintenance' | 'projects' | 'shopping';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  completed: boolean;
  room?: string;
  created_at: string;
  updated_at: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        toast({
          title: "Error",
          description: "Failed to fetch tasks",
          variant: "destructive",
        });
        return;
      }

      setTasks(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to add tasks",
          variant: "destructive",
        });
        return false;
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...taskData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding task:', error);
        toast({
          title: "Error",
          description: "Failed to add task",
          variant: "destructive",
        });
        return false;
      }

      setTasks(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Task added successfully",
      });
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      return false;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating task:', error);
        toast({
          title: "Error",
          description: "Failed to update task",
          variant: "destructive",
        });
        return false;
      }

      setTasks(prev => prev.map(task => task.id === id ? data : task));
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      return false;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting task:', error);
        toast({
          title: "Error",
          description: "Failed to delete task",
          variant: "destructive",
        });
        return false;
      }

      setTasks(prev => prev.filter(task => task.id !== id));
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      return false;
    }
  };

  const toggleTaskComplete = async (id: string, completed: boolean) => {
    const success = await updateTask(id, { completed });

    // Auto-create timeline entry for completed maintenance tasks
    if (success && completed) {
      const task = tasks.find(t => t.id === id);
      if (task && task.list_type === 'maintenance') {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return success;

          // Create timeline entry
          await supabase.from('timeline_events').insert([{
            user_id: user.id,
            title: task.title,
            description: task.description,
            date: new Date().toISOString(),
            category: 'maintenance',
            room: task.room,
            task_id: task.id,
            metadata: {
              auto_created: true,
              source: 'task'
            }
          }]);

          toast({
            title: "Timeline Updated",
            description: "This maintenance task was added to your home timeline",
          });
        } catch (error) {
          console.error('Error creating timeline entry:', error);
          // Don't fail the task completion if timeline creation fails
        }
      }
    }

    return success;
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    refetch: fetchTasks
  };
};
