import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Clock, FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Alert {
  type: 'overdue_task' | 'expiring_document' | 'budget_exceeded' | 'maintenance_due';
  message: string;
  count?: number;
  severity: 'high' | 'medium' | 'low';
}

interface PriorityAlertsCardProps {
  alerts: Alert[];
  onNavigate: (tab: string) => void;
}

export const PriorityAlertsCard = ({ alerts, onNavigate }: PriorityAlertsCardProps) => {
  const hasAlerts = alerts.length > 0;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-orange-600 dark:text-orange-400';
      case 'low': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-muted-foreground';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'overdue_task': return Clock;
      case 'expiring_document': return FileWarning;
      case 'budget_exceeded': return AlertTriangle;
      default: return AlertTriangle;
    }
  };

  return (
    <Card className="card-luxury hover:shadow-lg transition-shadow border-l-4 border-l-red-600 dark:border-l-red-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-heading-xl">
          {hasAlerts ? (
            <>
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Priority Alerts
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 text-green-600" />
              All Clear
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasAlerts ? (
          <div className="space-y-3">
            {alerts.slice(0, 3).map((alert, index) => {
              const IconComponent = getAlertIcon(alert.type);
              return (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <IconComponent className={`w-5 h-5 mt-0.5 shrink-0 ${getSeverityColor(alert.severity)}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.message}
                    </p>
                  </div>
                </div>
              );
            })}
            {alerts.length > 3 && (
              <p className="text-sm text-muted-foreground text-center">
                +{alerts.length - 3} more items need attention
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <p className="text-lg font-medium text-foreground">Everything's on track!</p>
            <p className="text-sm text-muted-foreground">No urgent items requiring attention</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
