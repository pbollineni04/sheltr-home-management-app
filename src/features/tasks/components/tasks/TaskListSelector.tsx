
import { Wrench, Home, ShoppingCart } from "lucide-react";
import { Task } from "../../hooks/useTasks";

interface TaskListSelectorProps {
  selectedList: string;
  onSelectList: (listId: string) => void;
  tasks: Task[];
}

const taskLists = [
  { id: "maintenance", label: "Maintenance", icon: Wrench },
  { id: "projects", label: "Projects", icon: Home },
  { id: "shopping", label: "Shopping", icon: ShoppingCart },
];

const TaskListSelector = ({ selectedList, onSelectList, tasks }: TaskListSelectorProps) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {taskLists.map((list) => {
        const IconComponent = list.icon;
        const count = tasks.filter(t => t.list_type === list.id && !t.completed).length;
        const isActive = selectedList === list.id;
        return (
          <button
            key={list.id}
            onClick={() => onSelectList(list.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${isActive
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-foreground border-border hover:bg-muted'
              }`}
          >
            <IconComponent size={16} />
            {list.label}
            {count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
                }`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TaskListSelector;
