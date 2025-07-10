
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Thermometer,
  Droplets,
  Wifi,
  Battery,
  Bell,
  Settings,
  TrendingUp,
  TrendingDown,
  Calendar,
  Wrench,
  Home,
  Zap,
  Shield
} from "lucide-react";

const SmartAlerts = () => {
  const [selectedAlert, setSelectedAlert] = useState("all");

  const sensorData = [
    {
      id: 1,
      name: "Living Room Thermostat",
      type: "temperature",
      location: "Living Room",
      status: "normal",
      value: 72,
      unit: "°F",
      battery: 85,
      lastUpdate: "2 minutes ago",
      trend: "stable"
    },
    {
      id: 2,
      name: "Basement Humidity Sensor",
      type: "humidity",
      location: "Basement",
      status: "warning",
      value: 68,
      unit: "%",
      battery: 45,
      lastUpdate: "5 minutes ago",
      trend: "up"
    },
    {
      id: 3,
      name: "Water Heater Monitor",
      type: "temperature",
      location: "Utility Room",
      status: "critical",
      value: 145,
      unit: "°F",
      battery: 92,
      lastUpdate: "1 minute ago",
      trend: "up"
    },
    {
      id: 4,
      name: "HVAC Filter Monitor",
      type: "airflow",
      location: "Basement",
      status: "warning",
      value: 75,
      unit: "%",
      battery: 67,
      lastUpdate: "3 minutes ago",
      trend: "down"
    }
  ];

  const alerts = [
    {
      id: 1,
      title: "Water Heater Temperature Critical",
      description: "Temperature exceeding safe operating range (145°F)",
      severity: "critical",
      type: "safety",
      sensor: "Water Heater Monitor",
      timestamp: "2024-06-11 14:30",
      autoTask: true,
      taskCreated: "Schedule water heater inspection"
    },
    {
      id: 2,
      title: "HVAC Filter Needs Replacement",
      description: "Airflow reduced to 75% - filter replacement recommended",
      severity: "warning",
      type: "maintenance",
      sensor: "HVAC Filter Monitor",
      timestamp: "2024-06-11 12:15",
      autoTask: true,
      taskCreated: "Replace HVAC filter"
    },
    {
      id: 3,
      title: "Humidity Sensor Low Battery",
      description: "Battery level at 45% - replacement needed soon",
      severity: "medium",
      type: "device",
      sensor: "Basement Humidity Sensor",
      timestamp: "2024-06-11 08:00",
      autoTask: false,
      taskCreated: null
    }
  ];

  const predictiveInsights = [
    {
      id: 1,
      title: "HVAC Maintenance Due",
      description: "Based on usage patterns, schedule maintenance in next 2 weeks",
      confidence: 87,
      daysUntil: 14,
      category: "maintenance",
      recommendation: "Schedule professional HVAC inspection"
    },
    {
      id: 2,
      title: "Water Heater Efficiency Declining",
      description: "Temperature recovery time increasing, potential sediment buildup",
      confidence: 72,
      daysUntil: 30,
      category: "efficiency",
      recommendation: "Flush water heater tank"
    },
    {
      id: 3,
      title: "Basement Humidity Risk",
      description: "Humidity trends suggest potential moisture issues",
      confidence: 63,
      daysUntil: 7,
      category: "prevention",
      recommendation: "Install dehumidifier or improve ventilation"
    }
  ];

  const getSensorIcon = (type: string) => {
    const icons = {
      temperature: Thermometer,
      humidity: Droplets,
      airflow: Zap,
      pressure: Settings
    };
    return icons[type as keyof typeof icons] || Settings;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      normal: "text-green-600 bg-green-100",
      warning: "text-yellow-600 bg-yellow-100",
      critical: "text-red-600 bg-red-100",
      offline: "text-gray-600 bg-gray-100"
    };
    return colors[status as keyof typeof colors] || "text-gray-600 bg-gray-100";
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: "bg-red-100 text-red-800 border-red-200",
      warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
      medium: "bg-blue-100 text-blue-800 border-blue-200",
      low: "bg-green-100 text-green-800 border-green-200"
    };
    return colors[severity as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return TrendingUp;
    if (trend === "down") return TrendingDown;
    return Clock;
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 70) return "text-green-600";
    if (battery > 30) return "text-yellow-600";
    return "text-red-600";
  };

  const criticalAlerts = alerts.filter(a => a.severity === "critical").length;
  const warningAlerts = alerts.filter(a => a.severity === "warning").length;
  const onlineSensors = sensorData.filter(s => s.status !== "offline").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Smart Alerts & Predictive Maintenance</h2>
          <p className="text-gray-600">Monitor your home with intelligent sensors and predictive insights</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Device
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
                <p className="text-3xl font-bold text-red-600">{criticalAlerts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Immediate attention required</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Warnings</p>
                <p className="text-3xl font-bold text-yellow-600">{warningAlerts}</p>
              </div>
              <Bell className="w-8 h-8 text-yellow-600" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Action recommended</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sensors Online</p>
                <p className="text-3xl font-bold text-green-600">{onlineSensors}/{sensorData.length}</p>
              </div>
              <Wifi className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-sm text-gray-500 mt-2">All systems operational</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasks Created</p>
                <p className="text-3xl font-bold text-blue-600">
                  {alerts.filter(a => a.autoTask).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Auto-generated today</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Live Dashboard</TabsTrigger>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Insights</TabsTrigger>
          <TabsTrigger value="devices">Device Management</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Sensor Status Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Real-Time Sensor Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sensorData.map((sensor) => {
                  const IconComponent = getSensorIcon(sensor.type);
                  const TrendIcon = getTrendIcon(sensor.trend);
                  return (
                    <div key={sensor.id} className="p-4 rounded-lg border bg-white">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(sensor.status)}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{sensor.name}</h4>
                            <p className="text-sm text-gray-500">{sensor.location}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(sensor.status)}>
                          {sensor.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {sensor.value}{sensor.unit}
                          </span>
                          <TrendIcon className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="flex items-center gap-1">
                          <Battery className={`w-4 h-4 ${getBatteryColor(sensor.battery)}`} />
                          <span className={`text-sm ${getBatteryColor(sensor.battery)}`}>
                            {sensor.battery}%
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        Last update: {sensor.lastUpdate}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Active Alerts ({alerts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border-2 ${getSeverityColor(alert.severity)}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {alert.type}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{alert.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Settings className="w-4 h-4" />
                            {alert.sensor}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {alert.timestamp}
                          </span>
                        </div>
                      </div>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </div>
                    
                    {alert.autoTask && (
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-blue-700">
                            Auto-created task: {alert.taskCreated}
                          </span>
                        </div>
                        <Button size="sm" variant="outline">
                          View Task
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Predictive Maintenance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictiveInsights.map((insight) => (
                  <div key={insight.id} className="p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-green-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{insight.title}</h4>
                        <p className="text-gray-600 mb-3">{insight.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {insight.daysUntil} days
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {insight.confidence}% confidence
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-white">
                        {insight.category}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">
                          Recommendation: {insight.recommendation}
                        </span>
                      </div>
                      <Button size="sm">
                        Create Task
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Device Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sensorData.map((device) => {
                  const IconComponent = getSensorIcon(device.type);
                  return (
                    <div key={device.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(device.status)}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{device.name}</h4>
                          <p className="text-sm text-gray-500">{device.location} • {device.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {device.value}{device.unit}
                          </p>
                          <div className="flex items-center gap-1">
                            <Battery className={`w-3 h-3 ${getBatteryColor(device.battery)}`} />
                            <span className={`text-xs ${getBatteryColor(device.battery)}`}>
                              {device.battery}%
                            </span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Configure
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartAlerts;
