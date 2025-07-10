"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navigation from "@/components/Navigation"
import { DashboardOverview } from "@/features/dashboard"
import { HomeTimeline } from "@/features/timeline"
import { TasksLists } from "@/features/tasks"
import { ExpenseTracker } from "@/features/expenses"
import { SheltrHelper } from "@/features/helper"
import { DocumentVault } from "@/features/documents"
import { WarrantyVault } from "@/features/warranty"
import { EnergyTracker } from "@/features/energy"
import { SmartAlerts } from "@/features/alerts"
import { MoveInOut } from "@/features/move"
import { Home, Calendar, CheckSquare, DollarSign, Brain, Shield, FileText, Zap, Bell, Package } from "lucide-react"

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard")

  const handleNavigate = (tab: string) => {
    setActiveTab(tab)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 mb-6">
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
            <TabsTrigger value="helper" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Helper</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Documents</span>
            </TabsTrigger>
            <TabsTrigger value="warranty" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Warranty</span>
            </TabsTrigger>
            <TabsTrigger value="energy" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Energy</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="move" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Move</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardOverview onNavigate={handleNavigate} />
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

          <TabsContent value="helper">
            <SheltrHelper />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentVault />
          </TabsContent>

          <TabsContent value="warranty">
            <WarrantyVault />
          </TabsContent>

          <TabsContent value="energy">
            <EnergyTracker />
          </TabsContent>

          <TabsContent value="alerts">
            <SmartAlerts />
          </TabsContent>

          <TabsContent value="move">
            <MoveInOut />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Index
