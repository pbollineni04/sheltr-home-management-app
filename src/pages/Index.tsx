import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { featureFlags } from "@/lib/featureFlags";
import { DashboardOverview } from "@/features/dashboard";
import { HomeTimeline } from "@/features/timeline";
import { TasksLists } from "@/features/tasks";
import { ExpenseTracker } from "@/features/expenses";
import { SheltrHelper } from "@/features/helper";
import { DocumentVault } from "@/features/documents";
import { MoveInOut } from "@/features/move";
import { HomeWealth } from "@/features/homewealth";
import SidebarNavigation from "@/components/Navigation";
import { EnergyTracker } from "@/features/energy";
import { SmartAlerts } from "@/features/alerts";
import { ServicesMain } from "@/features/services";
import { pageHeader } from "@/lib/motion";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return featureFlags.dashboardOverview ? <DashboardOverview onNavigate={setActiveTab} /> : null;
      case "homewealth":
        return featureFlags.homeWealth ? <HomeWealth /> : null;
      case "timeline":
        return featureFlags.homeTimeline ? <HomeTimeline /> : null;
      case "tasks":
        return featureFlags.tasksLists ? <TasksLists /> : null;
      case "expenses":
        return featureFlags.expenseTracker ? <ExpenseTracker /> : null;
      case "vault":
        return featureFlags.documentVault ? <DocumentVault /> : null;
      case "services":
        return featureFlags.services ? <ServicesMain /> : null;
      case "move":
        return featureFlags.moveInOut ? <MoveInOut /> : null;
      case "helper":
        return featureFlags.sheltrHelper ? <SheltrHelper /> : null;
      case "energy":
        return featureFlags.energyTracker ? <EnergyTracker /> : null;
      case "alerts":
        return featureFlags.smartAlerts ? <SmartAlerts /> : null;
      default:
        return featureFlags.dashboardOverview ? <DashboardOverview onNavigate={setActiveTab} /> : null;
    }
  };

  // Map tab IDs to readable page titles
  const pageTitles: Record<string, string> = {
    dashboard: "Dashboard",
    homewealth: "HomeWealth",
    timeline: "Home Timeline",
    tasks: "Tasks",
    expenses: "Expenses",
    vault: "Document Vault",
    services: "Services",
    move: "Move In/Out",
    helper: "Sheltr Helper",
    energy: "Utilities",
    alerts: "Smart Alerts",
  };

  const pageSubtitles: Record<string, string> = {
    dashboard: "Welcome back! Here's your home overview.",
    homewealth: "Track your home's investment performance and build wealth",
    timeline: "A history of everything that happens in your home",
    tasks: "Manage your household to-dos",
    expenses: "Track your household spending",
    vault: "Your documents stored securely",
    services: "Manage your home service providers and appointments",
    energy: "Monitor utility bills and usage across your household",
    alerts: "Stay on top of your home alerts",
    move: "Manage your move-in/out process",
    helper: "Your AI-powered home assistant",
  };

  return (
    <div className="sidebar-layout" style={{ background: 'hsl(var(--background))' }}>
      <SidebarNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <main className="sidebar-content mt-[65px] lg:mt-0 min-h-screen">
        {/* Page header – slides down like the reference repo's Index header */}
        <motion.div
          key={`header-${activeTab}`}
          initial={pageHeader.initial}
          animate={pageHeader.animate}
          className="mb-6"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {pageTitles[activeTab] || "Dashboard"}
          </h1>
          {pageSubtitles[activeTab] && (
            <p className="text-sm text-muted-foreground mt-1">
              {pageSubtitles[activeTab]}
            </p>
          )}
        </motion.div>

        {/* Page content – fade in on tab switch */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
