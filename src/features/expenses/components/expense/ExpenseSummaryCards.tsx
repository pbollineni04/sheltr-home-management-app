import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, ArrowUpDown } from "lucide-react";

interface SourceBreakdown {
  manual: number;
  service: number;
  plaid: number;
}

interface ExpenseSummaryCardsProps {
  thisMonthExpenses: number;
  totalExpenses: number;
  sourceBreakdown?: SourceBreakdown;
  trendPct?: number | null;
}

export const ExpenseSummaryCards = ({
  thisMonthExpenses,
  totalExpenses,
  sourceBreakdown,
  trendPct,
}: ExpenseSummaryCardsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-luxury">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption-refined text-muted-foreground">This Period</p>
                <p className="text-heading-xl text-foreground">${thisMonthExpenses.toLocaleString()}</p>
              </div>
              {trendPct != null ? (
                trendPct >= 0 ? (
                  <TrendingUp className="w-8 h-8 text-red-500" />
                ) : (
                  <TrendingDown className="w-8 h-8 text-green-600" />
                )
              ) : (
                <ArrowUpDown className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            {trendPct != null ? (
              <p className={`text-body-luxury mt-2 ${trendPct >= 0 ? "text-red-600" : "text-green-700"}`}>
                {trendPct >= 0 ? "+" : ""}{trendPct.toFixed(1)}% from last month
              </p>
            ) : (
              <p className="text-body-luxury text-muted-foreground mt-2">No previous data</p>
            )}
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption-refined text-muted-foreground">Total Expenses</p>
                <p className="text-heading-xl text-foreground">${totalExpenses.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-body-luxury text-muted-foreground mt-2">This period</p>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption-refined text-muted-foreground">Avg per Month</p>
                <p className="text-heading-xl text-foreground">
                  ${totalExpenses > 0 ? Math.round(totalExpenses / 12).toLocaleString() : "0"}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-body-luxury text-muted-foreground mt-2">12 month average</p>
          </CardContent>
        </Card>
      </div>

      {/* Expense Source Breakdown */}
      {sourceBreakdown && (sourceBreakdown.service > 0 || sourceBreakdown.plaid > 0) && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground px-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-foreground/40" />
            Manual: <span className="font-medium text-foreground">${sourceBreakdown.manual.toLocaleString()}</span>
          </span>
          {sourceBreakdown.service > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              From Services: <span className="font-medium text-foreground">${sourceBreakdown.service.toLocaleString()}</span>
            </span>
          )}
          {sourceBreakdown.plaid > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              From Plaid: <span className="font-medium text-foreground">${sourceBreakdown.plaid.toLocaleString()}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};