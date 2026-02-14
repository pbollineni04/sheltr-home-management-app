import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { UtilityType, ReadingFormData } from '../types';
import { AVAILABLE_UNITS, DEFAULT_UNITS } from '../types';

interface AddReadingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ReadingFormData) => Promise<boolean>;
}

const AddReadingDialog = ({ open, onOpenChange, onSubmit }: AddReadingDialogProps) => {
  const [formData, setFormData] = useState<ReadingFormData>({
    utility_type: 'electricity',
    usage_amount: '',
    unit: DEFAULT_UNITS['electricity'],
    cost: '',
    reading_date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);

  const handleUtilityTypeChange = (utilityType: UtilityType) => {
    setFormData(prev => ({
      ...prev,
      utility_type: utilityType,
      unit: DEFAULT_UNITS[utilityType],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.usage_amount || !formData.reading_date) {
      return;
    }

    setLoading(true);

    const success = await onSubmit(formData);

    if (success) {
      // Reset form
      setFormData({
        utility_type: 'electricity',
        usage_amount: '',
        unit: DEFAULT_UNITS['electricity'],
        cost: '',
        reading_date: new Date().toISOString().split('T')[0],
      });
      onOpenChange(false);
    }

    setLoading(false);
  };

  const utilityTypeLabels: Record<UtilityType, string> = {
    electricity: 'Electricity',
    gas: 'Gas',
    water: 'Water',
    internet: 'Internet',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Utility Reading</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="utility_type">Utility Type *</Label>
            <Select
              value={formData.utility_type}
              onValueChange={(value) => handleUtilityTypeChange(value as UtilityType)}
            >
              <SelectTrigger className="input-luxury">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electricity">{utilityTypeLabels.electricity}</SelectItem>
                <SelectItem value="gas">{utilityTypeLabels.gas}</SelectItem>
                <SelectItem value="water">{utilityTypeLabels.water}</SelectItem>
                <SelectItem value="internet">{utilityTypeLabels.internet}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="usage_amount">Usage Amount *</Label>
              <Input
                id="usage_amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.usage_amount}
                onChange={(e) => setFormData(prev => ({ ...prev, usage_amount: e.target.value }))}
                placeholder="0.00"
                required
                className="input-luxury"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
              >
                <SelectTrigger className="input-luxury">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_UNITS[formData.utility_type].map(unit => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost">Cost (USD)</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              min="0"
              value={formData.cost}
              onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
              placeholder="0.00"
              className="input-luxury"
            />
            <p className="text-xs text-muted-foreground">Optional - enter the cost for this period</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reading_date">Reading Date *</Label>
            <Input
              id="reading_date"
              type="date"
              value={formData.reading_date}
              onChange={(e) => setFormData(prev => ({ ...prev, reading_date: e.target.value }))}
              required
              className="input-luxury"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="btn-secondary-luxury"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.usage_amount || !formData.reading_date}
              className="btn-primary-luxury"
            >
              {loading ? 'Adding...' : 'Add Reading'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddReadingDialog;
