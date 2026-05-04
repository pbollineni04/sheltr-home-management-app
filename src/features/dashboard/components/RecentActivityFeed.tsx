import {
  DollarSign,
  CheckSquare,
  FileText,
  Zap,
  Wrench,
  Clock,
  ArrowRight,
} from "lucide-react";
import type { RecentActivity } from "../hooks/useDashboardMetrics";

interface RecentActivityFeedProps {
  activities: RecentActivity[];
  loading: boolean;
  onNavigate: (tab: string) => void;
}

const SOURCE_CONFIG: Record<string, {
  icon: typeof DollarSign;
  color: string;
  bgColor: string;
  tab: string;
  label: string;
}> = {
  expense: {
    icon: DollarSign,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/40",
    tab: "expenses",
    label: "Expense",
  },
  task: {
    icon: CheckSquare,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/40",
    tab: "tasks",
    label: "Task completed",
  },
  document: {
    icon: FileText,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/40",
    tab: "vault",
    label: "Document",
  },
  energy_anomaly: {
    icon: Zap,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/40",
    tab: "energy",
    label: "Energy alert",
  },
  service: {
    icon: Wrench,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/40",
    tab: "services",
    label: "Service",
  },
  manual: {
    icon: Clock,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    tab: "timeline",
    label: "Event",
  },
};

function getConfig(source: string) {
  return SOURCE_CONFIG[source] || SOURCE_CONFIG.manual;
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const RecentActivityFeed = ({ activities, loading, onNavigate }: RecentActivityFeedProps) => {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border">
      <div className="p-4 md:p-6 border-b border-border flex items-center justify-between">
        <h2 className="text-heading-lg text-foreground">Recent Activity</h2>
        <button
          onClick={() => onNavigate("timeline")}
          className="text-sm text-primary hover:text-primary/80"
        >
          View Timeline
        </button>
      </div>
      <div className="divide-y divide-border">
        {loading ? (
          <div className="p-6 text-center text-muted-foreground text-sm">Loading...</div>
        ) : activities.length === 0 ? (
          <div className="p-6 text-center">
            <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No recent activity</p>
            <p className="text-xs text-muted-foreground mt-1">
              Activity from expenses, tasks, documents, and more will appear here
            </p>
          </div>
        ) : (
          activities.map((activity) => {
            const config = getConfig(activity.source);
            const Icon = config.icon;

            return (
              <button
                key={activity.id}
                onClick={() => onNavigate(config.tab)}
                className="w-full p-4 hover:bg-muted/50 transition-colors text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 ${config.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon size={16} className={config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-foreground text-sm truncate">
                        {activity.title}
                      </p>
                      <ArrowRight
                        size={14}
                        className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {config.label}
                      </span>
                      {activity.cost != null && activity.cost > 0 && (
                        <>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-xs font-medium text-foreground">
                            ${activity.cost.toFixed(0)}
                          </span>
                        </>
                      )}
                      <span className="text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeDate(activity.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentActivityFeed;
