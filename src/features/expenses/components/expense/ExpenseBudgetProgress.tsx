import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import { BudgetSettingsDialog } from "@/features/dashboard/components/BudgetSettingsDialog";

interface ExpenseBudgetProgressProps {
  currentSpend: number;
  budget: number;
  onBudgetUpdate: (newBudget: number) => void;
  periodLabel: string;
}

export const ExpenseBudgetProgress = ({
  currentSpend,
  budget,
  onBudgetUpdate,
  periodLabel
}: ExpenseBudgetProgressProps) => {
  const progress = budget > 0 ? (currentSpend / budget) * 100 : 0;
  const remaining = budget - currentSpend;
  const isOverBudget = remaining < 0;
  const isNearLimit = !isOverBudget && progress > 80;

  const getStatusColor = () => {
    if (isOverBudget) return "text-destructive";
    if (isNearLimit) return "text-orange-600 dark:text-orange-400";
    return "text-green-600 dark:text-green-400";
  };

  const getProgressColor = () => {
    if (isOverBudget) return "bg-destructive";
    if (isNearLimit) return "bg-orange-500";
    return "bg-green-600";
  };

  const StatusIcon = isOverBudget ? AlertTriangle : isNearLimit ? TrendingUp : CheckCircle;

  return (
    <Card className="card-luxury">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <StatusIcon className={`w-5 h-5 ${getStatusColor()}`} />
                {periodLabel} Budget
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Track your spending against your monthly budget
              </p>
            </div>
            <BudgetSettingsDialog
              currentBudget={budget}
              onBudgetUpdate={onBudgetUpdate}
            />
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Spent</span>
              <span className="font-medium text-foreground">
                ${currentSpend.toLocaleString()} of ${budget.toLocaleString()}
              </span>
            </div>
            <Progress
              value={Math.min(progress, 100)}
              className="h-3"
              indicatorClassName={getProgressColor()}
            />
            <div className="flex justify-between items-center">
              <span className={`text-sm font-medium ${getStatusColor()}`}>
                {progress.toFixed(1)}% used
              </span>
              <span className={`text-sm font-bold ${getStatusColor()}`}>
                {isOverBudget ? (
                  <>Over by ${Math.abs(remaining).toLocaleString()}</>
                ) : (
                  <>${remaining.toLocaleString()} remaining</>
                )}
              </span>
            </div>
          </div>

          {/* Status Message */}
          {isOverBudget && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">
                You've exceeded your monthly budget. Consider reviewing your expenses or adjusting your budget.
              </p>
            </div>
          )}

          {isNearLimit && !isOverBudget && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
              <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
              <p className="text-sm text-orange-800 dark:text-orange-200">
                You're approaching your budget limit. You have ${remaining.toLocaleString()} left for this month.
              </p>
            </div>
          )}

          {!isOverBudget && !isNearLimit && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
              <p className="text-sm text-green-800 dark:text-green-200">
                You're on track! You have ${remaining.toLocaleString()} remaining in your budget.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
