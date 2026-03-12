
import { CheckSquare, Calendar } from "lucide-react";

const EmptyTasksState = () => {
  return (
    <div className="bg-card border border-border rounded-lg p-12 text-center shadow-sm">
      <div className="p-4 bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
        <CheckSquare className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No tasks yet</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Click "Add Task" to create your first task and get organized.
      </p>
      <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-muted-foreground">
        <Calendar size={12} />
        <span>Scheduling a service? We'll auto-create a prep task for you.</span>
      </div>
    </div>
  );
};

export default EmptyTasksState;
