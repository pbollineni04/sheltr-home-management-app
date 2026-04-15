import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CostSummary, UtilityType } from '../types';
import { useChartTheme, UTILITY_COLORS } from '@/lib/chartTheme';

interface CostBreakdownChartProps {
  costSummary: CostSummary | null;
}

const UTILITY_LABELS: Record<UtilityType, string> = {
  electricity: 'Electricity',
  gas: 'Gas',
  water: 'Water',
  internet: 'Internet',
};

const CostBreakdownChart = ({ costSummary }: CostBreakdownChartProps) => {
  const chart = useChartTheme();

  const chartData = React.useMemo(() => {
    if (!costSummary) return [];

    return Object.entries(costSummary.costByUtility)
      .filter(([_, cost]) => cost > 0)
      .map(([utilityType, cost]) => ({
        name: UTILITY_LABELS[utilityType as UtilityType],
        value: cost,
        color: UTILITY_COLORS[utilityType as UtilityType],
      }));
  }, [costSummary]);

  if (!costSummary || chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No cost data to display
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `$${value.toFixed(2)}`}
              contentStyle={{
                backgroundColor: chart.tooltipBg,
                border: `1px solid ${chart.tooltipBorder}`,
                borderRadius: '6px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CostBreakdownChart;
