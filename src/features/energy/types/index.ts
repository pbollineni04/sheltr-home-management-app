import type { Database } from "@/integrations/supabase/types";

export type UtilityReadingRow = Database["public"]["Tables"]["utility_readings"]["Row"];
export type UtilityReadingInsert = Database["public"]["Tables"]["utility_readings"]["Insert"];
export type UtilityType = Database["public"]["Enums"]["utility_type"];

export interface TrendData {
  utilityType: UtilityType;
  currentUsage: number;
  previousUsage: number;
  currentCost: number;
  previousCost: number;
  usageTrendPercent: number;
  costTrendPercent: number;
  trendDirection: 'up' | 'down' | 'stable';
}

export interface CostSummary {
  totalCost: number;
  costByUtility: Record<UtilityType, number>;
  usageByUtility: Record<UtilityType, number>;
  percentageChange: number;
  previousPeriodCost: number;
}

export interface SustainabilityMetrics {
  carbonFootprint: number; // tons CO2
  carbonReduction: number; // percentage vs previous period
  renewablePercent: number; // solar generation / electricity usage (not applicable yet, future use)
  efficiencyScore: number; // 0-100 based on historical averages
}

export interface ChartDataPoint {
  date: string;
  electricity?: number;
  gas?: number;
  water?: number;
  internet?: number;
  totalCost?: number;
}

export interface ReadingFormData {
  utility_type: UtilityType;
  usage_amount: string;
  unit: string;
  cost: string;
  reading_date: string;
}

// Period type for date range filtering
export type Period = 'month' | 'quarter' | 'year';

// Carbon conversion factors (tons CO2)
export const CARBON_FACTORS = {
  electricity: 0.00046, // tons CO2 per kWh
  gas: 0.00585,         // tons CO2 per therm
  water: 0.000001,      // tons CO2 per gallon
  internet: 0,          // no direct emissions
} as const;

// Default units by utility type
export const DEFAULT_UNITS: Record<UtilityType, string> = {
  electricity: 'kWh',
  gas: 'therms',
  water: 'gallons',
  internet: 'GB',
} as const;

// Available units by utility type
export const AVAILABLE_UNITS: Record<UtilityType, string[]> = {
  electricity: ['kWh'],
  gas: ['therms', 'CCF'],
  water: ['gallons', 'cubic feet'],
  internet: ['GB', 'TB'],
} as const;

// Utility API Integration types
export type UtilityConnectionRow = Database["public"]["Tables"]["utility_connections"]["Row"];
export type UtilityAccountRow = Database["public"]["Tables"]["utility_accounts"]["Row"];
export type UtilityBillRawRow = Database["public"]["Tables"]["utility_bills_raw"]["Row"];
export type UtilitySyncStateRow = Database["public"]["Tables"]["utility_sync_state"]["Row"];

export type ConnectionStatus = 'active' | 'inactive' | 'error';

export interface BillReviewItem {
  reading: UtilityReadingRow;
  bill?: UtilityBillRawRow;
  confidence: 'high' | 'medium' | 'low';
}

export interface EfficiencyTip {
  id: string;
  title: string;
  description: string;
  category: UtilityType;
  priority: 'high' | 'medium' | 'low';
  estimatedSavings: string;
  basedOn: string;
}

export interface AnomalyAlert {
  utilityType: UtilityType;
  currentUsage: number;
  averageUsage: number;
  percentIncrease: number;
  readingDate: string;
}
