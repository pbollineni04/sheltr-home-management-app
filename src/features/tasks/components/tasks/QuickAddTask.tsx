
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TaskTemplate } from "../../data/taskTemplates";
import { searchTasks } from "../../data/taskTemplates";

interface QuickAddTaskProps {
  selectedList: string;
  onAddTask: (taskData: any) => Promise<boolean>;
}

const QuickAddTask = ({ selectedList, onAddTask }: QuickAddTaskProps) => {
  const [newTask, setNewTask] = useState("");
  const [suggestions, setSuggestions] = useState<TaskTemplate[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  const addFromTemplate = async (t: TaskTemplate) => {
    const dueDate = t.due_date_offset_days
      ? new Date(Date.now() + t.due_date_offset_days * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0]
      : "";
    const success = await onAddTask({
      title: t.title,
      description: t.description ?? "",
      list_type: selectedList as 'maintenance' | 'projects' | 'shopping',
      priority: t.priority,
      due_date: dueDate,
      room: t.suggested_room ?? "",
      completed: false,
    });
    if (success) {
      setNewTask("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <Card className="card-luxury">
      <CardContent className="p-4">
        <form onSubmit={handleQuickAdd} className="flex gap-2 relative w-full">
          <Input
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => {
              const value = e.target.value;
              setNewTask(value);
              if (value.length >= 2) {
                const results = searchTasks(value).filter(
                  (t) => t.list_type === (selectedList as 'maintenance' | 'projects' | 'shopping')
                );
                setSuggestions(results.slice(0, 6));
                setShowSuggestions(results.length > 0);
              } else {
                setSuggestions([]);
                setShowSuggestions(false);
              }
            }}
            className="flex-1 input-luxury"
            onFocus={() => {
              if (newTask.length >= 2 && suggestions.length > 0) setShowSuggestions(true);
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
          />
          <Button type="submit" disabled={!newTask.trim()} className="btn-primary-luxury">Add</Button>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 card-luxury p-2 z-40">
              {suggestions.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className="w-full text-left px-3 py-2 rounded hover:bg-neutral-50 focus:bg-neutral-50"
                  onMouseDown={() => addFromTemplate(t)}
                >
                  <div className="text-sm font-medium text-neutral-800">{t.title}</div>
                  {t.description && (
                    <div className="text-xs text-neutral-600 truncate">{t.description}</div>
                  )}
                  <div className="text-xs text-neutral-500">{t.priority} • {t.list_type}</div>
                </button>
              ))}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default QuickAddTask;
