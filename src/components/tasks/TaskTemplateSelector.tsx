import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Calendar, Home, Wrench, ShoppingCart } from "lucide-react";
import { TaskTemplate, taskTemplates, getTasksByListType, searchTasks } from "@/data/taskTemplates";

interface TaskTemplateSelectorProps {
  selectedListType: 'maintenance' | 'projects' | 'shopping';
  onSelectTasks: (tasks: TaskTemplate[]) => void;
  onClose: () => void;
}

const TaskTemplateSelector = ({ selectedListType, onSelectTasks, onClose }: TaskTemplateSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState("all");

  const allTasks = getTasksByListType(selectedListType);
  const filteredTasks = searchQuery 
    ? searchTasks(searchQuery).filter(task => task.list_type === selectedListType)
    : allTasks;

  const categoryTasks = activeCategory === "all" 
    ? filteredTasks 
    : filteredTasks.filter(task => task.subcategory.toLowerCase() === activeCategory);

  const categories = [...new Set(allTasks.map(task => task.subcategory))];

  const handleTaskToggle = (taskId: string) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const handleAddSelected = () => {
    const tasksToAdd = taskTemplates.filter(task => selectedTasks.has(task.id));
    onSelectTasks(tasksToAdd);
    onClose();
  };

  const getListIcon = () => {
    switch (selectedListType) {
      case 'maintenance': return <Wrench className="w-4 h-4" />;
      case 'projects': return <Home className="w-4 h-4" />;
      case 'shopping': return <ShoppingCart className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive';
      case 'medium': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        {getListIcon()}
        <h3 className="text-lg font-semibold capitalize">
          {selectedListType} Task Templates
        </h3>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.slice(0, 3).map(category => (
            <TabsTrigger key={category} value={category.toLowerCase()}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="space-y-3 max-h-96 overflow-y-auto">
          {categoryTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox 
                    checked={selectedTasks.has(task.id)}
                    onCheckedChange={() => handleTaskToggle(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-foreground">{task.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        {task.frequency && (
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="w-3 h-3 mr-1" />
                            {task.frequency}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {task.suggested_room && (
                        <span>📍 {task.suggested_room}</span>
                      )}
                      {task.season && (
                        <span>🗓️ {task.season}</span>
                      )}
                      {task.due_date_offset_days && (
                        <span>⏱️ Due in {task.due_date_offset_days} days</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {categoryTasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No tasks found for your search criteria
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4 border-t">
        <span className="text-sm text-muted-foreground">
          {selectedTasks.size} task{selectedTasks.size !== 1 ? 's' : ''} selected
        </span>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddSelected}
            disabled={selectedTasks.size === 0}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Selected ({selectedTasks.size})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskTemplateSelector;
