import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { TrendData, UtilityType } from '../types';

interface TrendComparisonChartProps {
  trends: TrendData[];
}

const UTILITY_LABELS: Record<UtilityType, string> = {
  electricity: 'Electricity',
  gas: 'Gas',
  water: 'Water',
  internet: 'Internet',
};

const TrendComparisonChart = ({ trends }: TrendComparisonChartProps) => {
  const [viewMode, setViewMode] = useState<'usage' | 'cost'>('usage');

  const chartData = React.useMemo(() => {
    return trends.map(trend => ({
      name: UTILITY_LABELS[trend.utilityType],
      current: viewMode === 'usage' ? trend.currentUsage : trend.currentCost,
      previous: viewMode === 'usage' ? trend.previousUsage : trend.previousCost,
    }));
  }, [trends, viewMode]);

  if (trends.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trend Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No trend data to display
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Trend Comparison</CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={viewMode === 'usage' ? 'default' : 'outline'}
              onClick={() => setViewMode('usage')}
            >
              Usage
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'cost' ? 'default' : 'outline'}
              onClick={() => setViewMode('cost')}
            >
              Cost
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip
              formatter={(value: number) =>
                viewMode === 'cost' ? `$${value.toFixed(2)}` : value.toFixed(2)
              }
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
              }}
            />
            <Legend />
            <Bar dataKey="current" fill="#3b82f6" name="Current Period" />
            <Bar dataKey="previous" fill="#94a3b8" name="Previous Period" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TrendComparisonChart;
