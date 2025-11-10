import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Home,
  Calendar,
  Brain,
  CheckSquare,
  DollarSign,
  TrendingUp,
  Shield,
  Move,
  Bell
} from "lucide-react";
import { featureFlags } from "@/lib/featureFlags";
import { DashboardOverview } from "@/features/dashboard";
import { HomeTimeline } from "@/features/timeline";
import { TasksLists } from "@/features/tasks";
import { ExpenseTracker } from "@/features/expenses";
import { SheltrHelper } from "@/features/helper";
import { DocumentVault } from "@/features/documents";
import { MoveInOut } from "@/features/move";
import Navigation from "@/components/Navigation";
import { EnergyTracker } from "@/features/energy";
import { SmartAlerts } from "@/features/alerts";

const tabFlags = [
  featureFlags.dashboardOverview,
  featureFlags.homeTimeline,
  featureFlags.tasksLists,
  featureFlags.expenseTracker,
  featureFlags.warrantyVault,
  featureFlags.moveInOut,
  featureFlags.sheltrHelper,
  featureFlags.energyTracker,
  featureFlags.smartAlerts,
];
const enabledTabCount = tabFlags.filter(Boolean).length;

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)',
        backgroundAttachment: 'fixed',
        backgroundSize: '100% 100vh'
      }}
    >
      <Navigation />
      
      <main className="container-luxury py-8">
        <div className="mb-8 micro-fade-in">
          <h1 className="text-display-lg text-foreground mb-2">Welcome to Sheltr</h1>
          <p className="text-body-luxury text-muted-foreground">Your all-in-one home management assistant</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full max-w-6xl mx-auto mb-8 grid-cols-${enabledTabCount} card-luxury`}> 
            {featureFlags.dashboardOverview && (
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
            )}
            {featureFlags.homeTimeline && (
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Timeline</span>
              </TabsTrigger>
            )}
            {featureFlags.tasksLists && (
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Tasks</span>
              </TabsTrigger>
            )}
            {featureFlags.expenseTracker && (
              <TabsTrigger value="expenses" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span className="hidden sm:inline">Expenses</span>
              </TabsTrigger>
            )}
            {featureFlags.warrantyVault && (
              <TabsTrigger value="vault" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Vault</span>
              </TabsTrigger>
            )}
            {featureFlags.moveInOut && (
              <TabsTrigger value="move" className="flex items-center gap-2">
                <Move className="w-4 h-4" />
                <span className="hidden sm:inline">Move</span>
              </TabsTrigger>
            )}
            {featureFlags.sheltrHelper && (
              <TabsTrigger value="helper" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                <span className="hidden sm:inline">Helper</span>
              </TabsTrigger>
            )}
            {featureFlags.energyTracker && (
              <TabsTrigger value="energy" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Energy</span>
              </TabsTrigger>
            )}
            {featureFlags.smartAlerts && (
              <TabsTrigger value="alerts" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Alerts</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="dashboard">
            {featureFlags.dashboardOverview && <DashboardOverview onNavigate={setActiveTab} />}
          </TabsContent>

          <TabsContent value="timeline">
            {featureFlags.homeTimeline && <HomeTimeline />}
          </TabsContent>

          <TabsContent value="tasks">
            {featureFlags.tasksLists && <TasksLists />}
          </TabsContent>

          <TabsContent value="expenses">
            {featureFlags.expenseTracker && <ExpenseTracker />}
          </TabsContent>

          <TabsContent value="vault">
            {featureFlags.warrantyVault && <DocumentVault />}
          </TabsContent>

          <TabsContent value="move">
            {featureFlags.moveInOut && <MoveInOut />}
          </TabsContent>

          <TabsContent value="helper">
            {featureFlags.sheltrHelper && <SheltrHelper />}
          </TabsContent>

          <TabsContent value="energy">
            {featureFlags.energyTracker && <EnergyTracker />}
          </TabsContent>

          <TabsContent value="alerts">
            {featureFlags.smartAlerts && <SmartAlerts />}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
