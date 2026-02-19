import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import type { ServiceCategory, ServicePriority, ServiceProvider } from '../types';
import { SERVICE_CATEGORY_LABELS } from '../types';

interface AddServiceDialogProps {
    providers: ServiceProvider[];
    onAdd: (data: {
        title: string;
        description?: string;
        category: ServiceCategory;
        provider_id?: string;
        status: 'scheduled';
        scheduled_date: string;
        scheduled_time?: string;
        estimated_cost?: number;
        room?: string;
        priority: ServicePriority;
        recurrence_id?: string;
    }, createPrepTask: boolean) => Promise<boolean>;
}

export const AddServiceDialog = ({ providers, onAdd }: AddServiceDialogProps) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<ServiceCategory>('other');
    const [providerId, setProviderId] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [estimatedCost, setEstimatedCost] = useState('');
    const [room, setRoom] = useState('');
    const [priority, setPriority] = useState<ServicePriority>('medium');
    const [createPrepTask, setCreatePrepTask] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const reset = () => {
        setTitle(''); setDescription(''); setCategory('other'); setProviderId('');
        setScheduledDate(''); setScheduledTime(''); setEstimatedCost('');
        setRoom(''); setPriority('medium'); setCreatePrepTask(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !scheduledDate) return;
        setSubmitting(true);

        const success = await onAdd({
            title: title.trim(),
            description: description.trim() || undefined,
            category,
            provider_id: providerId || undefined,
            status: 'scheduled',
            scheduled_date: scheduledDate,
            scheduled_time: scheduledTime || undefined,
            estimated_cost: estimatedCost ? parseFloat(estimatedCost) : undefined,
            room: room.trim() || undefined,
            priority,
        }, createPrepTask);

        setSubmitting(false);
        if (success) { reset(); setOpen(false); }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5">
                    <Plus size={16} /> Schedule Service
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Schedule a Service</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="service-title">Title *</Label>
                        <Input id="service-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Annual HVAC Tune-up" required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label htmlFor="service-category">Category</Label>
                            <Select value={category} onValueChange={(v) => setCategory(v as ServiceCategory)}>
                                <SelectTrigger id="service-category"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.entries(SERVICE_CATEGORY_LABELS).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="service-priority">Priority</Label>
                            <Select value={priority} onValueChange={(v) => setPriority(v as ServicePriority)}>
                                <SelectTrigger id="service-priority"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="service-provider">Provider</Label>
                        <Select value={providerId} onValueChange={setProviderId}>
                            <SelectTrigger id="service-provider"><SelectValue placeholder="Select a provider (optional)" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">No provider</SelectItem>
                                {providers.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label htmlFor="service-date">Date *</Label>
                            <Input id="service-date" type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} required />
                        </div>
                        <div>
                            <Label htmlFor="service-time">Time</Label>
                            <Input id="service-time" type="time" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label htmlFor="service-cost">Estimated Cost</Label>
                            <Input id="service-cost" type="number" step="0.01" min="0" value={estimatedCost} onChange={e => setEstimatedCost(e.target.value)} placeholder="$0.00" />
                        </div>
                        <div>
                            <Label htmlFor="service-room">Room / Location</Label>
                            <Input id="service-room" value={room} onChange={e => setRoom(e.target.value)} placeholder="e.g., Kitchen" />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="service-description">Description</Label>
                        <Textarea id="service-description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Scope of work, special instructions..." rows={2} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="create-task" checked={createPrepTask} onCheckedChange={(checked) => setCreatePrepTask(checked === true)} />
                        <Label htmlFor="create-task" className="text-sm font-normal cursor-pointer">
                            Create a prep task (due 1 day before)
                        </Label>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={submitting || !title.trim() || !scheduledDate}>
                            {submitting ? 'Scheduling...' : 'Schedule Service'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
