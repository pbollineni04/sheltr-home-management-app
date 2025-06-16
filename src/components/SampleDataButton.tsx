
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { addSampleTasks, addSampleRooms } from "@/utils/sampleData";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2, Database } from "lucide-react";

const SampleDataButton = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddSampleData = async () => {
    if (!user?.id) {
      toast.error("Please log in first");
      return;
    }

    setIsLoading(true);
    try {
      await addSampleRooms(user.id);
      await addSampleTasks(user.id);
      toast.success("Sample data added successfully!");
    } catch (error) {
      console.error("Error adding sample data:", error);
      toast.error("Failed to add sample data");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Button
      onClick={handleAddSampleData}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Database className="w-4 h-4" />
      )}
      Add Sample Data
    </Button>
  );
};

export default SampleDataButton;
