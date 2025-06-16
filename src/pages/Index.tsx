import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import DashboardOverview from "@/components/DashboardOverview";
import TasksLists from "@/components/TasksLists";
import ExpenseTracker from "@/components/ExpenseTracker";
import HomeTimeline from "@/components/HomeTimeline";
import EnergyTracker from "@/components/EnergyTracker";
import WarrantyVault from "@/components/WarrantyVault";
import SmartAlerts from "@/components/SmartAlerts";
import MoveInOut from "@/components/MoveInOut";
import SheltrHelper from "@/components/SheltrHelper";
import SampleDataButton from "@/components/SampleDataButton";

const Index = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
      {/* Navigation */}
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onSignOut={handleSignOut} 
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Header with Sample Data Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome to Sheltr
            </h1>
            <p className="text-xl text-gray-600">
              Your comprehensive home management platform
            </p>
          </div>
          <SampleDataButton />
        </div>

        {/* Feature Content */}
        {activeTab === "overview" && <DashboardOverview />}
        {activeTab === "tasks" && <TasksLists />}
        {activeTab === "expenses" && <ExpenseTracker />}
        {activeTab === "timeline" && <HomeTimeline />}
        {activeTab === "energy" && <EnergyTracker />}
        {activeTab === "warranty" && <WarrantyVault />}
        {activeTab === "alerts" && <SmartAlerts />}
        {activeTab === "move" && <MoveInOut />}
        {activeTab === "helper" && <SheltrHelper />}
      </main>
    </div>
  );
};

export default Index;
