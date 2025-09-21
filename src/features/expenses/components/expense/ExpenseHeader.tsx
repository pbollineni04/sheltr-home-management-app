import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const ExpenseHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div>
        <h2 className="text-heading-xl text-foreground">Expense Tracker</h2>
        <p className="text-body-luxury text-muted-foreground">Monitor all home-related spending</p>
      </div>
      <Button className="btn-primary-luxury micro-scale">
        <Plus className="w-4 h-4 mr-2" />
        Add Expense
      </Button>
    </div>
  );
};