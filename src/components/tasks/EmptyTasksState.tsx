import { Card, CardContent } from "@/components/ui/card";
import { CheckSquare } from "lucide-react";

const EmptyTasksState = () => {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <CheckSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No tasks yet</h3>
        <p className="text-muted-foreground">Add your first task to get started.</p>
      </CardContent>
    </Card>
  );
};

export default EmptyTasksState;
