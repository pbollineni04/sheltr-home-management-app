
import { useState } from "react";
import { CheckSquare, Clock } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import AddTaskDialog from "@/components/AddTaskDialog";
import TaskListSelector from "@/components/tasks/TaskListSelector";
import QuickAddTask from "@/components/tasks/QuickAddTask";
import TaskSection from "@/components/tasks/TaskSection";
import EmptyTasksState from "@/components/tasks/EmptyTasksState";

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-12">
          <div className="text-lg text-gray-600">Loading tasks...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Tasks & Lists</h2>
          <p className="text-gray-600">Organize maintenance and projects</p>
        </div>
        <AddTaskDialog selectedList={selectedList} />
      </div>

      {/* List Selector */}
      <TaskListSelector 
        selectedList={selectedList}
        onSelectList={setSelectedList}
        tasks={tasks}
      />

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
