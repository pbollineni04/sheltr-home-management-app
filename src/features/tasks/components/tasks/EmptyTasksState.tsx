import { CheckSquare } from "lucide-react";
import FeatureGuide from "@/components/FeatureGuide";

interface EmptyTasksStateProps {
  onAddTask: () => void;
}

const EmptyTasksState = ({ onAddTask }: EmptyTasksStateProps) => {
  return (
    <FeatureGuide
      icon={CheckSquare}
      title="Manage your home tasks"
      description="Keep track of maintenance, projects, and shopping — all in one place."
      bullets={[
        "Track maintenance schedules and home projects",
        "Set reminders and due dates with priority levels",
        "Auto-create tasks when you schedule services",
      ]}
      ctaLabel="Create your first task"
      onCtaClick={onAddTask}
      iconBgClass="bg-blue-100 dark:bg-blue-900/30"
      iconColorClass="text-blue-600"
      bulletDotClass="bg-blue-600"
      accentBorderClass="border-t-blue-500"
    />
  );
};

export default EmptyTasksState;
