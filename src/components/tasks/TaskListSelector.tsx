import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wrench, Home, ShoppingCart } from "lucide-react";
import { Task } from "@/hooks/useTasks";

interface TaskListSelectorProps {
  selectedList: string;
  onSelectList: (listId: string) => void;
  tasks: Task[];
}

const TaskListSelector = ({ selectedList, onSelectList, tasks }: TaskListSelectorProps) => {
  const taskLists = [
    { id: "maintenance", label: "Maintenance", icon: Wrench, color: "green" },
    { id: "projects", label: "Projects", icon: Home, color: "blue" },
    { id: "shopping", label: "Shopping", icon: ShoppingCart, color: "purple" }
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {taskLists.map((list) => {
        const IconComponent = list.icon;
        return (
          <Button
            key={list.id}
            variant={selectedList === list.id ? "default" : "outline"}
            onClick={() => onSelectList(list.id)}
            className="flex items-center gap-2"
          >
            <IconComponent className="w-4 h-4" />
            {list.label}
            <Badge variant="secondary" className="ml-1">
              {tasks.filter(t => t.list_type === list.id && !t.completed).length}
            </Badge>
          </Button>
        );
      })}
    </div>
  );
};

export default TaskListSelector;
