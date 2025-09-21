import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Home } from "lucide-react";

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  vendor: string;
  room: string;
  metadata?: { source?: string } | null;
}

interface ExpenseRecentListProps {
  expenses: Expense[];
  getCategoryColor: (category: string) => string;
}

export const ExpenseRecentList = ({ expenses, getCategoryColor }: ExpenseRecentListProps) => {
  return (
    <Card className="card-luxury">
      <CardHeader>
        <CardTitle className="text-heading-xl text-foreground">Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <div className="text-sm text-muted-foreground p-4">No expenses yet. Add one to get started.</div>
        ) : (
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div key={expense.id} className="w-full p-4 rounded-lg bg-muted/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-medium text-foreground">{expense.description}</h4>
                    {expense.metadata?.source === 'plaid' && (
                      <Badge variant="secondary" className="bg-sky-100 text-sky-800 border border-sky-200">Imported</Badge>
                    )}
                    <Badge className={getCategoryColor(expense.category)}>
                      {expense.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{expense.vendor}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(expense.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Home className="w-4 h-4" />
                      {expense.room}
                    </span>
                  </div>
                </div>
                <div className="sm:text-right shrink-0">
                  <p className="text-xl font-bold text-foreground whitespace-nowrap">${expense.amount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </CardContent>
    </Card>
  );
};