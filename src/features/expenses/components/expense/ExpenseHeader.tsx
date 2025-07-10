import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const ExpenseHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Expense Tracker</h2>
        <p className="text-muted-foreground">Monitor all home-related spending</p>
      </div>
      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
        <Plus className="w-4 h-4 mr-2" />
        Add Expense
      </Button>
    </div>
  );
};