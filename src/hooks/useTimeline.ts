
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  category: 'maintenance' | 'renovation' | 'purchase' | 'inspection';
  room?: string;
  room_id?: string;
  cost?: number;
  tags?: string[];
  task_id?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export const useTimeline = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEvents = async (filters?: {
    startDate?: string;
    endDate?: string;
    category?: string;
    searchTerm?: string;
  }) => {
    try {
      let query = supabase
        .from('timeline_events')
        .select('*')
        .order('date', { ascending: false });

      // Apply date range filter
      if (filters?.startDate) {
        query = query.gte('date', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('date', filters.endDate);
      }

      // Apply category filter
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching timeline events:', error);
        toast({
          title: "Error",
          description: "Failed to fetch timeline events",
          variant: "destructive",
        });
        return;
      }

      let filteredEvents = data || [];

      // Apply search term filter (client-side for now)
      if (filters?.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredEvents = filteredEvents.filter(event => 
          event.title.toLowerCase().includes(searchLower) ||
          event.description?.toLowerCase().includes(searchLower) ||
          event.room?.toLowerCase().includes(searchLower) ||
          event.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      setEvents(filteredEvents);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (eventData: Omit<TimelineEvent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to add timeline events",
          variant: "destructive",
        });
        return false;
      }

      const { data, error } = await supabase
        .from('timeline_events')
        .insert([{
          ...eventData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding timeline event:', error);
        toast({
          title: "Error",
          description: "Failed to add timeline event",
          variant: "destructive",
        });
        return false;
      }

      setEvents(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Timeline event added successfully",
      });
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      return false;
    }
  };

  const updateEvent = async (id: string, updates: Partial<TimelineEvent>) => {
    try {
      const { data, error } = await supabase
        .from('timeline_events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating timeline event:', error);
        toast({
          title: "Error",
          description: "Failed to update timeline event",
          variant: "destructive",
        });
        return false;
      }

      setEvents(prev => prev.map(event => event.id === id ? data : event));
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      return false;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('timeline_events')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting timeline event:', error);
        toast({
          title: "Error",
          description: "Failed to delete timeline event",
          variant: "destructive",
        });
        return false;
      }

      setEvents(prev => prev.filter(event => event.id !== id));
      toast({
        title: "Success",
        description: "Timeline event deleted successfully",
      });
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents
  };
};
