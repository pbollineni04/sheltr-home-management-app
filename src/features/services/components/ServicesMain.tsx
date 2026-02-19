import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarCheck, Repeat, Users, Loader2 } from 'lucide-react';
import { useServices } from '../hooks/useServices';
import { useServiceProviders } from '../hooks/useServiceProviders';
import { useServiceRecurrences } from '../hooks/useServiceRecurrences';
import { ServiceCard } from './ServiceCard';
import { ProviderCard } from './ProviderCard';
import { RecurrenceCard } from './RecurrenceCard';
import { AddServiceDialog } from './AddServiceDialog';
import { AddProviderDialog } from './AddProviderDialog';
import { AddRecurrenceDialog } from './AddRecurrenceDialog';
import { CompleteServiceDialog } from './CompleteServiceDialog';
import type { Service, ServiceProvider, ServiceRecurrence } from '../types';

export const ServicesMain = () => {
    const { services, loading: sLoading, addService, updateService, completeService, deleteService } = useServices();
    const { providers, loading: pLoading, addProvider, updateProvider, deleteProvider, toggleFavorite } = useServiceProviders();
    const { recurrences, loading: rLoading, addRecurrence, updateRecurrence, deleteRecurrence, toggleActive } = useServiceRecurrences();

    const [completingService, setCompletingService] = useState<Service | null>(null);
    const [_editingService, _setEditingService] = useState<Service | null>(null);
    const [_editingProvider, _setEditingProvider] = useState<ServiceProvider | null>(null);
    const [_editingRecurrence, _setEditingRecurrence] = useState<ServiceRecurrence | null>(null);

    const loading = sLoading || pLoading || rLoading;

    // Separate upcoming vs past
    const { upcoming, past } = useMemo(() => {
        const now = new Date(new Date().toDateString());
        const active = services.filter(s => s.status !== 'completed' && s.status !== 'cancelled');
        const done = services.filter(s => s.status === 'completed' || s.status === 'cancelled');
        return {
            upcoming: active.sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()),
            past: done.sort((a, b) => new Date(b.completed_date || b.scheduled_date).getTime() - new Date(a.completed_date || a.scheduled_date).getTime()),
        };
    }, [services]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="w-full grid grid-cols-3 mb-4">
                    <TabsTrigger value="upcoming" className="gap-1.5 text-sm">
                        <CalendarCheck size={15} /> Upcoming
                        {upcoming.length > 0 && (
                            <span className="ml-1 bg-primary/15 text-primary text-xs rounded-full px-1.5 py-0.5 font-medium">
                                {upcoming.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="recurring" className="gap-1.5 text-sm">
                        <Repeat size={15} /> Recurring
                    </TabsTrigger>
                    <TabsTrigger value="providers" className="gap-1.5 text-sm">
                        <Users size={15} /> Providers
                    </TabsTrigger>
                </TabsList>

                {/* UPCOMING TAB */}
                <TabsContent value="upcoming" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground">Scheduled Services</h2>
                        <AddServiceDialog providers={providers} onAdd={addService} />
                    </div>

                    {upcoming.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <CalendarCheck className="mx-auto h-10 w-10 mb-3 opacity-40" />
                            <p className="font-medium">No upcoming services</p>
                            <p className="text-sm mt-1">Schedule your first service to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {upcoming.map(service => (
                                <ServiceCard
                                    key={service.id}
                                    service={service}
                                    onComplete={(id) => setCompletingService(services.find(s => s.id === id) || null)}
                                    onCancel={(id) => updateService(id, { status: 'cancelled' })}
                                    onEdit={() => { }} // TODO: edit dialog
                                    onDelete={deleteService}
                                />
                            ))}
                        </div>
                    )}

                    {/* Past services */}
                    {past.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Service History</h3>
                            <div className="space-y-2">
                                {past.map(service => (
                                    <ServiceCard
                                        key={service.id}
                                        service={service}
                                        onComplete={() => { }}
                                        onCancel={() => { }}
                                        onEdit={() => { }}
                                        onDelete={deleteService}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </TabsContent>

                {/* RECURRING TAB */}
                <TabsContent value="recurring" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground">Recurring Schedules</h2>
                        <AddRecurrenceDialog providers={providers} onAdd={addRecurrence} />
                    </div>

                    {recurrences.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Repeat className="mx-auto h-10 w-10 mb-3 opacity-40" />
                            <p className="font-medium">No recurring services</p>
                            <p className="text-sm mt-1">Set up automatic schedules for regular maintenance</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {recurrences.map(recurrence => (
                                <RecurrenceCard
                                    key={recurrence.id}
                                    recurrence={recurrence}
                                    onToggleActive={toggleActive}
                                    onEdit={() => { }} // TODO: edit dialog
                                    onDelete={deleteRecurrence}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* PROVIDERS TAB */}
                <TabsContent value="providers" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground">Service Providers</h2>
                        <AddProviderDialog onAdd={addProvider} />
                    </div>

                    {providers.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Users className="mx-auto h-10 w-10 mb-3 opacity-40" />
                            <p className="font-medium">No providers yet</p>
                            <p className="text-sm mt-1">Add your go-to service providers</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {providers.map(provider => (
                                <ProviderCard
                                    key={provider.id}
                                    provider={provider}
                                    onToggleFavorite={toggleFavorite}
                                    onEdit={() => { }} // TODO: edit dialog
                                    onDelete={deleteProvider}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Complete Service Dialog */}
            <CompleteServiceDialog
                service={completingService}
                open={!!completingService}
                onOpenChange={(open) => { if (!open) setCompletingService(null); }}
                onConfirm={completeService}
            />
        </div>
    );
};
