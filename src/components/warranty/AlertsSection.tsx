
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface AlertsSectionProps {
  expiringCount: number;
  expiredCount: number;
}

const AlertsSection = ({ expiringCount, expiredCount }: AlertsSectionProps) => {
  if (expiringCount === 0 && expiredCount === 0) return null;

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <h3 className="font-semibold text-yellow-800">Document Alerts</h3>
        </div>
        {expiredCount > 0 && (
          <p className="text-sm text-red-700 mb-1">
            {expiredCount} document(s) have expired
          </p>
        )}
        {expiringCount > 0 && (
          <p className="text-sm text-yellow-700">
            {expiringCount} document(s) expiring soon
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsSection;
