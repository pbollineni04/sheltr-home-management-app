
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Home, Trash2 } from "lucide-react";
import { Task } from "@/hooks/useTasks";

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string, completed: boolean) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

const TaskCard = ({ task, onToggleComplete, onDelete }: TaskCardProps) => {
  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800"
    };
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${task.completed ? 'opacity-75' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox 
            className="mt-1" 
            checked={task.completed}
            onCheckedChange={() => onToggleComplete(task.id, task.completed)}
          />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h4 className={`font-semibold ${task.completed ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
                {task.title}
              </h4>
              <div className="flex items-center gap-2">
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(task.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {task.description && (
              <p className={`mb-2 ${task.completed ? 'text-gray-500 text-sm line-through' : 'text-gray-600'}`}>
                {task.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {task.due_date && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Due: {new Date(task.due_date).toLocaleDateString()}
                </span>
              )}
              {task.room && (
                <span className="flex items-center gap-1">
                  <Home className="w-4 h-4" />
                  {task.room}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
