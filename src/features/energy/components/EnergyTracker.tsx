import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Zap,
  Droplets,
  Flame,
  Calendar,
  Lightbulb,
  Leaf,
  DollarSign,
  BarChart3,
  AlertTriangle,
  Wifi,
  Plug,
  Settings,
} from "lucide-react";
import { useUtilityReadings } from "../hooks/useUtilityReadings";
import AddReadingDialog from "./AddReadingDialog";
import UsageChart from "./UsageChart";
import CostBreakdownChart from "./CostBreakdownChart";
import TrendComparisonChart from "./TrendComparisonChart";
import UtilityConnectionDialog from "./UtilityConnectionDialog";
import UtilityConnectionSettings from "./UtilityConnectionSettings";
import BillReviewDialog from "./BillReviewDialog";
import ExportButton from "./ExportButton";
import type { UtilityType, ReadingFormData } from "../types";
import { staggerContainer, fadeUpItem, cardItemAnim, listItemAnim } from "@/lib/motion";

const EnergyTracker = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [connectionDialogOpen, setConnectionDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const {
    readings,
    loading,
    selectedPeriod,
    setSelectedPeriod,
    addReading,
    refetch,
    metrics,
    sustainabilityMetrics,
    costSummary,
    pendingReviewCount,
    dynamicTips,
  } = useUtilityReadings();

  const handleAddReading = async (formData: ReadingFormData) => {
    const success = await addReading({
      utility_type: formData.utility_type,
      usage_amount: parseFloat(formData.usage_amount),
      unit: formData.unit,
      cost: formData.cost ? parseFloat(formData.cost) : null,
      reading_date: formData.reading_date,
    });
    return success;
  };

  const utilityData = React.useMemo(() => {
    const grouped: Record<UtilityType, typeof readings> = {
      electricity: [],
      gas: [],
      water: [],
      internet: [],
    };

    readings.forEach(reading => {
      grouped[reading.utility_type].push(reading);
    });

    return Object.entries(grouped).map(([type, typeReadings]) => {
      if (typeReadings.length === 0) return null;

      const latest = typeReadings[0];
      const trendData = metrics.trends.find(t => t.utilityType === type as UtilityType);

      // Aggregate total usage and cost across the full period
      const totalUsage = typeReadings.reduce((sum, r) => sum + r.usage_amount, 0);
      const totalCost = typeReadings.reduce((sum, r) => sum + (r.cost || 0), 0);

      return {
        id: latest.id,
        type: type as UtilityType,
        usage: totalUsage,
        unit: latest.unit,
        cost: totalCost,
        date: latest.reading_date,
        readingCount: typeReadings.length,
        trend: trendData?.trendDirection === 'up' ? 'up' : trendData?.trendDirection === 'down' ? 'down' : 'stable',
        trendPercent: Math.abs(Math.round(trendData?.costTrendPercent || 0)),
      };
    }).filter(Boolean);
  }, [readings, metrics.trends]);

  const getUtilityIcon = (type: string) => {
    const icons = { electricity: Zap, water: Droplets, gas: Flame, internet: Wifi };
    return icons[type as keyof typeof icons] || Zap;
  };

  const getUtilityColor = (type: string) => {
    const colors = {
      electricity: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30",
      water: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
      gas: "text-orange-600 bg-orange-100 dark:bg-orange-900/30",
      internet: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
    };
    return colors[type as keyof typeof colors] || "text-muted-foreground bg-muted";
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
      medium: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400",
      low: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
    };
    return colors[priority as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  const totalMonthlyCost = metrics.totalCost;
  const previousPeriodCost = costSummary?.previousPeriodCost || 0;
  const percentageChange = costSummary?.percentageChange || 0;

  // Use dynamic tips if available, otherwise fall back to static tips
  const displayTips = dynamicTips.length > 0 ? dynamicTips : [
    {
      id: 'static-1',
      title: "Peak Hour Savings",
      description: "Run dishwasher and laundry between 9 PM - 6 AM to save 30% on electricity rates",
      category: 'electricity' as UtilityType,
      estimatedSavings: "$25/month",
      priority: "high" as const,
      basedOn: "General recommendation",
    },
    {
      id: 'static-2',
      title: "Water Heating Optimization",
      description: "Lower water heater temperature to 120°F to reduce gas consumption by 10%",
      category: 'gas' as UtilityType,
      estimatedSavings: "$18/month",
      priority: "medium" as const,
      basedOn: "General recommendation",
    },
    {
      id: 'static-3',
      title: "Smart Thermostat Schedule",
      description: "Adjust heating schedule to save energy during work hours",
      category: 'electricity' as UtilityType,
      estimatedSavings: "$45/month",
      priority: "high" as const,
      basedOn: "General recommendation",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Energy & Utility Tracking</h2>
          <p className="text-muted-foreground">Monitor usage, costs, and sustainability metrics</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
          <div className="flex gap-1 bg-muted p-1 rounded-lg">
            <Button
              size="sm"
              variant={selectedPeriod === 'month' ? 'default' : 'ghost'}
              onClick={() => setSelectedPeriod('month')}
            >
              Month
            </Button>
            <Button
              size="sm"
              variant={selectedPeriod === 'quarter' ? 'default' : 'ghost'}
              onClick={() => setSelectedPeriod('quarter')}
            >
              Quarter
            </Button>
            <Button
              size="sm"
              variant={selectedPeriod === 'year' ? 'default' : 'ghost'}
              onClick={() => setSelectedPeriod('year')}
            >
              Year
            </Button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => setAddDialogOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Reading
            </Button>
            <Button
              variant="outline"
              onClick={() => setConnectionDialogOpen(true)}
            >
              <Plug className="w-4 h-4 mr-2" />
              Connect Utility
            </Button>
            {pendingReviewCount > 0 && (
              <Button
                variant="outline"
                onClick={() => setReviewDialogOpen(true)}
                className="relative"
              >
                <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />
                Review Bills
                <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {pendingReviewCount}
                </Badge>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Connection Settings (toggleable) */}
      {showSettings && (
        <UtilityConnectionSettings onConnectionChange={refetch} />
      )}

      {/* Summary Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
      >
        {loading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <motion.div variants={fadeUpItem}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Cost</p>
                      <p className="text-3xl font-bold text-foreground">${totalMonthlyCost.toFixed(2)}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className={`text-sm mt-2 ${percentageChange < 0 ? 'text-green-600' : percentageChange > 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                    {percentageChange < 0 ? '' : percentageChange > 0 ? '+' : ''}{percentageChange.toFixed(1)}% from last period
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeUpItem}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Carbon Footprint</p>
                      <p className="text-3xl font-bold text-foreground">
                        {sustainabilityMetrics?.carbonFootprint.toFixed(2) || '0.00'}
                      </p>
                      <p className="text-xs text-muted-foreground">tons CO2</p>
                    </div>
                    <Leaf className="w-8 h-8 text-green-600" />
                  </div>
                  <p className={`text-sm mt-2 ${(sustainabilityMetrics?.carbonReduction || 0) > 0 ? 'text-green-600' : (sustainabilityMetrics?.carbonReduction || 0) < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                    {(sustainabilityMetrics?.carbonReduction || 0) > 0 ? '-' : (sustainabilityMetrics?.carbonReduction || 0) < 0 ? '+' : ''}
                    {Math.abs(sustainabilityMetrics?.carbonReduction || 0).toFixed(1)}% vs last period
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeUpItem}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Efficiency Score</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {sustainabilityMetrics?.efficiencyScore || 50}
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className={`text-sm mt-2 ${sustainabilityMetrics?.efficiencyScore ? 'text-blue-600' : 'text-muted-foreground'}`}>
                    {sustainabilityMetrics?.efficiencyScore
                      ? sustainabilityMetrics.efficiencyScore > 50
                        ? 'Above average'
                        : sustainabilityMetrics.efficiencyScore < 50
                          ? 'Below average'
                          : 'Average'
                      : 'No historical data'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeUpItem}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Readings</p>
                      <p className="text-3xl font-bold text-foreground">{readings.length}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">This {selectedPeriod}</p>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </motion.div>

      <Tabs defaultValue="usage" className="w-full">
        <TabsList className="flex w-full overflow-x-auto">
          <TabsTrigger value="usage">Usage Dashboard</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
          <TabsTrigger value="tips">
            AI Tips
            {dynamicTips.length > 0 && (
              <Badge variant="secondary" className="ml-1.5 text-xs px-1.5 py-0">
                {dynamicTips.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current {selectedPeriod === 'quarter' ? 'Quarter' : selectedPeriod === 'year' ? 'Year' : 'Month'} Usage</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg border">
                      <Skeleton className="w-12 h-12 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-5 w-12" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : utilityData.length === 0 ? (
                <div className="text-center py-8">
                  <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No utility readings yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Add readings manually or connect your utility provider for automatic import.
                  </p>
                  <div className="flex justify-center gap-2">
                    <Button onClick={() => setAddDialogOpen(true)} variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Manually
                    </Button>
                    <Button onClick={() => setConnectionDialogOpen(true)}>
                      <Plug className="w-4 h-4 mr-2" />
                      Connect Provider
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {utilityData.map((utility) => {
                    if (!utility) return null;
                    const IconComponent = getUtilityIcon(utility.type);
                    const TrendIcon = utility.trend === "up" ? TrendingUp : utility.trend === "down" ? TrendingDown : null;
                    return (
                      <motion.div key={utility.id} {...cardItemAnim(utilityData.indexOf(utility))} className="flex items-center gap-4 p-4 rounded-lg border hover:shadow-md hover:border-primary/30 transition-all">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getUtilityColor(utility.type)}`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground capitalize">{utility.type}</h4>
                            {utility.readingCount > 1 && (
                              <span className="text-xs text-muted-foreground">({utility.readingCount} bills)</span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{utility.usage.toLocaleString()} {utility.unit}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-lg font-bold text-foreground">
                              ${Math.abs(utility.cost).toFixed(2)}
                            </span>
                            {TrendIcon && (
                              <div className={`flex items-center gap-1 text-xs ${utility.trend === "up" ? "text-red-600" : "text-green-600"}`}>
                                <TrendIcon className="w-3 h-3" />
                                {utility.trendPercent}%
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UsageChart readings={readings} period={selectedPeriod} />
            <CostBreakdownChart costSummary={costSummary} />
          </div>
          <TrendComparisonChart trends={metrics.trends} />
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
                  <span className="text-sm text-muted-foreground">Carbon Footprint</span>
                  <span className="font-medium">
                    {sustainabilityMetrics?.carbonFootprint.toFixed(2) || '0.00'} tons CO2
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Renewable Energy</span>
                  <span className="font-medium">{sustainabilityMetrics?.renewablePercent || 0}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Efficiency Score</span>
                  <span className="font-medium">{sustainabilityMetrics?.efficiencyScore || 50}/100</span>
                </div>
                {sustainabilityMetrics && sustainabilityMetrics.carbonReduction > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-green-600 font-medium">
                      You've reduced your carbon footprint by {sustainabilityMetrics.carbonReduction.toFixed(1)}%!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{selectedPeriod === 'quarter' ? 'Quarterly' : selectedPeriod === 'year' ? 'Yearly' : 'Monthly'} Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">This {selectedPeriod}</span>
                    <span className="font-medium">${totalMonthlyCost.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Previous {selectedPeriod}</span>
                    <span className="font-medium">${previousPeriodCost.toFixed(2)}</span>
                  </div>
                  {percentageChange !== 0 && (
                    <div className="pt-3 border-t">
                      <div className="flex items-center gap-2">
                        {percentageChange < 0 ? (
                          <>
                            <TrendingDown className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-600 font-medium">
                              {Math.abs(percentageChange).toFixed(1)}% decrease
                            </span>
                          </>
                        ) : (
                          <>
                            <TrendingUp className="w-4 h-4 text-red-600" />
                            <span className="text-sm text-red-600 font-medium">
                              {percentageChange.toFixed(1)}% increase
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
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
                {dynamicTips.length > 0 ? 'Data-Driven Efficiency Tips' : 'Efficiency Tips'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayTips.map((tip) => {
                  const IconComponent = getUtilityIcon(tip.category);
                  return (
                    <div key={tip.id} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getUtilityColor(tip.category)}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-foreground">{tip.title}</h4>
                          <Badge className={getPriorityColor(tip.priority)}>
                            {tip.priority} priority
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{tip.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-600">
                            Potential savings: {tip.estimatedSavings}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Based on: {tip.basedOn}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Usage History</CardTitle>
              <ExportButton readings={readings} period={selectedPeriod} />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <div className="space-y-1 text-right">
                        <Skeleton className="h-4 w-16 ml-auto" />
                        <Skeleton className="h-3 w-12 ml-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : readings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No readings to display</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {readings.map((reading) => {
                    const IconComponent = getUtilityIcon(reading.utility_type);
                    const isAutoImported = (reading as any).auto_imported;
                    return (
                      <motion.div key={reading.id} {...listItemAnim(readings.indexOf(reading))} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getUtilityColor(reading.utility_type)}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-foreground capitalize">{reading.utility_type}</p>
                              {isAutoImported && (
                                <Badge variant="outline" className="text-xs px-1.5 py-0">
                                  Auto
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{reading.reading_date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-foreground">{reading.usage_amount.toLocaleString()} {reading.unit}</p>
                          {reading.cost && (
                            <p className="text-sm text-muted-foreground">${reading.cost.toFixed(2)}</p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AddReadingDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddReading}
      />
      <UtilityConnectionDialog
        open={connectionDialogOpen}
        onOpenChange={setConnectionDialogOpen}
        onConnected={refetch}
      />
      <BillReviewDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        onReviewComplete={refetch}
      />
    </div>
  );
};

export default EnergyTracker;
