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
  periodLabel?: string;
}

export const ExpenseRecentList = ({ expenses, getCategoryColor, periodLabel = "Recent Expenses" }: ExpenseRecentListProps) => {
  return (
    <Card className="card-luxury">
      <CardHeader>
        <CardTitle className="text-heading-xl text-foreground">{periodLabel}</CardTitle>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <div className="text-sm text-muted-foreground p-4">No expenses yet. Add one to get started.</div>
        ) : (
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div key={expense.id} className="w-full p-3 sm:p-4 rounded-lg bg-muted/50">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full">
                {/* Left section: Title, badges, and metadata */}
                <div className="flex-1 min-w-0">
                  {/* Mobile: Title on left, category badge on right */}
                  <div className="flex sm:hidden items-start justify-between gap-2 mb-2">
                    <h4 className="font-medium text-foreground break-words flex-1">{expense.description}</h4>
                    {/* Category badge - top right on mobile */}
                    <Badge className={`${getCategoryColor(expense.category)} shrink-0`}>
                      {expense.category}
                    </Badge>
                  </div>

                  {/* Desktop: Title and badges inline */}
                  <div className="hidden sm:flex sm:items-center gap-2 mb-2">
                    <h4 className="font-medium text-foreground break-words">{expense.description}</h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      {expense.metadata?.source === 'plaid' && (
                        <Badge variant="secondary" className="bg-sky-100 text-sky-800 border border-sky-200 shrink-0">Imported</Badge>
                      )}
                      <Badge className={`${getCategoryColor(expense.category)} shrink-0`}>
                        {expense.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Imported badge for mobile (below title) */}
                  {expense.metadata?.source === 'plaid' && (
                    <div className="mb-2 sm:hidden">
                      <Badge variant="secondary" className="bg-sky-100 text-sky-800 border border-sky-200 shrink-0">Imported</Badge>
                    </div>
                  )}

                  {/* Metadata row */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 shrink-0">
                      <span className="font-medium">Vendor:</span> {expense.vendor}
                    </span>
                    <span className="flex items-center gap-1 shrink-0">
                      <Calendar className="w-4 h-4" />
                      {new Date(expense.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 shrink-0">
                      <Home className="w-4 h-4" />
                      {expense.room}
                    </span>
                    {/* Amount - bottom right on mobile only */}
                    <span className="sm:hidden ml-auto font-bold text-foreground text-base">
                      ${expense.amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Right section: Amount (desktop only, vertically centered) */}
                <div className="hidden sm:block text-right shrink-0">
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