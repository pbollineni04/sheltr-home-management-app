
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckSquare,
  TrendingUp,
  Calendar,
  Wallet
} from "lucide-react";
import { useDashboardMetrics } from "@/features/dashboard/hooks/useDashboardMetrics";
import { PriorityAlertsCard } from "./cards/PriorityAlertsCard";
import { MonthSummaryCard } from "./cards/MonthSummaryCard";
import { ComingUpCard } from "./cards/ComingUpCard";
import { QuickCaptureCard } from "./cards/QuickCaptureCard";

interface DashboardOverviewProps {
  onNavigate: (tab: string) => void;
}

const DashboardOverview = ({ onNavigate }: DashboardOverviewProps) => {
  const { metrics, loading, freshnessSeconds, refresh } = useDashboardMetrics();

  // Calculate alerts for Priority Alerts card
  const alerts = [];
  if (metrics?.overdue_tasks > 0) {
    alerts.push({
      type: 'overdue_task' as const,
      message: `${metrics.overdue_tasks} overdue task${metrics.overdue_tasks > 1 ? 's' : ''}`,
      count: metrics.overdue_tasks,
      severity: 'high' as const
    });
  }
  // Add more alert logic here as needed

  // Calculate upcoming items for Coming Up card
  const upcomingItems = [
    // This would be populated from actual data
    // For now, showing empty state
  ];

  // Budget calculation
  const budgetTarget = 800; // This would come from user settings
  const budgetRemaining = budgetTarget - (metrics?.monthly_expenses ?? 0);
  const isBudgetExceeded = budgetRemaining < 0;

  // Mock data for month summary (would come from metrics)
  const lastMonthSpend = metrics ? metrics.monthly_expenses * 0.88 : 0; // Mock calculation
  const percentChange = metrics && lastMonthSpend > 0
    ? Math.round(((metrics.monthly_expenses - lastMonthSpend) / lastMonthSpend) * 100)
    : 0;

  return (
    <div className="space-y-8 px-3 sm:px-4">
      {/* Freshness + Dev Refresh */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          {loading
            ? 'Loading…'
            : metrics && typeof freshnessSeconds !== 'undefined' && freshnessSeconds !== null
              ? `Updated ${Math.floor(freshnessSeconds / 60)}m ${freshnessSeconds % 60}s ago`
              : ''}
        </p>
        {import.meta.env.DEV && (
          <Button
            className="w-full sm:w-auto"
            variant="outline"
            size="sm"
            title="Re-fetch dashboard metrics (dev only)"
            onClick={refresh}
          >
            Refresh
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="card-luxury">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">Active Tasks</p>
                <p className="text-3xl font-bold text-foreground">{loading ? "—" : (metrics?.pending_tasks ?? 0)}</p>
              </div>
              <CheckSquare className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-luxury">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">This Month</p>
                <p className="text-3xl font-bold text-foreground">{loading ? "—" : `$${(metrics?.monthly_expenses ?? 0).toFixed(2)}`}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-luxury">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">Recent Events</p>
                <p className="text-3xl font-bold text-foreground">{loading ? "—" : (metrics?.total_documents ?? 0)}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-luxury">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">Budget Left</p>
                <p className={`text-3xl font-bold ${loading ? 'text-foreground' : isBudgetExceeded ? 'text-destructive' : 'text-foreground'}`}>
                  {loading ? "—" : `$${Math.abs(budgetRemaining).toFixed(2)}`}
                </p>
              </div>
              <Wallet className={`w-8 h-8 ${isBudgetExceeded ? 'text-destructive' : 'text-green-600'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <PriorityAlertsCard alerts={alerts} onNavigate={onNavigate} />

        <MonthSummaryCard
          currentMonthSpend={metrics?.monthly_expenses ?? 0}
          budgetTarget={budgetTarget}
          percentChange={percentChange}
          onNavigate={onNavigate}
        />

        <ComingUpCard upcomingItems={upcomingItems} onNavigate={onNavigate} />

        <QuickCaptureCard
          onAddExpense={(data) => {
            console.log('Quick add expense:', data);
            // This would call the actual expense service
            onNavigate('expenses');
          }}
          onAddTask={(data) => {
            console.log('Quick add task:', data);
            // This would call the actual task service
            onNavigate('tasks');
          }}
        />
      </div>
    </div>
  );
};

export default DashboardOverview;
