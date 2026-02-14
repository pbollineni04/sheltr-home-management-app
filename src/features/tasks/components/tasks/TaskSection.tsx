
// This component is preserved for backward compatibility
// but the main TasksLists now uses inline kanban columns instead.

import { CheckSquare, Clock, LucideIcon } from "lucide-react";
import { Task } from "../../hooks/useTasks";
import TaskCard from "./TaskCard";

interface TaskSectionProps {
  title: string;
  icon: LucideIcon;
  tasks: Task[];
  onToggleComplete: (taskId: string, completed: boolean) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

const TaskSection = ({ title, icon: IconComponent, tasks, onToggleComplete, onDelete }: TaskSectionProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <IconComponent className="w-5 h-5" />
        {title} ({tasks.length})
      </h3>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          status={task.completed ? 'completed' : 'todo'}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskSection;
