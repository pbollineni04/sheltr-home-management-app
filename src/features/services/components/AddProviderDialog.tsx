import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Star } from 'lucide-react';
import type { ServiceCategory } from '../types';
import { SERVICE_CATEGORY_LABELS } from '../types';

interface AddProviderDialogProps {
    onAdd: (data: {
        name: string;
        category: ServiceCategory;
        phone?: string;
        email?: string;
        website?: string;
        notes?: string;
        rating?: number;
        is_favorite: boolean;
    }) => Promise<boolean>;
}

export const AddProviderDialog = ({ onAdd }: AddProviderDialogProps) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [category, setCategory] = useState<ServiceCategory>('other');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [notes, setNotes] = useState('');
    const [rating, setRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const reset = () => {
        setName(''); setCategory('other'); setPhone(''); setEmail('');
        setWebsite(''); setNotes(''); setRating(0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        setSubmitting(true);
        const success = await onAdd({
            name: name.trim(),
            category,
            phone: phone.trim() || undefined,
            email: email.trim() || undefined,
            website: website.trim() || undefined,
            notes: notes.trim() || undefined,
            rating: rating > 0 ? rating : undefined,
            is_favorite: false,
        });
        setSubmitting(false);
        if (success) { reset(); setOpen(false); }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5">
                    <Plus size={16} /> Add Provider
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Service Provider</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="provider-name">Name *</Label>
                        <Input id="provider-name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Mike's Plumbing" required />
                    </div>
                    <div>
                        <Label htmlFor="provider-category">Category</Label>
                        <Select value={category} onValueChange={(v) => setCategory(v as ServiceCategory)}>
                            <SelectTrigger id="provider-category"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {Object.entries(SERVICE_CATEGORY_LABELS).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label htmlFor="provider-phone">Phone</Label>
                            <Input id="provider-phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 123-4567" />
                        </div>
                        <div>
                            <Label htmlFor="provider-email">Email</Label>
                            <Input id="provider-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="mike@example.com" />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="provider-website">Website</Label>
                        <Input id="provider-website" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://mikesplumbing.com" />
                    </div>
                    <div>
                        <Label>Rating</Label>
                        <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button key={star} type="button" onClick={() => setRating(star === rating ? 0 : star)}>
                                    <Star size={20} className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30 hover:text-yellow-400/50'} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="provider-notes">Notes</Label>
                        <Textarea id="provider-notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Personal notes about this provider..." rows={2} />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={submitting || !name.trim()}>
                            {submitting ? 'Adding...' : 'Add Provider'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
