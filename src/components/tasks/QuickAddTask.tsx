import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QuickAddTaskProps {
  selectedList: string;
  onAddTask: (taskData: any) => Promise<boolean>;
}

const QuickAddTask = ({ selectedList, onAddTask }: QuickAddTaskProps) => {
  const [newTask, setNewTask] = useState("");

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const success = await onAddTask({
      title: newTask,
      list_type: selectedList as 'maintenance' | 'projects' | 'shopping',
      priority: 'medium',
      completed: false
    });

    if (success) {
      setNewTask("");
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleQuickAdd} className="flex gap-2">
          <Input
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={!newTask.trim()}>Add</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuickAddTask;
