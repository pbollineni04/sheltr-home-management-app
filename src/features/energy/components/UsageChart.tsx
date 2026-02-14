import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { UtilityReadingRow, ChartDataPoint, Period } from '../types';
import { format } from 'date-fns';

interface UsageChartProps {
  readings: UtilityReadingRow[];
  period?: Period;
}

const UsageChart = ({ readings, period = 'month' }: UsageChartProps) => {
  const periodLabel = period === 'quarter' ? 'Quarter' : period === 'year' ? 'Year' : 'Month';
  // Transform readings into chart data
  const chartData: ChartDataPoint[] = React.useMemo(() => {
    // Group readings by date
    const dateMap = new Map<string, ChartDataPoint>();

    readings.forEach(reading => {
      const date = reading.reading_date;
      if (!dateMap.has(date)) {
        dateMap.set(date, { date });
      }

      const dataPoint = dateMap.get(date)!;
      dataPoint[reading.utility_type] = reading.usage_amount;
    });

    // Convert to array and sort by date
    return Array.from(dateMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(point => ({
        ...point,
        date: format(new Date(point.date), period === 'year' ? 'MMM yyyy' : 'MMM dd'),
      }));
  }, [readings]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage Over {periodLabel}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data to display
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="electricity"
              stroke="#eab308"
              strokeWidth={2}
              name="Electricity (kWh)"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="gas"
              stroke="#f97316"
              strokeWidth={2}
              name="Gas (therms)"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="water"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Water (gal)"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="internet"
              stroke="#a855f7"
              strokeWidth={2}
              name="Internet (GB)"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default UsageChart;
