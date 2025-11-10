
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Home, Trash2 } from "lucide-react";
import { Task } from "../../hooks/useTasks";

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string, completed: boolean) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

const TaskCard = ({ task, onToggleComplete, onDelete }: TaskCardProps) => {
  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-destructive/10 text-destructive",
      medium: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
      low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
    };
    return colors[priority as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  return (
    <Card className={`card-luxury hover:shadow-md transition-shadow ${task.completed ? 'opacity-75' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox 
            className="mt-1" 
            checked={task.completed}
            onCheckedChange={() => onToggleComplete(task.id, task.completed)}
          />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h4 className={`font-semibold ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
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
                  className="text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {task.description && (
              <p className={`mb-2 ${task.completed ? 'text-muted-foreground text-sm line-through' : 'text-muted-foreground'}`}>
                {task.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
