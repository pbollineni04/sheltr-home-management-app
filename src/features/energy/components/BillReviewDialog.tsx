import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, X, Edit2, AlertTriangle } from 'lucide-react';
import { getPendingReviews, resolveReview } from '@/integrations/utility/utilityService';
import { useToast } from '@/hooks/use-toast';
import type { UtilityReadingRow } from '../types';

interface BillReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReviewComplete: () => void;
}

const BillReviewDialog = ({ open, onOpenChange, onReviewComplete }: BillReviewDialogProps) => {
  const [pendingReadings, setPendingReadings] = useState<UtilityReadingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ usage_amount: string; cost: string }>({
    usage_amount: '',
    cost: '',
  });
  const { toast } = useToast();

  const fetchPending = async () => {
    try {
      setLoading(true);
      const data = await getPendingReviews();
      setPendingReadings(data);
    } catch (error) {
      console.error('Error fetching pending reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchPending();
  }, [open]);

  const handleApprove = async (readingId: string, updates?: { usage_amount?: number; cost?: number }) => {
    try {
      setProcessingId(readingId);
      await resolveReview(readingId, 'approve', updates);
      setPendingReadings(prev => prev.filter(r => r.id !== readingId));
      toast({ title: "Approved", description: "Reading approved successfully" });
      if (pendingReadings.length <= 1) onReviewComplete();
    } catch (error) {
      toast({ title: "Error", description: "Failed to approve reading", variant: "destructive" });
    } finally {
      setProcessingId(null);
      setEditingId(null);
    }
  };

  const handleReject = async (readingId: string) => {
    try {
      setProcessingId(readingId);
      await resolveReview(readingId, 'reject');
      setPendingReadings(prev => prev.filter(r => r.id !== readingId));
      toast({ title: "Rejected", description: "Reading removed" });
      if (pendingReadings.length <= 1) onReviewComplete();
    } catch (error) {
      toast({ title: "Error", description: "Failed to reject reading", variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  };

  const startEditing = (reading: UtilityReadingRow) => {
    setEditingId(reading.id);
    setEditValues({
      usage_amount: String(reading.usage_amount),
      cost: String(reading.cost || ''),
    });
  };

  const handleSaveEdit = async (readingId: string) => {
    const updates: { usage_amount?: number; cost?: number } = {};
    if (editValues.usage_amount) updates.usage_amount = parseFloat(editValues.usage_amount);
    if (editValues.cost) updates.cost = parseFloat(editValues.cost);
    await handleApprove(readingId, updates);
  };

  const getConfidenceBadge = (confidence: string | null) => {
    switch (confidence) {
      case 'high':
        return <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">Medium</Badge>;
      default:
        return <Badge className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">Low</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            Review Imported Bills ({pendingReadings.length})
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : pendingReadings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No bills pending review</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingReadings.map((reading) => (
              <div key={reading.id} className="p-4 rounded-lg border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">{reading.utility_type}</span>
                    {getConfidenceBadge((reading as any).confidence)}
                  </div>
                  <span className="text-sm text-muted-foreground">{reading.reading_date}</span>
                </div>

                {editingId === reading.id ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground">Usage ({reading.unit})</label>
                      <Input
                        type="number"
                        value={editValues.usage_amount}
                        onChange={(e) => setEditValues(prev => ({ ...prev, usage_amount: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Cost ($)</label>
                      <Input
                        type="number"
                        value={editValues.cost}
                        onChange={(e) => setEditValues(prev => ({ ...prev, cost: e.target.value }))}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 text-sm">
                    <span>{reading.usage_amount.toLocaleString()} {reading.unit}</span>
                    {reading.cost != null && <span className="font-medium">${reading.cost.toFixed(2)}</span>}
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  {editingId === reading.id ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(reading.id)}
                        disabled={processingId === reading.id}
                      >
                        {processingId === reading.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <><Check className="w-4 h-4 mr-1" /> Save & Approve</>
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(reading.id)}
                        disabled={processingId === reading.id}
                        className="text-red-600"
                      >
                        <X className="w-4 h-4 mr-1" /> Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditing(reading)}
                      >
                        <Edit2 className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(reading.id)}
                        disabled={processingId === reading.id}
                      >
                        {processingId === reading.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <><Check className="w-4 h-4 mr-1" /> Approve</>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BillReviewDialog;
