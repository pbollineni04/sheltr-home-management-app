import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MonthSummaryCardProps {
  currentMonthSpend: number;
  budgetTarget?: number;
  percentChange: number;
  onNavigate: (tab: string) => void;
}

export const MonthSummaryCard = ({
  currentMonthSpend,
  budgetTarget,
  percentChange,
  onNavigate
}: MonthSummaryCardProps) => {
  const hasExceeded = budgetTarget && currentMonthSpend > budgetTarget;
  const progress = budgetTarget ? (currentMonthSpend / budgetTarget) * 100 : 0;
  const isIncreasing = percentChange > 0;

  return (
    <Card className="card-luxury hover:shadow-lg transition-shadow border-l-4 border-l-blue-600 dark:border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-heading-xl">
          <DollarSign className="w-5 h-5 text-blue-600" />
          This Month
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Spending Amount */}
        <div>
          <p className="text-4xl font-bold text-foreground">
            ${currentMonthSpend.toLocaleString()}
          </p>
          {budgetTarget && (
            <p className="text-sm text-muted-foreground mt-1">
              of ${budgetTarget.toLocaleString()} budget
            </p>
          )}
        </div>

        {/* Progress Bar */}
        {budgetTarget && (
          <div className="space-y-2">
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  hasExceeded
                    ? 'bg-destructive'
                    : progress > 80
                      ? 'bg-orange-500'
                      : 'bg-blue-600'
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            {hasExceeded && (
              <p className="text-sm text-destructive font-medium">
                Over budget by ${(currentMonthSpend - budgetTarget).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {/* Trend Indicator */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            {isIncreasing ? (
              <TrendingUp className="w-4 h-4 text-orange-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-green-600" />
            )}
            <span className={`text-sm font-medium ${isIncreasing ? 'text-orange-600' : 'text-green-600'}`}>
              {Math.abs(percentChange)}% {isIncreasing ? 'more' : 'less'} than last month
            </span>
          </div>
        </div>

        {/* View Details Button */}
        <Button
          onClick={() => onNavigate('expenses')}
          variant="outline"
          className="w-full btn-secondary-luxury mt-2"
          size="sm"
        >
          View Breakdown
        </Button>
      </CardContent>
    </Card>
  );
};
