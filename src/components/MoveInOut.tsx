
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Calendar,
  CheckCircle,
  Circle,
  Camera,
  TrendingUp,
  DollarSign,
  Home,
  FileText,
  MapPin,
  Star
} from "lucide-react";

const MoveInOut = () => {
  const [activeChecklist, setActiveChecklist] = useState<string | null>(null);
  const [homeValue, setHomeValue] = useState(485000);
  const [purchasePrice, setPurchasePrice] = useState(420000);

  const checklists = [
    {
      id: "move-in",
      title: "First-Time Move-In",
      description: "Complete setup checklist for new homeowners",
      progress: 8,
      total: 15,
      dueDate: "2024-06-20",
      category: "move-in"
    },
    {
      id: "deep-clean",
      title: "Deep Clean Move-Out",
      description: "Comprehensive cleaning before departure",
      progress: 0,
      total: 12,
      dueDate: "2024-07-15",
      category: "move-out"
    },
    {
      id: "staging",
      title: "Home Staging",
      description: "Prepare home for sale presentation",
      progress: 3,
      total: 8,
      dueDate: "2024-06-30",
      category: "staging"
    }
  ];

  const renovationProjects = [
    {
      id: 1,
      name: "Kitchen Remodel",
      cost: 35000,
      roiPercentage: 75,
      valueAdd: 26250,
      status: "planned"
    },
    {
      id: 2,
      name: "Bathroom Renovation",
      cost: 18000,
      roiPercentage: 85,
      valueAdd: 15300,
      status: "in-progress"
    },
    {
      id: 3,
      name: "Landscaping Upgrade",
      cost: 8000,
      roiPercentage: 60,
      valueAdd: 4800,
      status: "completed"
    }
  ];

  const moveInTasks = [
    { id: 1, task: "Change all locks and garage codes", completed: true },
    { id: 2, task: "Update address with bank and insurance", completed: true },
    { id: 3, task: "Install security system", completed: true },
    { id: 4, task: "Test all smoke and carbon monoxide detectors", completed: true },
    { id: 5, task: "Schedule HVAC inspection", completed: true },
    { id: 6, task: "Set up utilities (electric, gas, water, internet)", completed: true },
    { id: 7, task: "Register with local services (trash, recycling)", completed: true },
    { id: 8, task: "Update voter registration", completed: true },
    { id: 9, task: "Find local emergency services numbers", completed: false },
    { id: 10, task: "Schedule carpet/floor deep cleaning", completed: false },
    { id: 11, task: "Inspect and clean gutters", completed: false },
    { id: 12, task: "Test garage door openers", completed: false },
    { id: 13, task: "Update home insurance policy", completed: false },
    { id: 14, task: "Create home inventory for insurance", completed: false },
    { id: 15, task: "Schedule landscaping assessment", completed: false }
  ];

  const conditionReports = [
    {
      id: 1,
      room: "Kitchen",
      date: "2024-05-15",
      photos: 8,
      issues: ["Minor scuff on cabinet door", "Faucet drips slightly"],
      rating: 4
    },
    {
      id: 2,
      room: "Living Room",
      date: "2024-05-15",
      photos: 6,
      issues: ["Small nail holes in wall"],
      rating: 5
    },
    {
      id: 3,
      room: "Master Bedroom",
      date: "2024-05-15",
      photos: 4,
      issues: [],
      rating: 5
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      "move-in": "bg-blue-100 text-blue-800",
      "move-out": "bg-orange-100 text-orange-800",
      "staging": "bg-purple-100 text-purple-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    const colors = {
      "planned": "bg-gray-100 text-gray-800",
      "in-progress": "bg-blue-100 text-blue-800",
      "completed": "bg-green-100 text-green-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Move & Property Management</h2>
          <p className="text-gray-600">Lifecycle management and real estate insights</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
          <Plus className="w-4 h-4 mr-2" />
          New Checklist
        </Button>
      </div>

      <Tabs defaultValue="checklists" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="checklists">Checklists</TabsTrigger>
          <TabsTrigger value="condition">Condition Reports</TabsTrigger>
          <TabsTrigger value="valuation">Home Value</TabsTrigger>
          <TabsTrigger value="roi">ROI Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="checklists" className="space-y-4">
          <div className="grid gap-4">
            {checklists.map((checklist) => (
              <Card key={checklist.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{checklist.title}</h3>
                        <Badge className={getCategoryColor(checklist.category)}>
                          {checklist.category}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{checklist.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Due: {new Date(checklist.dueDate).toLocaleDateString()}
                        </span>
                        <span>
                          {checklist.progress} of {checklist.total} completed
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {Math.round((checklist.progress / checklist.total) * 100)}%
                      </div>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full"
                          style={{ width: `${(checklist.progress / checklist.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  {activeChecklist === checklist.id && checklist.id === "move-in" && (
                    <div className="border-t pt-4 space-y-2">
                      {moveInTasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                          {task.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                          <span className={task.completed ? "text-gray-500 line-through" : "text-gray-900"}>
                            {task.task}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setActiveChecklist(activeChecklist === checklist.id ? null : checklist.id)}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      {activeChecklist === checklist.id ? "Hide Tasks" : "View Tasks"}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Add Photos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="condition" className="space-y-4">
          <div className="grid gap-4">
            {conditionReports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{report.room}</h3>
                      <p className="text-gray-600">Inspected on {new Date(report.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < report.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Photos: {report.photos}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Camera className="w-4 h-4 mr-2" />
                          View Photos
                        </Button>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Photos
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Issues Found: {report.issues.length}
                      </p>
                      {report.issues.length > 0 ? (
                        <ul className="text-sm text-gray-600 space-y-1">
                          {report.issues.map((issue, idx) => (
                            <li key={idx}>• {issue}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-green-600">No issues found</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button className="w-full">
            <FileText className="w-4 h-4 mr-2" />
            Generate Move-In Condition PDF Report
          </Button>
        </TabsContent>

        <TabsContent value="valuation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Current Home Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ${homeValue.toLocaleString()}
                </div>
                <div className="text-sm text-green-600 mb-4">
                  +${(homeValue - purchasePrice).toLocaleString()} ({Math.round(((homeValue - purchasePrice) / purchasePrice) * 100)}%) since purchase
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Purchase Price:</span>
                    <span>${purchasePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span>May 15, 2024</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Market Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Neighborhood Average:</span>
                    <span className="font-semibold">$465,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Price per Sq Ft:</span>
                    <span className="font-semibold">$285</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">6-Month Trend:</span>
                    <span className="text-green-600 font-semibold">+3.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Days on Market:</span>
                    <span className="font-semibold">28 days</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  View Comparable Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="roi" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Renovation ROI Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {renovationProjects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{project.name}</h4>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {project.roiPercentage}% ROI
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Investment:</span>
                        <div className="font-semibold">${project.cost.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Value Add:</span>
                        <div className="font-semibold text-green-600">+${project.valueAdd.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Net Impact:</span>
                        <div className={`font-semibold ${project.valueAdd - project.cost >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${(project.valueAdd - project.cost).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Calculate New Project ROI
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MoveInOut;
