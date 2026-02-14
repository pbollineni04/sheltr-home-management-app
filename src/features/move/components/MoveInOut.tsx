
import { useState } from "react";
import { motion } from "framer-motion";
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
import { listItemAnim, cardItemAnim } from "@/lib/motion";

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
      "move-in": "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20",
      "move-out": "bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20",
      "staging": "bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20"
    };
    return colors[category as keyof typeof colors] || "bg-muted text-muted-foreground border border-border";
  };

  const getStatusColor = (status: string) => {
    const colors = {
      "planned": "bg-muted text-muted-foreground border border-border",
      "in-progress": "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20",
      "completed": "bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20"
    };
    return colors[status as keyof typeof colors] || "bg-muted text-muted-foreground border border-border";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-foreground">Move & Property Management</h2>
          <p className="text-muted-foreground">Lifecycle management and real estate insights</p>
        </div>
        <Button className="btn-primary-luxury">
          <Plus className="w-4 h-4 mr-2" />
          New Checklist
        </Button>
      </motion.div>

      <Tabs defaultValue="checklists" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="checklists">Checklists</TabsTrigger>
          <TabsTrigger value="condition">Condition Reports</TabsTrigger>
          <TabsTrigger value="valuation">Home Value</TabsTrigger>
          <TabsTrigger value="roi">ROI Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="checklists" className="space-y-4">
          <div className="grid gap-4">
            {checklists.map((checklist, i) => (
              <motion.div key={checklist.id} {...listItemAnim(i)}>
                <Card className="card-luxury hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-foreground">{checklist.title}</h3>
                          <Badge className={getCategoryColor(checklist.category)}>
                            {checklist.category}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{checklist.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                        <div className="text-2xl font-bold text-foreground">
                          {Math.round((checklist.progress / checklist.total) * 100)}%
                        </div>
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full"
                            style={{ width: `${(checklist.progress / checklist.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    {activeChecklist === checklist.id && checklist.id === "move-in" && (
                      <div className="border-t border-border pt-4 space-y-2">
                        {moveInTasks.map((task) => (
                          <div key={task.id} className="flex items-center gap-3 p-2 hover:bg-muted rounded">
                            {task.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-muted-foreground" />
                            )}
                            <span className={task.completed ? "text-muted-foreground line-through" : "text-foreground"}>
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
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="condition" className="space-y-4">
          <div className="grid gap-4">
            {conditionReports.map((report, i) => (
              <motion.div key={report.id} {...cardItemAnim(i)}>
                <Card className="card-luxury">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{report.room}</h3>
                        <p className="text-muted-foreground">Inspected on {new Date(report.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < report.rating ? "text-yellow-400 fill-current" : "text-muted"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Photos: {report.photos}</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="btn-secondary-luxury">
                            <Camera className="w-4 h-4 mr-2" />
                            View Photos
                          </Button>
                          <Button variant="outline" size="sm" className="btn-secondary-luxury">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Photos
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">
                          Issues Found: {report.issues.length}
                        </p>
                        {report.issues.length > 0 ? (
                          <ul className="text-sm text-muted-foreground space-y-1">
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
              </motion.div>
            ))}
          </div>
          <Button className="w-full btn-primary-luxury">
            <FileText className="w-4 h-4 mr-2" />
            Generate Move-In Condition PDF Report
          </Button>
        </TabsContent>

        <TabsContent value="valuation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Current Home Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground mb-2">
                  ${homeValue.toLocaleString()}
                </div>
                <div className="text-sm text-green-600 mb-4">
                  +${(homeValue - purchasePrice).toLocaleString()} ({Math.round(((homeValue - purchasePrice) / purchasePrice) * 100)}%) since purchase
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
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

            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Market Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Neighborhood Average:</span>
                    <span className="font-semibold">$465,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Price per Sq Ft:</span>
                    <span className="font-semibold">$285</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">6-Month Trend:</span>
                    <span className="text-green-600 font-semibold">+3.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Days on Market:</span>
                    <span className="font-semibold">28 days</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 btn-secondary-luxury">
                  <MapPin className="w-4 h-4 mr-2" />
                  View Comparable Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="roi" className="space-y-6">
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Renovation ROI Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {renovationProjects.map((project, i) => (
                  <motion.div key={project.id} {...listItemAnim(i)} className="border border-border rounded-lg p-4 hover:shadow-md hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground">{project.name}</h4>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-foreground">
                          {project.roiPercentage}% ROI
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Investment:</span>
                        <div className="font-semibold">${project.cost.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Value Add:</span>
                        <div className="font-semibold text-green-600">+${project.valueAdd.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Net Impact:</span>
                        <div className={`font-semibold ${project.valueAdd - project.cost >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                          ${(project.valueAdd - project.cost).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Button className="w-full mt-4 btn-primary-luxury">
                <Plus className="w-4 h-4 mr-2" />
                Calculate New Project ROI
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div >
  );
};

export default MoveInOut;
