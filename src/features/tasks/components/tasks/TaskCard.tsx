
import { CheckCircle2, Circle, Clock, Trash2, GripVertical } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { Task } from "../../hooks/useTasks";

const priorityColors = {
  high: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800',
  low: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800',
};

interface TaskCardProps {
  task: Task;
  status: 'todo' | 'in_progress' | 'completed';
  onToggleComplete: (taskId: string, completed: boolean) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  dragDisabled?: boolean;
}

const TaskCard = ({ task, status, onToggleComplete, onDelete, dragDisabled }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { task },
    disabled: dragDisabled,
  });

  const isOverdue = task.due_date
    ? new Date(task.due_date) < new Date() && !task.completed
    : false;

  const renderStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="text-green-600 dark:text-green-400" size={20} />;
      case 'in_progress':
        return <Clock className="text-yellow-600 dark:text-yellow-400" size={20} />;
      default:
        return <Circle className="text-gray-400 dark:text-gray-500" size={20} />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      className="bg-muted/40 border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      <div className="flex items-start gap-3">
        {/* Drag handle */}
        {!dragDisabled && (
          <button
            {...listeners}
            {...attributes}
            className="flex-shrink-0 mt-0.5 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Drag to reorder"
          >
            <GripVertical size={16} />
          </button>
        )}

        {/* Status toggle icon */}
        <button
          onClick={() => onToggleComplete(task.id, task.completed)}
          className="flex-shrink-0 mt-0.5 hover:scale-110 transition-transform"
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {renderStatusIcon()}
        </button>

        {/* Task content */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {/* Priority pill */}
            <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityColors[task.priority] || 'bg-muted text-muted-foreground border-border'}`}>
              {task.priority}
            </span>
            {/* Due date */}
            {task.due_date && (
              <span className={`text-xs ${isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-muted-foreground'}`}>
                Due: {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
            {/* Room */}
            {task.room && (
              <span className="text-xs text-muted-foreground">
                📍 {task.room}
              </span>
            )}
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={() => onDelete(task.id)}
          className="flex-shrink-0 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          aria-label="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
