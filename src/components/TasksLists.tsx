
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, 
  CheckSquare, 
  Clock, 
  AlertTriangle,
  Home,
  Wrench,
  ShoppingCart
} from "lucide-react";

const TasksLists = () => {
  const [newTask, setNewTask] = useState("");
  const [selectedList, setSelectedList] = useState("maintenance");

  const taskLists = [
    { id: "maintenance", label: "Maintenance", icon: Wrench, color: "green" },
    { id: "projects", label: "Projects", icon: Home, color: "blue" },
    { id: "shopping", label: "Shopping", icon: ShoppingCart, color: "purple" }
  ];

  const tasks = [
    {
      id: 1,
      title: "Replace HVAC filters",
      description: "Monthly maintenance task",
      list: "maintenance",
      priority: "medium",
      dueDate: "2024-06-15",
      completed: false,
      room: "Basement"
    },
    {
      id: 2,
      title: "Clean gutters",
      description: "Remove leaves and debris",
      list: "maintenance",
      priority: "high",
      dueDate: "2024-06-10",
      completed: true,
      room: "Exterior"
    },
    {
      id: 3,
      title: "Paint guest bedroom",
      description: "Prep walls and apply two coats",
      list: "projects",
      priority: "low",
      dueDate: "2024-07-01",
      completed: false,
      room: "Guest Bedroom"
    },
    {
      id: 4,
      title: "Buy LED bulbs",
      description: "Replace all incandescent bulbs",
      list: "shopping",
      priority: "medium",
      dueDate: "2024-06-20",
      completed: false,
      room: "Whole House"
    }
  ];

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800"
    };
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const filteredTasks = tasks.filter(task => task.list === selectedList);
  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Tasks & Lists</h2>
          <p className="text-gray-600">Organize maintenance and projects</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* List Selector */}
      <div className="flex gap-2 flex-wrap">
        {taskLists.map((list) => {
          const IconComponent = list.icon;
          return (
            <Button
              key={list.id}
              variant={selectedList === list.id ? "default" : "outline"}
              onClick={() => setSelectedList(list.id)}
              className="flex items-center gap-2"
            >
              <IconComponent className="w-4 h-4" />
              {list.label}
              <Badge variant="secondary" className="ml-1">
                {tasks.filter(t => t.list === list.id && !t.completed).length}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Add New Task */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-1"
            />
            <Button>Add</Button>
          </div>
        </CardContent>
      </Card>

      {/* Pending Tasks */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Pending Tasks ({pendingTasks.length})
        </h3>
        
        {pendingTasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Checkbox className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{task.title}</h4>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-2">{task.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Home className="w-4 h-4" />
                      {task.room}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            Completed ({completedTasks.length})
          </h3>
          
          {completedTasks.map((task) => (
            <Card key={task.id} className="opacity-75">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox checked className="mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-600 line-through">{task.title}</h4>
                    <p className="text-gray-500 text-sm">{task.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredTasks.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
            <p className="text-gray-500">Add your first task to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TasksLists;
