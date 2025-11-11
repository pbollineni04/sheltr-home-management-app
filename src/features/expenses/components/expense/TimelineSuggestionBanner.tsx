import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, X, Sparkles } from "lucide-react";
import { ExpenseService } from "../../services/expenseService";
import { useToast } from "@/hooks/use-toast";

interface TimelineSuggestionBannerProps {
  expenseId: string;
  expenseDescription: string;
  expenseAmount: number;
  onDismiss: () => void;
}

export const TimelineSuggestionBanner = ({
  expenseId,
  expenseDescription,
  expenseAmount,
  onDismiss
}: TimelineSuggestionBannerProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAddToTimeline = async () => {
    setLoading(true);
    try {
      await ExpenseService.createTimelineFromExpense(expenseId);
      toast({
        title: "Added to Timeline",
        description: "This expense has been added to your home timeline",
      });
      onDismiss();
    } catch (error) {
      console.error('Error adding to timeline:', error);
      toast({
        title: "Error",
        description: "Failed to add to timeline",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async () => {
    setLoading(true);
    try {
      await ExpenseService.dismissTimelineSuggestion(expenseId);
      onDismiss();
    } catch (error) {
      console.error('Error dismissing suggestion:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
              Add to Home Timeline?
            </h4>
            <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
              This is a significant expense (${expenseAmount.toLocaleString()}) - would you like to add it to your home's service history?
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={handleAddToTimeline}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Add to Timeline
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDismiss}
                disabled={loading}
                className="border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50"
              >
                <X className="w-4 h-4 mr-2" />
                Not Now
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
