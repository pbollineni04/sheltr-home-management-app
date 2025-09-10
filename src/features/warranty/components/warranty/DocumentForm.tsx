
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { NewDocumentForm } from "../../types";

interface DocumentFormProps {
  formData: NewDocumentForm;
  onChange: (data: NewDocumentForm) => void;
  onSubmit: () => void;
  isProcessing: boolean;
}

const DocumentForm = ({ formData, onChange, onSubmit, isProcessing }: DocumentFormProps) => {
  const updateField = (field: keyof NewDocumentForm, value: string | number) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Document Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="e.g., Dishwasher Warranty"
        />
      </div>
      <div>
        <Label htmlFor="type">Type</Label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => updateField('type', e.target.value as any)}
          className="w-full h-10 px-3 border border-input rounded-md"
        >
          <option value="warranty">Warranty</option>
          <option value="insurance">Insurance</option>
          <option value="certificate">Certificate</option>
        </select>
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => updateField('category', e.target.value)}
          placeholder="e.g., Appliances, HVAC, Property"
        />
      </div>
      <div>
        <Label htmlFor="expiration">Expiration Date</Label>
        <Input
          id="expiration"
          type="date"
          value={formData.expirationDate}
          onChange={(e) => updateField('expirationDate', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="reminder">Reminder (days before)</Label>
        <Input
          id="reminder"
          type="number"
          value={formData.reminderDays}
          onChange={(e) => updateField('reminderDays', parseInt(e.target.value))}
          placeholder="30"
        />
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          value={formData.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="Additional details..."
        />
      </div>
      <Button onClick={onSubmit} className="w-full" disabled={isProcessing}>
        {isProcessing ? 'Processing...' : 'Add Document'}
      </Button>
    </div>
  );
};

export default DocumentForm;
