
import { motion } from "framer-motion";
import {
  DollarSign,
  Calendar,
  CheckSquare,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Clock,
  ArrowRight,
  Home as HomeIcon,
  Wallet,
  Repeat,
} from "lucide-react";
import { useDashboardMetrics } from "@/features/dashboard/hooks/useDashboardMetrics";
import { useBudget } from "@/hooks/useBudget";
import { staggerContainer, staggerContainerFast, fadeUpItem, easeDefault } from "@/lib/motion";
import NeedsAttentionBanner from "./NeedsAttentionBanner";
import MonthlyReport from "./MonthlyReport";
import RecentActivityFeed from "./RecentActivityFeed";

interface DashboardOverviewProps {
  onNavigate: (tab: string) => void;
}

const DashboardOverview = ({ onNavigate }: DashboardOverviewProps) => {
  const { metrics, loading } = useDashboardMetrics();
  const { budget: budgetTarget } = useBudget();

  const monthlyExpenses = metrics?.monthly_expenses ?? 0;
  const pendingTasks = metrics?.pending_tasks ?? 0;
  const completedTasks = metrics?.completed_tasks ?? 0;
  const totalDocuments = metrics?.total_documents ?? 0;
  const trendPct = metrics?.expense_trend_pct;
  const homeEquity = metrics?.home_equity;
  const homeValue = metrics?.home_value;

  // Real data from expanded hook
  const recentExpenses = metrics?.recent_expenses ?? [];
  const urgentTasks = metrics?.urgent_tasks ?? [];

  // Combine upcoming services and recurrences into a unified "upcoming" list
  const upcomingEvents = [
    ...(metrics?.upcoming_services ?? []).map((s) => ({
      id: s.id,
      title: s.title,
      date: s.scheduled_date,
      time: s.scheduled_time || null,
      type: "service" as const,
      subtitle: s.provider?.name || s.category,
    })),
    ...(metrics?.upcoming_recurrences ?? []).map((r) => ({
      id: r.id,
      title: r.title,
      date: r.next_due_date,
      time: null,
      type: "recurrence" as const,
      subtitle: r.frequency,
    })),
  ]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  // Real utility data
  const utilities = metrics?.utility_summary ?? [];
  const totalUtilities = utilities.reduce((s, u) => s + u.latest_cost, 0);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Needs Attention Banner */}
      {metrics && <NeedsAttentionBanner metrics={metrics} onNavigate={onNavigate} />}

      {/* Welcome Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={easeDefault}
        className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-6 md:p-8 text-primary-foreground shadow-lg"
      >
        <div className="flex items-center gap-3 mb-3">
          <HomeIcon size={32} className="hidden md:block" />
          <div>
            <h1 className="text-heading-xl md:text-display-lg">Welcome Home!</h1>
            <p className="text-primary-foreground/70 text-sm md:text-base mt-1">
              Here's what's happening with your home today
            </p>
          </div>
        </div>
        <div className={`grid grid-cols-2 ${homeEquity !== null ? "md:grid-cols-5" : "md:grid-cols-4"} gap-3 md:gap-4 mt-6`}>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 md:p-4">
            <p className="text-primary-foreground/70 text-xs mb-1">This Month</p>
            <p className="text-xl md:text-2xl font-bold">
              {loading ? "—" : `$${monthlyExpenses.toFixed(0)}`}
            </p>
            <p className="text-xs text-primary-foreground/70 mt-1">Expenses</p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 md:p-4">
            <p className="text-primary-foreground/70 text-xs mb-1">Upcoming</p>
            <p className="text-xl md:text-2xl font-bold">{loading ? "—" : upcomingEvents.length}</p>
            <p className="text-xs text-primary-foreground/70 mt-1">Events</p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 md:p-4">
            <p className="text-primary-foreground/70 text-xs mb-1">Pending</p>
            <p className="text-xl md:text-2xl font-bold">{loading ? "—" : pendingTasks}</p>
            <p className="text-xs text-primary-foreground/70 mt-1">Tasks</p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 md:p-4">
            <p className="text-primary-foreground/70 text-xs mb-1">Utilities</p>
            <p className="text-xl md:text-2xl font-bold">
              {loading ? "—" : utilities.length > 0 ? `$${totalUtilities.toFixed(0)}` : "—"}
            </p>
            <p className="text-xs text-primary-foreground/70 mt-1">This Month</p>
          </div>
          {homeEquity != null && (
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 md:p-4 col-span-2 md:col-span-1">
              <p className="text-primary-foreground/70 text-xs mb-1">Home Equity</p>
              <p className="text-xl md:text-2xl font-bold">
                ${((homeEquity ?? 0) / 1000).toFixed(0)}k
              </p>
              <p className="text-xs text-primary-foreground/70 mt-1">
                {homeValue ? `of $${(homeValue / 1000).toFixed(0)}k value` : "Equity"}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Stats Grid — clickable cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Expenses card */}
        <motion.button
          variants={fadeUpItem}
          onClick={() => onNavigate("expenses")}
          className="bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-lg">
              <DollarSign className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <ArrowRight className="text-muted-foreground group-hover:text-primary transition-colors" size={20} />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Monthly Expenses</p>
          <p className="text-heading-xl text-foreground">
            {loading ? "—" : `$${monthlyExpenses.toFixed(2)}`}
          </p>
          {!loading && trendPct != null && (
            <div className="flex items-center gap-1 mt-2">
              {(trendPct ?? 0) >= 0 ? (
                <TrendingUp className="text-destructive" size={14} />
              ) : (
                <TrendingDown className="text-green-500" size={14} />
              )}
              <span className={`text-xs ${(trendPct ?? 0) >= 0 ? "text-destructive" : "text-green-500"}`}>
                {(trendPct ?? 0) >= 0 ? "+" : ""}{(trendPct ?? 0).toFixed(1)}% from last month
              </span>
            </div>
          )}
          {!loading && trendPct === null && (
            <p className="text-xs text-muted-foreground mt-2">No previous month data</p>
          )}
        </motion.button>

        {/* Events card */}
        <motion.button
          variants={fadeUpItem}
          onClick={() => onNavigate("services")}
          className="bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <Calendar className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <ArrowRight className="text-muted-foreground group-hover:text-primary transition-colors" size={20} />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Upcoming Services</p>
          <p className="text-heading-xl text-foreground">{loading ? "—" : upcomingEvents.length}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {upcomingEvents.length > 0
              ? `Next: ${upcomingEvents[0]?.title}`
              : "No upcoming services"}
          </p>
        </motion.button>

        {/* Tasks card */}
        <motion.button
          variants={fadeUpItem}
          onClick={() => onNavigate("tasks")}
          className="bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
              <CheckSquare className="text-orange-600 dark:text-orange-400" size={24} />
            </div>
            <ArrowRight className="text-muted-foreground group-hover:text-primary transition-colors" size={20} />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Tasks Progress</p>
          <p className="text-heading-xl text-foreground">
            {loading ? "—" : `${completedTasks}/${completedTasks + pendingTasks}`}
          </p>
          <div className="mt-2 bg-muted rounded-full h-2">
            <div
              className="bg-orange-600 dark:bg-orange-400 h-2 rounded-full transition-all"
              style={{
                width: `${pendingTasks + completedTasks > 0
                  ? (completedTasks / (pendingTasks + completedTasks)) * 100
                  : 0}%`,
              }}
            />
          </div>
        </motion.button>

        {/* Utilities card */}
        <motion.button
          variants={fadeUpItem}
          onClick={() => onNavigate("energy")}
          className="bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
              <Zap className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <ArrowRight className="text-muted-foreground group-hover:text-primary transition-colors" size={20} />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Utilities Cost</p>
          <p className="text-heading-xl text-foreground">
            {loading
              ? "—"
              : utilities.length > 0
                ? `$${totalUtilities.toFixed(2)}`
                : "—"}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {utilities.length > 0 ? `${utilities.length} utilities tracked` : "No utility data yet"}
          </p>
        </motion.button>
      </motion.div>

      {/* Main Content Grid — 3 columns */}
      <motion.div
        variants={staggerContainerFast}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6"
      >
        {/* Recent Activity Feed */}
        <motion.div variants={fadeUpItem}>
          <RecentActivityFeed
            activities={metrics?.recent_activity ?? []}
            loading={loading}
            onNavigate={onNavigate}
          />
        </motion.div>

        {/* Upcoming Events (Services + Recurrences) */}
        <motion.div variants={fadeUpItem} className="bg-card rounded-xl shadow-sm border border-border">
          <div className="p-4 md:p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-heading-lg text-foreground">Upcoming Services</h2>
            <button
              onClick={() => onNavigate("services")}
              className="text-sm text-primary hover:text-primary/80"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-border">
            {loading ? (
              <div className="p-6 text-center text-muted-foreground text-sm">Loading...</div>
            ) : upcomingEvents.length === 0 ? (
              <div className="p-6 text-center">
                <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No upcoming services</p>
                <button
                  onClick={() => onNavigate("services")}
                  className="text-xs text-primary hover:underline mt-1"
                >
                  Schedule a service →
                </button>
              </div>
            ) : (
              upcomingEvents.map((event) => (
                <div key={event.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex flex-col items-center justify-center">
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        {new Date(event.date + "T00:00:00").toLocaleDateString("en-US", { month: "short" })}
                      </span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {new Date(event.date + "T00:00:00").getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground text-sm">{event.title}</p>
                        {event.type === "recurrence" && (
                          <Repeat size={12} className="text-muted-foreground shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {event.time ? (
                          <>
                            <Clock size={12} className="text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{event.time}</span>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">{event.subtitle}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Urgent Tasks */}
        <motion.div variants={fadeUpItem} className="bg-card rounded-xl shadow-sm border border-border">
          <div className="p-4 md:p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-heading-lg text-foreground">Urgent Tasks</h2>
            <button
              onClick={() => onNavigate("tasks")}
              className="text-sm text-primary hover:text-primary/80"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-border">
            {loading ? (
              <div className="p-6 text-center text-muted-foreground text-sm">Loading...</div>
            ) : urgentTasks.length === 0 ? (
              <div className="p-6 text-center">
                <CheckSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">All caught up!</p>
                <p className="text-xs text-muted-foreground mt-1">No pending tasks</p>
              </div>
            ) : (
              <>
                {urgentTasks.map((task) => {
                  const isOverdue = task.due_date && new Date(task.due_date) < new Date();
                  return (
                    <div key={task.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <AlertCircle
                          className={`flex-shrink-0 mt-1 ${isOverdue ? "text-destructive" : "text-orange-500"}`}
                          size={18}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground text-sm">{task.title}</p>
                            {task.metadata && (task.metadata as any).source === "service" && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 shrink-0">
                                Service Prep
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${task.priority === "high"
                                ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                                : task.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
                                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                }`}
                            >
                              {task.priority}
                            </span>
                            {task.due_date && (
                              <span className={`text-xs ${isOverdue ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                                {isOverdue ? "Overdue: " : "Due: "}
                                {new Date(task.due_date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {pendingTasks - urgentTasks.length > 0 && (
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground text-center">
                      {pendingTasks - urgentTasks.length} more tasks pending
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Utilities Overview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...easeDefault, delay: 0.3 }}
        className="bg-card rounded-xl shadow-sm border border-border"
      >
        <div className="p-4 md:p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-heading-lg text-foreground">Utilities Overview</h2>
          <button
            onClick={() => onNavigate("energy")}
            className="text-sm text-primary hover:text-primary/80"
          >
            View Details
          </button>
        </div>
        <div className="p-4 md:p-6">
          {loading ? (
            <div className="text-center text-muted-foreground text-sm py-4">Loading...</div>
          ) : utilities.length === 0 ? (
            <div className="text-center py-6">
              <Zap className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No utility data yet</p>
              <button
                onClick={() => onNavigate("energy")}
                className="text-xs text-primary hover:underline mt-1"
              >
                Connect your utilities or add readings →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {utilities.map((utility, index) => (
                <div key={index} className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground capitalize">{utility.utility_type}</p>
                    {utility.change_pct !== null && (
                      <div
                        className={`flex items-center gap-1 ${utility.change_pct > 0 ? "text-destructive" : "text-green-500"
                          }`}
                      >
                        {utility.change_pct > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        <span className="text-xs font-medium">{Math.abs(utility.change_pct).toFixed(1)}%</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xl font-bold text-foreground">${utility.latest_cost.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Latest reading</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...easeDefault, delay: 0.4 }}
        className="bg-gradient-to-br from-muted/30 to-primary/5 rounded-xl p-4 md:p-6 border border-border"
      >
        <h2 className="text-heading-lg text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate("homewealth")}
            className="bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-all text-center group"
          >
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/60 transition-colors">
              <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={20} />
            </div>
            <p className="text-sm font-medium text-foreground">HomeWealth</p>
          </button>
          <button
            onClick={() => onNavigate("expenses")}
            className="bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-all text-center group"
          >
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-green-200 dark:group-hover:bg-green-900/60 transition-colors">
              <DollarSign className="text-green-600 dark:text-green-400" size={20} />
            </div>
            <p className="text-sm font-medium text-foreground">Add Expense</p>
          </button>
          <button
            onClick={() => onNavigate("services")}
            className="bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-all text-center group"
          >
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60 transition-colors">
              <Calendar className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <p className="text-sm font-medium text-foreground">Schedule Service</p>
          </button>
          <button
            onClick={() => onNavigate("tasks")}
            className="bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-all text-center group"
          >
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/40 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/60 transition-colors">
              <CheckSquare className="text-orange-600 dark:text-orange-400" size={20} />
            </div>
            <p className="text-sm font-medium text-foreground">Add Task</p>
          </button>
        </div>
      </motion.div>

      {/* Monthly Report */}
      {metrics && <MonthlyReport metrics={metrics} />}
    </div>
  );
};

export default DashboardOverview;
