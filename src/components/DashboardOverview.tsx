
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

interface DashboardOverviewProps {
  onNavigate: (tab: string) => void;
}

const DashboardOverview = ({ onNavigate }: DashboardOverviewProps) => {
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
      stats: "5 pending tasks",
      action: "Manage Tasks"
    },
    {
      id: "expenses",
      title: "Expense Tracker",
      description: "Monitor home-related spending",
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
      stats: "$2,340 this month",
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
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                <p className="text-3xl font-bold text-gray-900">5</p>
              </div>
              <CheckSquare className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-gray-900">$2,340</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Events</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-3xl font-bold text-red-600">2</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {moduleCards.map((module) => {
          const IconComponent = module.icon;
          return (
            <Card key={module.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${module.color} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">{module.stats}</p>
                  <Button 
                    onClick={() => onNavigate(module.id)}
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.desc}</p>
                  <p className="text-sm text-gray-500">{activity.date}</p>
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
