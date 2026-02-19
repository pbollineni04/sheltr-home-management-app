import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type { Service } from '../types';

interface CompleteServiceDialogProps {
    service: Service | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (id: string, actualCost?: number, logExpense?: boolean) => Promise<boolean>;
}

export const CompleteServiceDialog = ({ service, open, onOpenChange, onConfirm }: CompleteServiceDialogProps) => {
    const [actualCost, setActualCost] = useState('');
    const [logExpense, setLogExpense] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    if (!service) return null;

    const cost = actualCost ? parseFloat(actualCost) : service.estimated_cost;

    const handleConfirm = async () => {
        setSubmitting(true);
        await onConfirm(
            service.id,
            actualCost ? parseFloat(actualCost) : undefined,
            logExpense && !!cost && cost > 0
        );
        setSubmitting(false);
        setActualCost('');
        setLogExpense(true);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Complete Service</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <p className="text-sm text-muted-foreground">
                        Mark "<span className="font-medium text-foreground">{service.title}</span>" as completed?
                    </p>
                    <div>
                        <Label htmlFor="actual-cost">Actual Cost</Label>
                        <Input
                            id="actual-cost"
                            type="number"
                            step="0.01"
                            min="0"
                            value={actualCost}
                            onChange={e => setActualCost(e.target.value)}
                            placeholder={service.estimated_cost ? `Est: $${service.estimated_cost.toFixed(2)}` : '$0.00'}
                        />
                    </div>
                    {(cost && cost > 0) ? (
                        <div className="flex items-center gap-2">
                            <Checkbox id="log-expense" checked={logExpense} onCheckedChange={(c) => setLogExpense(c === true)} />
                            <Label htmlFor="log-expense" className="text-sm font-normal cursor-pointer">
                                Log ${cost.toFixed(2)} as an expense
                            </Label>
                        </div>
                    ) : null}
                    <p className="text-xs text-muted-foreground">
                        A timeline event will automatically be created.
                    </p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleConfirm} disabled={submitting}>
                        {submitting ? 'Completing...' : 'Mark Complete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
