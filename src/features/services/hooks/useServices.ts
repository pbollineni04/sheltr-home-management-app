import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Service, ServiceProvider } from '../types';

export const useServices = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchServices = async () => {
        try {
            const { data, error } = await supabase
                .from('services')
                .select('*, provider:service_providers(*), recurrence:service_recurrences(*)')
                .order('scheduled_date', { ascending: true });

            if (error) {
                console.error('Error fetching services:', error);
                toast({ title: 'Error', description: 'Failed to fetch services', variant: 'destructive' });
                return;
            }
            setServices((data || []) as Service[]);
        } catch (error) {
            console.error('Unexpected error:', error);
        } finally {
            setLoading(false);
        }
    };

    const addService = async (
        serviceData: Omit<Service, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'metadata' | 'attachments' | 'provider' | 'recurrence'>,
        createPrepTask = false
    ) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast({ title: 'Authentication required', description: 'Please log in', variant: 'destructive' });
                return false;
            }

            let taskId: string | undefined;

            // Optionally create a prep task
            if (createPrepTask) {
                const dueDate = new Date(serviceData.scheduled_date);
                dueDate.setDate(dueDate.getDate() - 1);

                const { data: taskData, error: taskError } = await supabase
                    .from('tasks')
                    .insert([{
                        user_id: user.id,
                        title: `Prepare for: ${serviceData.title}`,
                        description: serviceData.description ? `Prep for service: ${serviceData.description}` : undefined,
                        list_type: 'maintenance',
                        priority: serviceData.priority,
                        due_date: dueDate.toISOString().split('T')[0],
                        status: 'todo',
                        completed: false,
                        metadata: { auto_created: true, source: 'service' },
                    }])
                    .select()
                    .single();

                if (!taskError && taskData) {
                    taskId = (taskData as { id: string }).id;
                }
            }

            const { provider, recurrence, ...insertData } = serviceData as Service;
            const { data, error } = await supabase
                .from('services')
                .insert([{
                    ...insertData,
                    user_id: user.id,
                    task_id: taskId,
                }])
                .select('*, provider:service_providers(*), recurrence:service_recurrences(*)')
                .single();

            if (error) {
                console.error('Error adding service:', error);
                toast({ title: 'Error', description: 'Failed to add service', variant: 'destructive' });
                return false;
            }

            setServices(prev => [...prev, data as Service].sort(
                (a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
            ));
            toast({ title: 'Success', description: `Service "${serviceData.title}" scheduled` });
            return true;
        } catch (error) {
            console.error('Unexpected error:', error);
            return false;
        }
    };

    const updateService = async (id: string, updates: Partial<Service>) => {
        try {
            const { provider, recurrence, ...updateData } = updates as Partial<Service>;
            const { data, error } = await supabase
                .from('services')
                .update({ ...updateData, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select('*, provider:service_providers(*), recurrence:service_recurrences(*)')
                .single();

            if (error) {
                console.error('Error updating service:', error);
                toast({ title: 'Error', description: 'Failed to update service', variant: 'destructive' });
                return false;
            }

            setServices(prev => prev.map(s => s.id === id ? (data as Service) : s));
            return true;
        } catch (error) {
            console.error('Unexpected error:', error);
            return false;
        }
    };

    const completeService = async (id: string, actualCost?: number, logExpense = false) => {
        const service = services.find(s => s.id === id);
        if (!service) return false;

        const completedDate = new Date().toISOString().split('T')[0];
        const success = await updateService(id, {
            status: 'completed',
            completed_date: completedDate,
            actual_cost: actualCost ?? service.actual_cost,
        });

        if (!success) return false;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return true;

            const providerName = service.provider?.name;

            // Auto-create timeline event
            await supabase.from('timeline_events').insert([{
                user_id: user.id,
                title: service.title,
                description: providerName ? `Service completed by ${providerName}` : 'Service completed',
                date: completedDate,
                category: 'services',
                room: service.room,
                service_id: service.id,
                cost: actualCost ?? service.actual_cost,
                metadata: {
                    auto_created: true,
                    source: 'service',
                    provider_id: service.provider_id,
                },
            }]);

            toast({ title: 'Timeline Updated', description: 'Service added to your home timeline' });

            // Optionally create an expense
            const cost = actualCost ?? service.actual_cost;
            if (logExpense && cost && cost > 0) {
                await supabase.from('expenses').insert([{
                    user_id: user.id,
                    description: service.title,
                    amount: cost,
                    category: 'services',
                    vendor: providerName || undefined,
                    date: completedDate,
                    room: service.room,
                    metadata: { auto_created: true, source: 'service', service_id: service.id },
                }]);

                toast({ title: 'Expense Logged', description: `$${cost.toFixed(2)} added to expenses` });
            }

            // If this is part of a recurrence, advance next_due_date
            if (service.recurrence_id) {
                await advanceRecurrence(service.recurrence_id);
            }
        } catch (error) {
            console.error('Error with post-completion actions:', error);
        }

        return true;
    };

    const advanceRecurrence = async (recurrenceId: string) => {
        try {
            const { data: rec, error } = await supabase
                .from('service_recurrences')
                .select('*')
                .eq('id', recurrenceId)
                .single();

            if (error || !rec) return;

            const nextDate = calculateNextDate(rec.next_due_date, rec.frequency);

            // Check if past end_date
            if (rec.end_date && new Date(nextDate) > new Date(rec.end_date)) {
                await supabase.from('service_recurrences')
                    .update({ is_active: false, updated_at: new Date().toISOString() })
                    .eq('id', recurrenceId);
                return;
            }

            await supabase.from('service_recurrences')
                .update({ next_due_date: nextDate, updated_at: new Date().toISOString() })
                .eq('id', recurrenceId);
        } catch (error) {
            console.error('Error advancing recurrence:', error);
        }
    };

    const deleteService = async (id: string) => {
        try {
            const service = services.find(s => s.id === id);

            const { error } = await supabase
                .from('services')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting service:', error);
                toast({ title: 'Error', description: 'Failed to delete service', variant: 'destructive' });
                return false;
            }

            // Clean up linked prep task
            if (service?.task_id) {
                await supabase.from('tasks').delete().eq('id', service.task_id);
            }

            setServices(prev => prev.filter(s => s.id !== id));
            toast({ title: 'Success', description: 'Service deleted' });
            return true;
        } catch (error) {
            console.error('Unexpected error:', error);
            return false;
        }
    };

    useEffect(() => { fetchServices(); }, []);

    return {
        services,
        loading,
        addService,
        updateService,
        completeService,
        deleteService,
        refetch: fetchServices,
    };
};

function calculateNextDate(currentDate: string, frequency: string): string {
    const date = new Date(currentDate);
    switch (frequency) {
        case 'weekly': date.setDate(date.getDate() + 7); break;
        case 'biweekly': date.setDate(date.getDate() + 14); break;
        case 'monthly': date.setMonth(date.getMonth() + 1); break;
        case 'quarterly': date.setMonth(date.getMonth() + 3); break;
        case 'semiannually': date.setMonth(date.getMonth() + 6); break;
        case 'annually': date.setFullYear(date.getFullYear() + 1); break;
        default: date.setMonth(date.getMonth() + 1); break;
    }
    return date.toISOString().split('T')[0];
}
