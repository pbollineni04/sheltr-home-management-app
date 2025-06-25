
import { Card, CardContent } from "@/components/ui/card";
import { CheckSquare } from "lucide-react";

const EmptyTasksState = () => {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-500">Add your first task to get started.</p>
      </CardContent>
    </Card>
  );
};

export default EmptyTasksState;
