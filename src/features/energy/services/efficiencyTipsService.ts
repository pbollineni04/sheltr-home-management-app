import type { UtilityReadingRow, TrendData, EfficiencyTip, UtilityType } from '../types';

/**
 * Generate dynamic efficiency tips based on actual usage data
 */
export function generateTips(
  readings: UtilityReadingRow[],
  trends: TrendData[]
): EfficiencyTip[] {
  const tips: EfficiencyTip[] = [];

  // Analyze each utility type
  for (const trend of trends) {
    const utilityReadings = readings.filter(r => r.utility_type === trend.utilityType);

    // Tip: High usage trend
    if (trend.trendDirection === 'up' && trend.usageTrendPercent > 10) {
      tips.push({
        id: `trend-up-${trend.utilityType}`,
        title: `Rising ${capitalize(trend.utilityType)} Usage`,
        description: getUsageReductionTip(trend.utilityType, trend.usageTrendPercent),
        category: trend.utilityType,
        priority: trend.usageTrendPercent > 25 ? 'high' : 'medium',
        estimatedSavings: estimateSavings(trend),
        basedOn: `${trend.usageTrendPercent.toFixed(0)}% increase vs previous period`,
      });
    }

    // Tip: High cost relative to usage
    if (trend.costTrendPercent > trend.usageTrendPercent + 5) {
      tips.push({
        id: `rate-spike-${trend.utilityType}`,
        title: `${capitalize(trend.utilityType)} Rate Increase Detected`,
        description: `Your cost increased ${trend.costTrendPercent.toFixed(0)}% while usage only changed ${trend.usageTrendPercent.toFixed(0)}%. Consider reviewing your rate plan or provider.`,
        category: trend.utilityType,
        priority: 'medium',
        estimatedSavings: `$${Math.abs(trend.currentCost - trend.previousCost).toFixed(0)}/period`,
        basedOn: 'Cost vs usage divergence',
      });
    }

    // Tip: Seasonal efficiency
    const seasonalTip = getSeasonalTip(trend.utilityType, utilityReadings);
    if (seasonalTip) {
      tips.push(seasonalTip);
    }
  }

  // Tip: High overall spending
  const totalCost = trends.reduce((sum, t) => sum + t.currentCost, 0);
  if (totalCost > 500) {
    tips.push({
      id: 'high-total-cost',
      title: 'High Total Utility Spending',
      description: 'Your total utility costs are above $500. Consider a home energy audit to identify major savings opportunities.',
      category: 'electricity',
      priority: 'high',
      estimatedSavings: `$${(totalCost * 0.15).toFixed(0)}/period (15% potential reduction)`,
      basedOn: `Total spending: $${totalCost.toFixed(0)}`,
    });
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  tips.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return tips;
}

function getUsageReductionTip(utilityType: UtilityType, percentIncrease: number): string {
  const tips: Record<UtilityType, string> = {
    electricity: 'Run dishwasher and laundry during off-peak hours (9 PM - 6 AM). Unplug idle electronics and switch to LED bulbs.',
    gas: 'Lower your thermostat by 2 degrees and use a programmable schedule. Seal air leaks around windows and doors.',
    water: 'Check for running toilets and dripping faucets. Water lawn in early morning to reduce evaporation.',
    internet: 'Review your data usage across devices. Consider optimizing streaming quality settings.',
  };
  return tips[utilityType];
}

function getSeasonalTip(utilityType: UtilityType, readings: UtilityReadingRow[]): EfficiencyTip | null {
  if (readings.length < 2) return null;

  const now = new Date();
  const month = now.getMonth();

  // Summer tips (June-August)
  if (month >= 5 && month <= 7) {
    if (utilityType === 'electricity') {
      return {
        id: 'seasonal-summer-electric',
        title: 'Summer Cooling Optimization',
        description: 'Set AC to 78°F when home, 85°F when away. Use ceiling fans to feel 4°F cooler. Close blinds on south-facing windows.',
        category: 'electricity',
        priority: 'medium',
        estimatedSavings: '$30-50/month',
        basedOn: 'Seasonal pattern (summer)',
      };
    }
    if (utilityType === 'water') {
      return {
        id: 'seasonal-summer-water',
        title: 'Summer Water Conservation',
        description: 'Water lawn 2-3 times per week max, early morning. Use mulch around plants to retain moisture.',
        category: 'water',
        priority: 'low',
        estimatedSavings: '$10-20/month',
        basedOn: 'Seasonal pattern (summer)',
      };
    }
  }

  // Winter tips (December-February)
  if (month >= 11 || month <= 1) {
    if (utilityType === 'gas') {
      return {
        id: 'seasonal-winter-gas',
        title: 'Winter Heating Efficiency',
        description: 'Lower thermostat to 68°F during the day, 60°F at night. Use draft stoppers on exterior doors.',
        category: 'gas',
        priority: 'medium',
        estimatedSavings: '$40-60/month',
        basedOn: 'Seasonal pattern (winter)',
      };
    }
  }

  return null;
}

function estimateSavings(trend: TrendData): string {
  const excess = trend.currentCost - trend.previousCost;
  if (excess <= 0) return '$0/period';
  return `$${(excess * 0.5).toFixed(0)}/period`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
