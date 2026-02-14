import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportReadingsToCSV } from '../utils/exportUtilities';
import type { UtilityReadingRow, Period } from '../types';

interface ExportButtonProps {
  readings: UtilityReadingRow[];
  period: Period;
}

const ExportButton = ({ readings, period }: ExportButtonProps) => {
  const handleExport = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    exportReadingsToCSV(readings, `utility-readings-${period}-${dateStr}.csv`);
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleExport}
      disabled={readings.length === 0}
    >
      <Download className="w-4 h-4 mr-2" />
      Export CSV
    </Button>
  );
};

export default ExportButton;
