import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { ServiceRecurrence } from '../types';

export const useServiceRecurrences = () => {
    const [recurrences, setRecurrences] = useState<ServiceRecurrence[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchRecurrences = async () => {
        try {
            const { data, error } = await supabase
                .from('service_recurrences')
                .select('*, provider:service_providers(*)')
                .order('next_due_date', { ascending: true });

            if (error) {
                console.error('Error fetching recurrences:', error);
                toast({ title: 'Error', description: 'Failed to fetch recurring services', variant: 'destructive' });
                return;
            }
            setRecurrences((data || []) as ServiceRecurrence[]);
        } catch (error) {
            console.error('Unexpected error:', error);
        } finally {
            setLoading(false);
        }
    };

    const addRecurrence = async (recurrenceData: Omit<ServiceRecurrence, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'metadata' | 'provider'>) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast({ title: 'Authentication required', description: 'Please log in', variant: 'destructive' });
                return false;
            }

            const { provider, ...insertData } = recurrenceData as ServiceRecurrence;
            const { data, error } = await supabase
                .from('service_recurrences')
                .insert([{ ...insertData, user_id: user.id }])
                .select('*, provider:service_providers(*)')
                .single();

            if (error) {
                console.error('Error adding recurrence:', error);
                toast({ title: 'Error', description: 'Failed to add recurring service', variant: 'destructive' });
                return false;
            }

            setRecurrences(prev => [data as ServiceRecurrence, ...prev]);
            toast({ title: 'Success', description: 'Recurring service created' });
            return true;
        } catch (error) {
            console.error('Unexpected error:', error);
            return false;
        }
    };

    const updateRecurrence = async (id: string, updates: Partial<ServiceRecurrence>) => {
        try {
            const { provider, ...updateData } = updates as Partial<ServiceRecurrence>;
            const { data, error } = await supabase
                .from('service_recurrences')
                .update({ ...updateData, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select('*, provider:service_providers(*)')
                .single();

            if (error) {
                console.error('Error updating recurrence:', error);
                toast({ title: 'Error', description: 'Failed to update recurring service', variant: 'destructive' });
                return false;
            }

            setRecurrences(prev => prev.map(r => r.id === id ? (data as ServiceRecurrence) : r));
            return true;
        } catch (error) {
            console.error('Unexpected error:', error);
            return false;
        }
    };

    const toggleActive = async (id: string) => {
        const recurrence = recurrences.find(r => r.id === id);
        if (!recurrence) return false;
        const success = await updateRecurrence(id, { is_active: !recurrence.is_active });
        if (success) {
            toast({ title: recurrence.is_active ? 'Paused' : 'Resumed', description: `"${recurrence.title}" ${recurrence.is_active ? 'paused' : 'resumed'}` });
        }
        return success;
    };

    const deleteRecurrence = async (id: string) => {
        try {
            const { error } = await supabase
                .from('service_recurrences')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting recurrence:', error);
                toast({ title: 'Error', description: 'Failed to delete recurring service', variant: 'destructive' });
                return false;
            }

            setRecurrences(prev => prev.filter(r => r.id !== id));
            toast({ title: 'Success', description: 'Recurring service deleted' });
            return true;
        } catch (error) {
            console.error('Unexpected error:', error);
            return false;
        }
    };

    useEffect(() => { fetchRecurrences(); }, []);

    return { recurrences, loading, addRecurrence, updateRecurrence, deleteRecurrence, toggleActive, refetch: fetchRecurrences };
};
