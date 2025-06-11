import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, 
  Calendar, 
  MapPin, 
  Brain, 
  CheckSquare, 
  Package, 
  DollarSign,
  Plus,
  Filter,
  TrendingUp,
  Settings,
  Shield,
  Move
} from "lucide-react";
import DashboardOverview from "@/components/DashboardOverview";
import HomeTimeline from "@/components/HomeTimeline";
import TasksLists from "@/components/TasksLists";
import ExpenseTracker from "@/components/ExpenseTracker";
import SheltrHelper from "@/components/SheltrHelper";
import WarrantyVault from "@/components/WarrantyVault";
import MoveInOut from "@/components/MoveInOut";
import Navigation from "@/components/Navigation";
import EnergyTracker from "@/components/EnergyTracker";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to Sheltr
          </h1>
          <p className="text-xl text-gray-600">
            Your all-in-one home management assistant
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-8 w-full max-w-5xl mx-auto mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Expenses</span>
            </TabsTrigger>
            <TabsTrigger value="vault" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Vault</span>
            </TabsTrigger>
            <TabsTrigger value="move" className="flex items-center gap-2">
              <Move className="w-4 h-4" />
              <span className="hidden sm:inline">Move</span>
            </TabsTrigger>
            <TabsTrigger value="helper" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Helper</span>
            </TabsTrigger>
            <TabsTrigger value="energy" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Energy</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardOverview onNavigate={setActiveTab} />
          </TabsContent>

          <TabsContent value="timeline">
            <HomeTimeline />
          </TabsContent>

          <TabsContent value="tasks">
            <TasksLists />
          </TabsContent>

          <TabsContent value="expenses">
            <ExpenseTracker />
          </TabsContent>

          <TabsContent value="vault">
            <WarrantyVault />
          </TabsContent>

          <TabsContent value="move">
            <MoveInOut />
          </TabsContent>

          <TabsContent value="helper">
            <SheltrHelper />
          </TabsContent>

          <TabsContent value="energy">
            <EnergyTracker />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
