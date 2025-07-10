"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Zap,
  Droplets,
  Flame,
  Sun,
  Lightbulb,
  Leaf,
  DollarSign,
  BarChart3,
} from "lucide-react"

const EnergyTracker = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const utilityData = [
    {
      id: 1,
      type: "electricity",
      usage: 850,
      unit: "kWh",
      cost: 127.5,
      date: "2024-05",
      trend: "up",
      trendPercent: 8,
    },
    {
      id: 2,
      type: "water",
      usage: 4200,
      unit: "gallons",
      cost: 68.4,
      date: "2024-05",
      trend: "down",
      trendPercent: 12,
    },
    {
      id: 3,
      type: "gas",
      usage: 32,
      unit: "therms",
      cost: 45.8,
      date: "2024-05",
      trend: "down",
      trendPercent: 25,
    },
    {
      id: 4,
      type: "solar",
      usage: 620,
      unit: "kWh generated",
      cost: -93.0,
      date: "2024-05",
      trend: "up",
      trendPercent: 15,
    },
  ]

  const efficiencyTips = [
    {
      id: 1,
      title: "Peak Hour Savings",
      description: "Run dishwasher and laundry between 9 PM - 6 AM to save 30% on electricity rates",
      icon: Zap,
      savings: "$25/month",
      priority: "high",
    },
    {
      id: 2,
      title: "Water Heating Optimization",
      description: "Lower water heater temperature to 120°F to reduce gas consumption by 10%",
      icon: Flame,
      savings: "$18/month",
      priority: "medium",
    },
    {
      id: 3,
      title: "Smart Thermostat Schedule",
      description: "Adjust heating schedule to save energy during work hours",
      icon: Lightbulb,
      savings: "$45/month",
      priority: "high",
    },
  ]

  const sustainabilityMetrics = {
    carbonFootprint: 1.2, // tons CO2
    carbonReduction: 15, // percent vs last year
    renewablePercent: 42,
    efficiencyScore: 87,
  }

  const getUtilityIcon = (type: string) => {
    const icons = {
      electricity: Zap,
      water: Droplets,
      gas: Flame,
      solar: Sun,
    }
    return icons[type as keyof typeof icons] || Zap
  }

  const getUtilityColor = (type: string) => {
    const colors = {
      electricity: "text-yellow-600 bg-yellow-100",
      water: "text-blue-600 bg-blue-100",
      gas: "text-orange-600 bg-orange-100",
      solar: "text-green-600 bg-green-100",
    }
    return colors[type as keyof typeof colors] || "text-gray-600 bg-gray-100"
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-orange-100 text-orange-800",
      low: "bg-green-100 text-green-800",
    }
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const totalMonthlyCost = utilityData.reduce((sum, utility) => sum + utility.cost, 0)
  const totalUsage = utilityData.filter((u) => u.type !== "solar").reduce((sum, utility) => sum + utility.cost, 0)
  const solarSavings = Math.abs(utilityData.find((u) => u.type === "solar")?.cost || 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Energy & Utility Tracking</h2>
          <p className="text-gray-600">Monitor usage, costs, and sustainability metrics</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Reading
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cost</p>
                <p className="text-3xl font-bold text-gray-900">${totalMonthlyCost.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-sm text-green-600 mt-2">-5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Solar Savings</p>
                <p className="text-3xl font-bold text-green-600">${solarSavings.toFixed(2)}</p>
              </div>
              <Sun className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-sm text-green-600 mt-2">+15% generation</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Efficiency Score</p>
                <p className="text-3xl font-bold text-blue-600">{sustainabilityMetrics.efficiencyScore}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-sm text-blue-600 mt-2">+3 points</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Carbon Footprint</p>
                <p className="text-3xl font-bold text-gray-900">{sustainabilityMetrics.carbonFootprint}</p>
                <p className="text-xs text-gray-500">tons CO₂</p>
              </div>
              <Leaf className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-sm text-green-600 mt-2">-{sustainabilityMetrics.carbonReduction}% vs last year</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="usage" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="usage">Usage Dashboard</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
          <TabsTrigger value="tips">AI Tips</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-6">
          {/* Current Month Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Current Month Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {utilityData.map((utility) => {
                  const IconComponent = getUtilityIcon(utility.type)
                  const TrendIcon = utility.trend === "up" ? TrendingUp : TrendingDown
                  return (
                    <div key={utility.id} className="flex items-center gap-4 p-4 rounded-lg border">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${getUtilityColor(utility.type)}`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 capitalize">{utility.type}</h4>
                        <p className="text-sm text-gray-500">
                          {utility.usage.toLocaleString()} {utility.unit}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-lg font-bold text-gray-900">${Math.abs(utility.cost).toFixed(2)}</span>
                          <div
                            className={`flex items-center gap-1 text-xs ${
                              utility.trend === "up" ? "text-red-600" : "text-green-600"
                            }`}
                          >
                            <TrendIcon className="w-3 h-3" />
                            {utility.trendPercent}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sustainability" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  Environmental Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Carbon Footprint</span>
                  <span className="font-medium">{sustainabilityMetrics.carbonFootprint} tons CO₂</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Renewable Energy</span>
                  <span className="font-medium">{sustainabilityMetrics.renewablePercent}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Efficiency Score</span>
                  <span className="font-medium">{sustainabilityMetrics.efficiencyScore}/100</span>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-green-600 font-medium">
                    🌱 You've reduced your carbon footprint by {sustainabilityMetrics.carbonReduction}% this year!
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">This Month</span>
                    <span className="font-medium">${totalMonthlyCost.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Month</span>
                    <span className="font-medium">$248.60</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Average (12mo)</span>
                    <span className="font-medium">$267.80</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">5% below average</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                AI-Powered Efficiency Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {efficiencyTips.map((tip) => {
                  const IconComponent = tip.icon
                  return (
                    <div key={tip.id} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900">{tip.title}</h4>
                          <Badge className={getPriorityColor(tip.priority)}>{tip.priority} priority</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{tip.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-600">Potential savings: {tip.savings}</span>
                          <Button size="sm" variant="outline">
                            Apply Tip
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Usage History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {utilityData.map((utility, index) => (
                  <div
                    key={`${utility.id}-history`}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${getUtilityColor(utility.type)}`}
                      >
                        {React.createElement(getUtilityIcon(utility.type), { className: "w-4 h-4" })}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{utility.type}</p>
                        <p className="text-sm text-gray-500">{utility.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {utility.usage.toLocaleString()} {utility.unit}
                      </p>
                      <p className="text-sm text-gray-500">${Math.abs(utility.cost).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default EnergyTracker
