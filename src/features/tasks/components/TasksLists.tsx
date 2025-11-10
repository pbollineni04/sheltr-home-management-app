
import { useState } from "react";
import { CheckSquare, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTasks } from "../hooks/useTasks";
import AddTaskDialog from "./AddTaskDialog";
import TaskListSelector from "./tasks/TaskListSelector";
import QuickAddTask from "./tasks/QuickAddTask";
import TaskSection from "./tasks/TaskSection";
import EmptyTasksState from "./tasks/EmptyTasksState";
import { getTaskBundle } from "../data/taskTemplates";
import type { TaskTemplate } from "../data/taskTemplates";

const TasksLists = () => {
  const [selectedList, setSelectedList] = useState("maintenance");
  const { tasks, loading, addTask, toggleTaskComplete, deleteTask } = useTasks();

  const filteredTasks = tasks.filter(task => task.list_type === selectedList);
  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    await toggleTaskComplete(taskId, !completed);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const handleQuickBundle = async (bundleId: string) => {
    const bundle = getTaskBundle(bundleId);
    if (bundle && bundle.taskTemplates) {
      for (const template of bundle.taskTemplates as TaskTemplate[]) {
        const dueDate = template.due_date_offset_days 
          ? new Date(Date.now() + template.due_date_offset_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          : undefined;

        await addTask({
          title: template.title,
          description: template.description ?? "",
          list_type: selectedList as 'maintenance' | 'projects' | 'shopping',
          priority: template.priority,
          due_date: dueDate ?? "",
          room: template.suggested_room ?? "",
          completed: false
        });
      }
    }
  };

  // Get relevant quick bundles based on selected list and season
  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  };

  const getQuickBundles = () => {
    const season = getCurrentSeason();
    const relevantBundles = [];
    
    if (selectedList === 'maintenance') {
      relevantBundles.push('monthly-maintenance', 'safety-check');
      if (season === 'spring') relevantBundles.push('spring-cleaning');
      if (season === 'fall') relevantBundles.push('winter-prep');
    } else if (selectedList === 'shopping') {
      relevantBundles.push('basic-toolkit');
    }
    
    return relevantBundles;
  };

  if (loading) {
    return (
      <div className="space-y-6 px-3 sm:px-4">
        <div className="flex justify-center items-center py-12">
          <div className="text-lg text-muted-foreground">Loading tasks...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-3 sm:px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-heading-xl text-foreground">Tasks & Lists</h2>
          <p className="text-body-luxury text-muted-foreground">Organize maintenance and projects</p>
        </div>
        <AddTaskDialog selectedList={selectedList} />
      </div>

      {/* List Selector */}
      <TaskListSelector 
        selectedList={selectedList}
        onSelectList={setSelectedList}
        tasks={tasks}
      />

      {/* Quick Bundle Buttons */}
      {getQuickBundles().length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 icon-accent" />
            <span className="text-caption-refined text-muted-foreground">Quick Setup</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {getQuickBundles().map((bundleId) => {
              const bundle = getTaskBundle(bundleId);
              if (!bundle) return null;
              
              return (
                <Button
                  key={bundleId}
                  className="btn-secondary-luxury"
                  size="sm"
                  onClick={() => handleQuickBundle(bundleId)}
                  
                >
                  <span>{bundle.icon}</span>
                  {bundle.name}
                  <span className="text-xs text-muted-foreground">
                    ({bundle.tasks.length})
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Add Task */}
      <QuickAddTask 
        selectedList={selectedList}
        onAddTask={addTask}
      />

      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <TaskSection
          title="Pending Tasks"
          icon={Clock}
          tasks={pendingTasks}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteTask}
        />
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <TaskSection
          title="Completed"
          icon={CheckSquare}
          tasks={completedTasks}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteTask}
        />
      )}

      {/* Empty State */}
      {filteredTasks.length === 0 && <EmptyTasksState />}
    </div>
  );
};

export default TasksLists;
