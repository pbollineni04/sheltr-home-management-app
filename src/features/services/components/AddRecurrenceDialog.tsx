import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import type { ServiceCategory, ServiceFrequency, ServiceProvider } from '../types';
import { SERVICE_CATEGORY_LABELS, SERVICE_FREQUENCY_LABELS } from '../types';

interface AddRecurrenceDialogProps {
    providers: ServiceProvider[];
    onAdd: (data: {
        title: string;
        description?: string;
        category: ServiceCategory;
        provider_id?: string;
        frequency: ServiceFrequency;
        start_date: string;
        end_date?: string;
        next_due_date: string;
        estimated_cost?: number;
        is_active: boolean;
        room?: string;
    }) => Promise<boolean>;
}

export const AddRecurrenceDialog = ({ providers, onAdd }: AddRecurrenceDialogProps) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<ServiceCategory>('other');
    const [providerId, setProviderId] = useState('');
    const [frequency, setFrequency] = useState<ServiceFrequency>('monthly');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [estimatedCost, setEstimatedCost] = useState('');
    const [room, setRoom] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const reset = () => {
        setTitle(''); setDescription(''); setCategory('other'); setProviderId('');
        setFrequency('monthly'); setStartDate(''); setEndDate('');
        setEstimatedCost(''); setRoom('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !startDate) return;
        setSubmitting(true);

        const success = await onAdd({
            title: title.trim(),
            description: description.trim() || undefined,
            category,
            provider_id: providerId || undefined,
            frequency,
            start_date: startDate,
            end_date: endDate || undefined,
            next_due_date: startDate,
            estimated_cost: estimatedCost ? parseFloat(estimatedCost) : undefined,
            is_active: true,
            room: room.trim() || undefined,
        });

        setSubmitting(false);
        if (success) { reset(); setOpen(false); }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1.5">
                    <Plus size={16} /> Add Recurring
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Recurring Service</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="rec-title">Title *</Label>
                        <Input id="rec-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Monthly Lawn Care" required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label htmlFor="rec-category">Category</Label>
                            <Select value={category} onValueChange={(v) => setCategory(v as ServiceCategory)}>
                                <SelectTrigger id="rec-category"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.entries(SERVICE_CATEGORY_LABELS).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="rec-frequency">Frequency</Label>
                            <Select value={frequency} onValueChange={(v) => setFrequency(v as ServiceFrequency)}>
                                <SelectTrigger id="rec-frequency"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.entries(SERVICE_FREQUENCY_LABELS).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="rec-provider">Provider</Label>
                        <Select value={providerId} onValueChange={setProviderId}>
                            <SelectTrigger id="rec-provider"><SelectValue placeholder="Select a provider (optional)" /></SelectTrigger>
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
                            <Label htmlFor="rec-start">Start Date *</Label>
                            <Input id="rec-start" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                        </div>
                        <div>
                            <Label htmlFor="rec-end">End Date</Label>
                            <Input id="rec-end" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label htmlFor="rec-cost">Cost per Occurrence</Label>
                            <Input id="rec-cost" type="number" step="0.01" min="0" value={estimatedCost} onChange={e => setEstimatedCost(e.target.value)} placeholder="$0.00" />
                        </div>
                        <div>
                            <Label htmlFor="rec-room">Room / Location</Label>
                            <Input id="rec-room" value={room} onChange={e => setRoom(e.target.value)} placeholder="e.g., Backyard" />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="rec-description">Description</Label>
                        <Textarea id="rec-description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Scope of work..." rows={2} />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={submitting || !title.trim() || !startDate}>
                            {submitting ? 'Creating...' : 'Create Recurring'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
