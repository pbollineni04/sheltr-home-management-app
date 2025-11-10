import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, DollarSign, CheckSquare, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QuickCaptureCardProps {
  onAddExpense: (data: { description: string; amount: number }) => void;
  onAddTask: (data: { title: string }) => void;
}

export const QuickCaptureCard = ({ onAddExpense, onAddTask }: QuickCaptureCardProps) => {
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [expenseData, setExpenseData] = useState({ description: '', amount: '' });
  const [taskData, setTaskData] = useState({ title: '' });

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (expenseData.description && expenseData.amount) {
      onAddExpense({
        description: expenseData.description,
        amount: parseFloat(expenseData.amount)
      });
      setExpenseData({ description: '', amount: '' });
      setExpenseDialogOpen(false);
    }
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskData.title) {
      onAddTask({ title: taskData.title });
      setTaskData({ title: '' });
      setTaskDialogOpen(false);
    }
  };

  return (
    <>
      <Card className="card-luxury hover:shadow-lg transition-shadow border-l-4 border-l-green-600 dark:border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-heading-xl">
            <Zap className="w-5 h-5 text-green-600" />
            Quick Capture
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground mb-4">
            Log expenses or create tasks instantly
          </p>

          <Button
            onClick={() => setExpenseDialogOpen(true)}
            className="w-full btn-primary-luxury justify-start"
            size="lg"
          >
            <DollarSign className="w-5 h-5 mr-2" />
            Log Expense
          </Button>

          <Button
            onClick={() => setTaskDialogOpen(true)}
            variant="outline"
            className="w-full btn-secondary-luxury justify-start"
            size="lg"
          >
            <CheckSquare className="w-5 h-5 mr-2" />
            Create Task
          </Button>

          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Perfect for reactive situations
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Expense Dialog */}
      <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Log Expense</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleExpenseSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expense-desc">Description</Label>
              <Input
                id="expense-desc"
                placeholder="e.g., Plumber repair"
                value={expenseData.description}
                onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
                className="input-luxury"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense-amount">Amount ($)</Label>
              <Input
                id="expense-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={expenseData.amount}
                onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
                className="input-luxury"
              />
            </div>
            <Button type="submit" className="w-full btn-primary-luxury">
              Log Expense
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Quick Task Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Create Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleTaskSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Task</Label>
              <Input
                id="task-title"
                placeholder="e.g., Fix leaky faucet"
                value={taskData.title}
                onChange={(e) => setTaskData({ title: e.target.value })}
                className="input-luxury"
              />
            </div>
            <Button type="submit" className="w-full btn-primary-luxury">
              Create Task
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
