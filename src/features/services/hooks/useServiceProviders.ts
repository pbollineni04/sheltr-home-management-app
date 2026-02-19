import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { ServiceProvider } from '../types';

export const useServiceProviders = () => {
    const [providers, setProviders] = useState<ServiceProvider[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchProviders = async () => {
        try {
            const { data, error } = await supabase
                .from('service_providers')
                .select('*')
                .order('is_favorite', { ascending: false })
                .order('name', { ascending: true });

            if (error) {
                console.error('Error fetching providers:', error);
                toast({ title: 'Error', description: 'Failed to fetch service providers', variant: 'destructive' });
                return;
            }
            setProviders((data || []) as ServiceProvider[]);
        } catch (error) {
            console.error('Unexpected error:', error);
        } finally {
            setLoading(false);
        }
    };

    const addProvider = async (providerData: Omit<ServiceProvider, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'metadata'>) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast({ title: 'Authentication required', description: 'Please log in', variant: 'destructive' });
                return false;
            }

            const { data, error } = await supabase
                .from('service_providers')
                .insert([{ ...providerData, user_id: user.id }])
                .select()
                .single();

            if (error) {
                console.error('Error adding provider:', error);
                toast({ title: 'Error', description: 'Failed to add provider', variant: 'destructive' });
                return false;
            }

            setProviders(prev => [data as ServiceProvider, ...prev]);
            toast({ title: 'Success', description: 'Provider added successfully' });
            return true;
        } catch (error) {
            console.error('Unexpected error:', error);
            return false;
        }
    };

    const updateProvider = async (id: string, updates: Partial<ServiceProvider>) => {
        try {
            const { data, error } = await supabase
                .from('service_providers')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Error updating provider:', error);
                toast({ title: 'Error', description: 'Failed to update provider', variant: 'destructive' });
                return false;
            }

            setProviders(prev => prev.map(p => p.id === id ? (data as ServiceProvider) : p));
            return true;
        } catch (error) {
            console.error('Unexpected error:', error);
            return false;
        }
    };

    const deleteProvider = async (id: string) => {
        try {
            const { error } = await supabase
                .from('service_providers')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting provider:', error);
                toast({ title: 'Error', description: 'Failed to delete provider', variant: 'destructive' });
                return false;
            }

            setProviders(prev => prev.filter(p => p.id !== id));
            toast({ title: 'Success', description: 'Provider deleted' });
            return true;
        } catch (error) {
            console.error('Unexpected error:', error);
            return false;
        }
    };

    const toggleFavorite = async (id: string) => {
        const provider = providers.find(p => p.id === id);
        if (!provider) return false;
        return updateProvider(id, { is_favorite: !provider.is_favorite });
    };

    useEffect(() => { fetchProviders(); }, []);

    return { providers, loading, addProvider, updateProvider, deleteProvider, toggleFavorite, refetch: fetchProviders };
};
