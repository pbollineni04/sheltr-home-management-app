import { motion } from "framer-motion";
import {
    DollarSign,
    CheckSquare,
    Wrench,
    TrendingUp,
    TrendingDown,
    Zap,
    BarChart3,
} from "lucide-react";
import type { DashboardMetrics } from "../hooks/useDashboardMetrics";

interface MonthlyReportProps {
    metrics: DashboardMetrics;
}

const MonthlyReport = ({ metrics }: MonthlyReportProps) => {
    const trendPct = metrics.expense_trend_pct;

    // Calculate services completed this month
    // (upcoming_services is scheduled, but we can show metric counts)
    const hasMeaningfulData =
        metrics.monthly_expenses > 0 ||
        metrics.completed_tasks > 0 ||
        metrics.utility_summary.length > 0;

    if (!hasMeaningfulData) return null;

    const totalUtilities = metrics.utility_summary.reduce((s, u) => s + u.latest_cost, 0);

    // Simple bar chart data from category breakdown
    const categoryTotals = metrics.recent_expenses.reduce<Record<string, number>>((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
    }, {});
    const topCategories = Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4);
    const maxAmount = Math.max(...topCategories.map(([, v]) => v), 1);

    const categoryColors: Record<string, string> = {
        renovation: "bg-blue-500",
        maintenance: "bg-green-500",
        appliances: "bg-purple-500",
        services: "bg-orange-500",
        utilities: "bg-yellow-500",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-card rounded-xl shadow-sm border border-border"
        >
            <div className="p-4 md:p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BarChart3 className="text-primary" size={20} />
                    <h2 className="font-semibold text-lg text-foreground">Monthly Report</h2>
                </div>
                <span className="text-xs text-muted-foreground">
                    {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
            </div>

            <div className="p-4 md:p-6">
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Spending */}
                    <div className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <DollarSign size={14} className="text-green-600" />
                            <span className="text-xs text-muted-foreground">Total Spent</span>
                        </div>
                        <p className="text-lg font-bold text-foreground">
                            ${metrics.monthly_expenses.toLocaleString()}
                        </p>
                        {trendPct != null && (
                            <div className="flex items-center gap-1 mt-1">
                                {trendPct >= 0 ? (
                                    <TrendingUp size={10} className="text-red-500" />
                                ) : (
                                    <TrendingDown size={10} className="text-green-500" />
                                )}
                                <span className={`text-[10px] ${trendPct >= 0 ? "text-red-500" : "text-green-500"}`}>
                                    {trendPct >= 0 ? "+" : ""}{trendPct.toFixed(0)}% vs last month
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Tasks */}
                    <div className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <CheckSquare size={14} className="text-orange-600" />
                            <span className="text-xs text-muted-foreground">Tasks Done</span>
                        </div>
                        <p className="text-lg font-bold text-foreground">{metrics.completed_tasks}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                            {metrics.pending_tasks} still pending
                        </p>
                    </div>

                    {/* Services */}
                    <div className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Wrench size={14} className="text-blue-600" />
                            <span className="text-xs text-muted-foreground">Upcoming</span>
                        </div>
                        <p className="text-lg font-bold text-foreground">
                            {metrics.upcoming_services.length + metrics.upcoming_recurrences.length}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">services scheduled</p>
                    </div>

                    {/* Utilities */}
                    <div className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap size={14} className="text-purple-600" />
                            <span className="text-xs text-muted-foreground">Utilities</span>
                        </div>
                        <p className="text-lg font-bold text-foreground">
                            {metrics.utility_summary.length > 0
                                ? `$${totalUtilities.toFixed(0)}`
                                : "—"}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                            {metrics.utility_summary.length} tracked
                        </p>
                    </div>
                </div>

                {/* Simple Category Bars */}
                {topCategories.length > 0 && (
                    <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                            Spending by Category
                        </h3>
                        <div className="space-y-2">
                            {topCategories.map(([category, amount]) => (
                                <div key={category} className="flex items-center gap-3">
                                    <span className="text-xs text-muted-foreground w-24 truncate capitalize">{category}</span>
                                    <div className="flex-1 bg-muted rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all ${categoryColors[category] || "bg-gray-500"}`}
                                            style={{ width: `${(amount / maxAmount) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-medium text-foreground w-16 text-right">
                                        ${amount.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default MonthlyReport;
