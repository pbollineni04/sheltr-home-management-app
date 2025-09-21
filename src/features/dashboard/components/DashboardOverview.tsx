
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  CheckSquare, 
  DollarSign, 
  MapPin, 
  Package, 
  Brain,
  TrendingUp,
  Clock,
  AlertTriangle
} from "lucide-react";
import { useDashboardMetrics } from "@/features/dashboard/hooks/useDashboardMetrics";

interface DashboardOverviewProps {
  onNavigate: (tab: string) => void;
}

const DashboardOverview = ({ onNavigate }: DashboardOverviewProps) => {
  const { metrics, loading, freshnessSeconds, refreshLive } = useDashboardMetrics();
  const moduleCards = [
    {
      id: "timeline",
      title: "Home Timeline",
      description: "Track major events and changes",
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
      stats: "12 events this year",
      action: "View Timeline"
    },
    {
      id: "tasks",
      title: "Tasks & Lists",
      description: "Organize maintenance and projects",
      icon: CheckSquare,
      color: "from-green-500 to-green-600",
      stats: metrics ? `${metrics.pending_tasks} pending tasks` : loading ? "Loading..." : "0 pending tasks",
      action: "Manage Tasks"
    },
    {
      id: "expenses",
      title: "Expense Tracker",
      description: "Monitor home-related spending",
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
      stats: metrics ? `$${metrics.monthly_expenses.toFixed(2)} this month` : loading ? "Loading..." : "$0.00 this month",
      action: "View Expenses"
    },
    {
      id: "helper",
      title: "Sheltr Helper",
      description: "AI assistant for home questions",
      icon: Brain,
      color: "from-orange-500 to-orange-600",
      stats: "24/7 available",
      action: "Ask Helper"
    }
  ];

  const recentActivity = [
    { type: "maintenance", desc: "HVAC filter replacement", date: "2 days ago" },
    { type: "expense", desc: "$234 spent at Home Depot", date: "3 days ago" },
    { type: "task", desc: "Completed: Clean gutters", date: "1 week ago" },
    { type: "timeline", desc: "Added: New water heater installation", date: "2 weeks ago" }
  ];

  return (
    <div className="space-y-8 px-3 sm:px-4">
      {/* Freshness + Dev Refresh */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-gray-500">
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
            onClick={() => (typeof refreshLive === 'function' ? refreshLive() : null)}
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
                <p className="text-sm font-medium text-gray-600 whitespace-nowrap">Active Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{loading ? "—" : (metrics?.pending_tasks ?? 0)}</p>
              </div>
              <CheckSquare className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-luxury">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 whitespace-nowrap">This Month</p>
                <p className="text-3xl font-bold text-gray-900">{loading ? "—" : `$${(metrics?.monthly_expenses ?? 0).toFixed(2)}`}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-luxury">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 whitespace-nowrap">Recent Events</p>
                <p className="text-3xl font-bold text-gray-900">{loading ? "—" : (metrics?.total_documents ?? 0)}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-luxury">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 whitespace-nowrap">Overdue</p>
                <p className="text-3xl font-bold text-red-600">{loading ? "—" : (metrics?.overdue_tasks ?? 0)}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {moduleCards.map((module) => {
          const IconComponent = module.icon;
          return (
            <Card key={module.id} className="card-luxury hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${module.color} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-heading-xl">{module.title}</CardTitle>
                    <CardDescription className="text-body-luxury text-neutral-600">{module.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-gray-600">{module.stats}</p>
                  <Button 
                    onClick={() => onNavigate(module.id)}
                    className="w-full sm:w-auto btn-primary-luxury"
                  >
                    {module.action}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="card-luxury">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-neutral-200">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start sm:items-center gap-3 py-3 micro-fade-in">
                <span className="mt-1 sm:mt-0 inline-block w-2 h-2 rounded-full bg-sky-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-body-luxury text-neutral-800">{activity.desc}</p>
                  <p className="text-sm text-neutral-500">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
