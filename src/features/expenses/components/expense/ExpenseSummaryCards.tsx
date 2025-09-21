import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, DollarSign, TrendingDown } from "lucide-react";

interface ExpenseSummaryCardsProps {
  thisMonthExpenses: number;
  totalExpenses: number;
}

export const ExpenseSummaryCards = ({ thisMonthExpenses, totalExpenses }: ExpenseSummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="card-luxury">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption-refined text-muted-foreground">This Month</p>
              <p className="text-heading-xl text-foreground">${thisMonthExpenses.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-body-luxury text-green-700 mt-2">+12% from last month</p>
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
          <p className="text-body-luxury text-muted-foreground mt-2">All time</p>
        </CardContent>
      </Card>
      
      <Card className="card-luxury">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption-refined text-muted-foreground">Avg per Month</p>
              <p className="text-heading-xl text-foreground">${Math.round(totalExpenses / 12).toLocaleString()}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-body-luxury text-muted-foreground mt-2">12 month average</p>
        </CardContent>
      </Card>
    </div>
  );
};