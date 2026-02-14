
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
} from "lucide-react";
import { useDashboardMetrics } from "@/features/dashboard/hooks/useDashboardMetrics";
import { useBudget } from "@/hooks/useBudget";
import { staggerContainer, staggerContainerFast, fadeUpItem } from "@/lib/motion";

interface DashboardOverviewProps {
  onNavigate: (tab: string) => void;
}

const DashboardOverview = ({ onNavigate }: DashboardOverviewProps) => {
  const { metrics, loading } = useDashboardMetrics();
  const { budget: budgetTarget } = useBudget();

  const monthlyExpenses = metrics?.monthly_expenses ?? 0;
  const pendingTasks = metrics?.pending_tasks ?? 0;
  const completedTasks = (metrics as any)?.completed_tasks ?? 3;
  const totalDocuments = metrics?.total_documents ?? 0;

  // Mock data for sections not yet backed by Supabase
  const recentExpenses = [
    { id: "1", description: "Grocery shopping", amount: 145.5, category: "Groceries", date: "2026-02-08" },
    { id: "2", description: "Electric bill", amount: 89.0, category: "Utilities", date: "2026-02-05" },
    { id: "3", description: "Home insurance", amount: 120.0, category: "Insurance", date: "2026-02-01" },
  ];

  const upcomingEvents = [
    { id: "1", title: "Furniture Delivery", date: "2026-02-12", time: "14:00", type: "delivery" },
    { id: "2", title: "HVAC Maintenance", date: "2026-02-15", time: "10:00", type: "maintenance" },
    { id: "3", title: "House Party", date: "2026-02-20", time: "18:00", type: "event" },
  ];

  const urgentTasks = [
    { id: "1", title: "Fix leaky faucet", priority: "high", dueDate: "2026-02-12" },
    { id: "2", title: "Paint bedroom walls", priority: "medium", dueDate: "2026-02-18" },
  ];

  const utilities = [
    { type: "Electricity", cost: 102.5, change: 3.9, trend: "up" as const },
    { type: "Water", cost: 45.8, change: -7.5, trend: "down" as const },
    { type: "Gas", cost: 78.3, change: 18.2, trend: "up" as const },
    { type: "Internet", cost: 79.99, change: 0, trend: "neutral" as const },
  ];

  const totalUtilities = utilities.reduce((s, u) => s + u.cost, 0);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Welcome Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-6 md:p-8 text-primary-foreground shadow-lg"
      >
        <div className="flex items-center gap-3 mb-3">
          <HomeIcon size={32} className="hidden md:block" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Welcome Home!</h1>
            <p className="text-primary-foreground/70 text-sm md:text-base mt-1">
              Here's what's happening with your home today
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 md:p-4">
            <p className="text-primary-foreground/70 text-xs mb-1">This Month</p>
            <p className="text-xl md:text-2xl font-bold">
              {loading ? "—" : `$${monthlyExpenses.toFixed(0)}`}
            </p>
            <p className="text-xs text-primary-foreground/70 mt-1">Expenses</p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 md:p-4">
            <p className="text-primary-foreground/70 text-xs mb-1">Upcoming</p>
            <p className="text-xl md:text-2xl font-bold">{upcomingEvents.length}</p>
            <p className="text-xs text-primary-foreground/70 mt-1">Events</p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 md:p-4">
            <p className="text-primary-foreground/70 text-xs mb-1">Pending</p>
            <p className="text-xl md:text-2xl font-bold">{loading ? "—" : pendingTasks}</p>
            <p className="text-xs text-primary-foreground/70 mt-1">Tasks</p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 md:p-4">
            <p className="text-primary-foreground/70 text-xs mb-1">Utilities</p>
            <p className="text-xl md:text-2xl font-bold">${totalUtilities.toFixed(0)}</p>
            <p className="text-xs text-primary-foreground/70 mt-1">This Month</p>
          </div>
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
          <p className="text-2xl font-bold text-foreground">
            {loading ? "—" : `$${monthlyExpenses.toFixed(2)}`}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="text-destructive" size={14} />
            <span className="text-xs text-destructive">+12.5% from last month</span>
          </div>
        </motion.button>

        {/* Events card */}
        <motion.button
          variants={fadeUpItem}
          onClick={() => onNavigate("timeline")}
          className="bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <Calendar className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <ArrowRight className="text-muted-foreground group-hover:text-primary transition-colors" size={20} />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Upcoming Events</p>
          <p className="text-2xl font-bold text-foreground">{upcomingEvents.length}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Next: {upcomingEvents[0]?.title}
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
          <p className="text-2xl font-bold text-foreground">
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
          <p className="text-2xl font-bold text-foreground">${totalUtilities.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-2">4 utilities tracked</p>
        </motion.button>
      </motion.div>

      {/* Main Content Grid — 3 columns */}
      <motion.div
        variants={staggerContainerFast}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6"
      >
        {/* Recent Expenses */}
        <motion.div variants={fadeUpItem} className="bg-card rounded-xl shadow-sm border border-border">
          <div className="p-4 md:p-6 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-lg text-foreground">Recent Expenses</h2>
            <button
              onClick={() => onNavigate("expenses")}
              className="text-sm text-primary hover:text-primary/80"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-border">
            {recentExpenses.map((expense) => (
              <div key={expense.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{expense.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{expense.category}</p>
                  </div>
                  <span className="font-semibold text-foreground text-sm">${expense.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div variants={fadeUpItem} className="bg-card rounded-xl shadow-sm border border-border">
          <div className="p-4 md:p-6 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-lg text-foreground">Upcoming Events</h2>
            <button
              onClick={() => onNavigate("timeline")}
              className="text-sm text-primary hover:text-primary/80"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-border">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{event.title}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock size={12} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{event.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Urgent Tasks */}
        <motion.div variants={fadeUpItem} className="bg-card rounded-xl shadow-sm border border-border">
          <div className="p-4 md:p-6 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-lg text-foreground">Urgent Tasks</h2>
            <button
              onClick={() => onNavigate("tasks")}
              className="text-sm text-primary hover:text-primary/80"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-border">
            {urgentTasks.map((task) => (
              <div key={task.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-orange-500 flex-shrink-0 mt-1" size={18} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{task.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${task.priority === "high"
                            ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
                          }`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Due: {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="p-4">
              <p className="text-xs text-muted-foreground text-center">
                {pendingTasks - urgentTasks.length > 0
                  ? `${pendingTasks - urgentTasks.length} more tasks pending`
                  : "No more pending tasks"}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Utilities Overview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-card rounded-xl shadow-sm border border-border"
      >
        <div className="p-4 md:p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-lg text-foreground">Utilities Overview</h2>
          <button
            onClick={() => onNavigate("energy")}
            className="text-sm text-primary hover:text-primary/80"
          >
            View Details
          </button>
        </div>
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {utilities.map((utility, index) => (
              <div key={index} className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">{utility.type}</p>
                  {utility.trend !== "neutral" && (
                    <div
                      className={`flex items-center gap-1 ${utility.trend === "up" ? "text-destructive" : "text-green-500"
                        }`}
                    >
                      {utility.trend === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      <span className="text-xs font-medium">{Math.abs(utility.change)}%</span>
                    </div>
                  )}
                </div>
                <p className="text-xl font-bold text-foreground">${utility.cost}</p>
                <p className="text-xs text-muted-foreground mt-1">This month</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-gradient-to-br from-muted/30 to-primary/5 rounded-xl p-4 md:p-6 border border-border"
      >
        <h2 className="font-semibold text-lg text-foreground mb-4">Quick Actions</h2>
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
            onClick={() => onNavigate("timeline")}
            className="bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-all text-center group"
          >
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60 transition-colors">
              <Calendar className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <p className="text-sm font-medium text-foreground">Add Event</p>
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
    </div>
  );
};

export default DashboardOverview;
