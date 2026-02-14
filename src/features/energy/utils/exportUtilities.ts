import type { UtilityReadingRow } from '../types';

/**
 * Export utility readings to a CSV file and trigger download
 */
export function exportReadingsToCSV(
  readings: UtilityReadingRow[],
  filename = 'utility-readings.csv'
): void {
  if (readings.length === 0) return;

  const headers = ['Date', 'Utility Type', 'Usage', 'Unit', 'Cost', 'Source'];

  const rows = readings.map((r) => [
    r.reading_date,
    r.utility_type,
    String(r.usage_amount),
    r.unit,
    r.cost != null ? r.cost.toFixed(2) : '',
    (r as any).auto_imported ? 'Auto-imported' : 'Manual',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => {
        // Escape cells containing commas or quotes
        if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}
