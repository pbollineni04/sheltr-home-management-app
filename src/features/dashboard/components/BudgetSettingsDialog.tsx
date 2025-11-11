import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BudgetSettingsDialogProps {
  currentBudget: number;
  onBudgetUpdate: (newBudget: number) => void;
}

export const BudgetSettingsDialog = ({ currentBudget, onBudgetUpdate }: BudgetSettingsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [budgetValue, setBudgetValue] = useState(currentBudget.toString());
  const { toast } = useToast();

  const handleSave = () => {
    const newBudget = parseFloat(budgetValue);

    if (isNaN(newBudget) || newBudget < 0) {
      toast({
        title: "Invalid Budget",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }

    onBudgetUpdate(newBudget);
    toast({
      title: "Budget Updated",
      description: `Monthly budget set to $${newBudget.toLocaleString()}`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Budget Settings</DialogTitle>
          <DialogDescription>
            Set your monthly expense budget target
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="budget">Monthly Budget ($)</Label>
            <Input
              id="budget"
              type="number"
              step="0.01"
              min="0"
              value={budgetValue}
              onChange={(e) => setBudgetValue(e.target.value)}
              placeholder="800.00"
              className="input-luxury"
            />
            <p className="text-sm text-muted-foreground">
              This is used to track your spending and show budget alerts on the dashboard.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="btn-primary-luxury">
              Save Budget
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
