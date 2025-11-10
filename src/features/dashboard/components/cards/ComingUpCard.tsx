import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckSquare, FileWarning, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpcomingItem {
  type: 'task' | 'document' | 'maintenance' | 'event';
  title: string;
  date: string;
  daysUntil: number;
}

interface ComingUpCardProps {
  upcomingItems: UpcomingItem[];
  onNavigate: (tab: string) => void;
}

export const ComingUpCard = ({ upcomingItems, onNavigate }: ComingUpCardProps) => {
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'task': return CheckSquare;
      case 'document': return FileWarning;
      case 'maintenance': return Wrench;
      case 'event': return Calendar;
      default: return Calendar;
    }
  };

  const getItemColor = (daysUntil: number) => {
    if (daysUntil <= 3) return 'text-destructive';
    if (daysUntil <= 7) return 'text-orange-600 dark:text-orange-400';
    return 'text-purple-600 dark:text-purple-400';
  };

  const formatDaysUntil = (days: number) => {
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
  };

  return (
    <Card className="card-luxury hover:shadow-lg transition-shadow border-l-4 border-l-purple-600 dark:border-l-purple-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-heading-xl">
          <Calendar className="w-5 h-5 text-purple-600" />
          Coming Up
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingItems.length > 0 ? (
          <div className="space-y-3">
            {upcomingItems.slice(0, 3).map((item, index) => {
              const IconComponent = getItemIcon(item.type);
              return (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <IconComponent className={`w-5 h-5 mt-0.5 shrink-0 ${getItemColor(item.daysUntil)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDaysUntil(item.daysUntil)} · {item.date}
                    </p>
                  </div>
                </div>
              );
            })}
            {upcomingItems.length > 3 && (
              <p className="text-sm text-muted-foreground text-center">
                +{upcomingItems.length - 3} more upcoming
              </p>
            )}
            <Button
              onClick={() => onNavigate('tasks')}
              variant="outline"
              className="w-full btn-secondary-luxury mt-2"
              size="sm"
            >
              View All
            </Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-lg font-medium text-foreground">All Caught Up</p>
            <p className="text-sm text-muted-foreground">No upcoming items in the next 14 days</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
