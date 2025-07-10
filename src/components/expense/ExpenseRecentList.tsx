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
}

interface ExpenseRecentListProps {
  expenses: Expense[];
  getCategoryColor: (category: string) => string;
}

export const ExpenseRecentList = ({ expenses, getCategoryColor }: ExpenseRecentListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-medium text-foreground">{expense.description}</h4>
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
              <div className="text-right">
                <p className="text-xl font-bold text-foreground">${expense.amount.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
