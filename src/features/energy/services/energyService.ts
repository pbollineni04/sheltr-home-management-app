import { supabase } from "@/integrations/supabase/client";
import type {
  UtilityReadingRow,
  UtilityReadingInsert,
  UtilityType,
  TrendData,
  CostSummary,
  SustainabilityMetrics,
  Period,
} from "../types";
import { CARBON_FACTORS } from "../types";

export class EnergyService {
  /**
   * Create a new utility reading
   */
  static async createReading(reading: Omit<UtilityReadingInsert, 'user_id'>): Promise<UtilityReadingRow> {
    const userRes = await supabase.auth.getUser();
    const userId = userRes.data.user?.id;
    if (!userId) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("utility_readings")
      .insert({ ...reading, user_id: userId })
      .select("*")
      .single();

    if (error) throw error;

    const createdReading = data as UtilityReadingRow;

    // Auto-suggest timeline entry for high-cost readings ($200+)
    if (createdReading.cost && createdReading.cost >= 200) {
      try {
        await this.createTimelineFromReading(createdReading.id);
      } catch (err) {
        console.error('Error creating timeline entry:', err);
      }
    }

    return createdReading;
  }

  /**
   * Get readings by period (month, quarter, year)
   */
  static async getReadingsByPeriod(period: Period): Promise<UtilityReadingRow[]> {
    const userRes = await supabase.auth.getUser();
    const userId = userRes.data.user?.id;
    if (!userId) throw new Error("Not authenticated");

    const { startDate, endDate } = this.calculateDateRange(period);

    const { data, error } = await supabase
      .from("utility_readings")
      .select("*")
      .eq("user_id", userId)
      .gte("reading_date", startDate)
      .lte("reading_date", endDate)
      .order("reading_date", { ascending: false })
      .order("utility_type", { ascending: true });

    if (error) throw error;
    return data as UtilityReadingRow[];
  }

  /**
   * Get readings by custom date range with optional utility type filter
   */
  static async getReadingsByDateRange(
    startDate: string,
    endDate: string,
    utilityType?: UtilityType
  ): Promise<UtilityReadingRow[]> {
    const userRes = await supabase.auth.getUser();
    const userId = userRes.data.user?.id;
    if (!userId) throw new Error("Not authenticated");

    let query = supabase
      .from("utility_readings")
      .select("*")
      .eq("user_id", userId)
      .gte("reading_date", startDate)
      .lte("reading_date", endDate);

    if (utilityType) {
      query = query.eq("utility_type", utilityType);
    }

    const { data, error } = await query
      .order("reading_date", { ascending: false })
      .order("utility_type", { ascending: true });

    if (error) throw error;
    return data as UtilityReadingRow[];
  }

  /**
   * Update a utility reading
   */
  static async updateReading(
    id: string,
    updates: Partial<UtilityReadingInsert>
  ): Promise<UtilityReadingRow> {
    const userRes = await supabase.auth.getUser();
    const userId = userRes.data.user?.id;
    if (!userId) throw new Error("Not authenticated");

    // Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from("utility_readings")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (fetchError) throw fetchError;
    if (!existing) throw new Error("Reading not found");

    const { data, error } = await supabase
      .from("utility_readings")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return data as UtilityReadingRow;
  }

  /**
   * Delete all utility readings for the current user (testing only)
   */
  static async clearAllReadings(): Promise<void> {
    const userRes = await supabase.auth.getUser();
    const userId = userRes.data.user?.id;
    if (!userId) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("utility_readings")
      .delete()
      .eq("user_id", userId);

    if (error) throw error;
  }

  /**
   * Delete a utility reading
   */
  static async deleteReading(id: string): Promise<void> {
    const userRes = await supabase.auth.getUser();
    const userId = userRes.data.user?.id;
    if (!userId) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("utility_readings")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
  }

  /**
   * Calculate trends by comparing current period to previous period
   */
  static calculateTrends(readings: UtilityReadingRow[]): TrendData[] {
    const trends: TrendData[] = [];
    const utilityTypes: UtilityType[] = ['electricity', 'gas', 'water', 'internet'];

    for (const utilityType of utilityTypes) {
      const utilityReadings = readings.filter(r => r.utility_type === utilityType);

      if (utilityReadings.length === 0) continue;

      // Sort by date
      const sorted = [...utilityReadings].sort(
        (a, b) => new Date(b.reading_date).getTime() - new Date(a.reading_date).getTime()
      );

      // Get latest reading as current
      const current = sorted[0];
      const currentUsage = current.usage_amount;
      const currentCost = current.cost || 0;

      // Get previous reading if available
      let previousUsage = 0;
      let previousCost = 0;
      if (sorted.length > 1) {
        const previous = sorted[1];
        previousUsage = previous.usage_amount;
        previousCost = previous.cost || 0;
      }

      // Calculate percentage changes
      const usageTrendPercent = previousUsage > 0
        ? ((currentUsage - previousUsage) / previousUsage) * 100
        : 0;

      const costTrendPercent = previousCost > 0
        ? ((currentCost - previousCost) / previousCost) * 100
        : 0;

      // Determine trend direction (threshold: ±2%)
      let trendDirection: 'up' | 'down' | 'stable';
      const avgPercent = (usageTrendPercent + costTrendPercent) / 2;
      if (avgPercent > 2) {
        trendDirection = 'up';
      } else if (avgPercent < -2) {
        trendDirection = 'down';
      } else {
        trendDirection = 'stable';
      }

      trends.push({
        utilityType,
        currentUsage,
        previousUsage,
        currentCost,
        previousCost,
        usageTrendPercent,
        costTrendPercent,
        trendDirection,
      });
    }

    return trends;
  }

  /**
   * Get cost summary for a period
   */
  static async getCostSummary(period: Period): Promise<CostSummary> {
    const userRes = await supabase.auth.getUser();
    const userId = userRes.data.user?.id;
    if (!userId) throw new Error("Not authenticated");

    // Get current period readings
    const currentReadings = await this.getReadingsByPeriod(period);

    // Get previous period readings for comparison
    const { startDate, endDate } = this.calculateDateRange(period);
    const previousRange = this.calculatePreviousDateRange(startDate, endDate);
    const previousReadings = await this.getReadingsByDateRange(
      previousRange.startDate,
      previousRange.endDate
    );

    // Calculate totals
    const totalCost = currentReadings.reduce((sum, r) => sum + (r.cost || 0), 0);
    const previousPeriodCost = previousReadings.reduce((sum, r) => sum + (r.cost || 0), 0);

    // Calculate by utility
    const costByUtility: Record<UtilityType, number> = {
      electricity: 0,
      gas: 0,
      water: 0,
      internet: 0,
    };

    const usageByUtility: Record<UtilityType, number> = {
      electricity: 0,
      gas: 0,
      water: 0,
      internet: 0,
    };

    currentReadings.forEach(reading => {
      costByUtility[reading.utility_type] += reading.cost || 0;
      usageByUtility[reading.utility_type] += reading.usage_amount;
    });

    // Calculate percentage change
    const percentageChange = previousPeriodCost > 0
      ? ((totalCost - previousPeriodCost) / previousPeriodCost) * 100
      : 0;

    return {
      totalCost,
      costByUtility,
      usageByUtility,
      percentageChange,
      previousPeriodCost,
    };
  }

  /**
   * Calculate carbon footprint from readings
   */
  static calculateCarbonFootprint(readings: UtilityReadingRow[]): number {
    let totalCarbon = 0;

    for (const reading of readings) {
      const factor = CARBON_FACTORS[reading.utility_type];

      // Convert usage to appropriate unit if needed
      let usage = reading.usage_amount;

      // Handle unit conversions
      if (reading.utility_type === 'gas' && reading.unit === 'CCF') {
        // 1 CCF (hundred cubic feet) ≈ 1.037 therms
        usage = usage * 1.037;
      } else if (reading.utility_type === 'water' && reading.unit === 'cubic feet') {
        // 1 cubic foot ≈ 7.48 gallons
        usage = usage * 7.48;
      } else if (reading.utility_type === 'internet' && reading.unit === 'TB') {
        // 1 TB = 1024 GB
        usage = usage * 1024;
      }

      totalCarbon += usage * factor;
    }

    return totalCarbon;
  }

  /**
   * Calculate efficiency score (0-100) based on historical averages
   */
  static async calculateEfficiencyScore(
    currentReadings: UtilityReadingRow[],
    historicalReadings: UtilityReadingRow[]
  ): Promise<number> {
    if (historicalReadings.length === 0) {
      return 50; // Neutral score if no historical data
    }

    // Calculate average usage for current period
    const currentAvg = currentReadings.reduce((sum, r) => sum + r.usage_amount, 0) /
      Math.max(currentReadings.length, 1);

    // Calculate historical average (last 12 months)
    const historicalAvg = historicalReadings.reduce((sum, r) => sum + r.usage_amount, 0) /
      historicalReadings.length;

    if (historicalAvg === 0) return 50;

    // Score: 100 if 50% below average, 50 if equal, 0 if 50% above
    const score = Math.max(
      0,
      Math.min(100, 50 + ((historicalAvg - currentAvg) / historicalAvg) * 100)
    );

    return Math.round(score);
  }

  /**
   * Get sustainability metrics for a period
   */
  static async getSustainabilityMetrics(period: Period): Promise<SustainabilityMetrics> {
    const userRes = await supabase.auth.getUser();
    const userId = userRes.data.user?.id;
    if (!userId) throw new Error("Not authenticated");

    // Get current period readings
    const currentReadings = await this.getReadingsByPeriod(period);

    // Get previous period for comparison
    const { startDate, endDate } = this.calculateDateRange(period);
    const previousRange = this.calculatePreviousDateRange(startDate, endDate);
    const previousReadings = await this.getReadingsByDateRange(
      previousRange.startDate,
      previousRange.endDate
    );

    // Get historical readings (last 12 months) for efficiency score
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const historicalReadings = await this.getReadingsByDateRange(
      oneYearAgo.toISOString().split('T')[0],
      new Date().toISOString().split('T')[0]
    );

    // Calculate carbon footprint
    const carbonFootprint = this.calculateCarbonFootprint(currentReadings);
    const previousCarbon = this.calculateCarbonFootprint(previousReadings);

    // Calculate carbon reduction percentage
    const carbonReduction = previousCarbon > 0
      ? ((previousCarbon - carbonFootprint) / previousCarbon) * 100
      : 0;

    // Calculate renewable percentage (placeholder for future solar integration)
    const renewablePercent = 0;

    // Calculate efficiency score
    const efficiencyScore = await this.calculateEfficiencyScore(
      currentReadings,
      historicalReadings
    );

    return {
      carbonFootprint,
      carbonReduction,
      renewablePercent,
      efficiencyScore,
    };
  }

  /**
   * Create timeline entry from high-cost utility reading
   */
  static async createTimelineFromReading(readingId: string): Promise<void> {
    const userRes = await supabase.auth.getUser();
    const userId = userRes.data.user?.id;
    if (!userId) throw new Error("Not authenticated");

    // Get the reading
    const { data: reading, error: readingError } = await supabase
      .from("utility_readings")
      .select("*")
      .eq("id", readingId)
      .eq("user_id", userId)
      .single();

    if (readingError) throw readingError;

    // Create timeline entry
    const utilityLabel = reading.utility_type.charAt(0).toUpperCase() +
      reading.utility_type.slice(1);

    const { error: timelineError } = await supabase
      .from("timeline_events")
      .insert({
        user_id: userId,
        title: `High ${utilityLabel} Usage`,
        description: `${reading.usage_amount} ${reading.unit} - $${reading.cost?.toFixed(2)}`,
        date: reading.reading_date,
        category: 'utilities',
        cost: reading.cost,
        metadata: {
          auto_created: true,
          source: 'utility_reading',
          reading_id: readingId,
          utility_type: reading.utility_type,
        },
      });

    if (timelineError) throw timelineError;
  }

  /**
   * Calculate date range for a given period
   */
  private static calculateDateRange(period: Period): { startDate: string; endDate: string } {
    const now = new Date();
    const endDate = now.toISOString().split('T')[0];
    let startDate: string;

    switch (period) {
      case 'month':
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        startDate = monthAgo.toISOString().split('T')[0];
        break;
      case 'quarter':
        const quarterAgo = new Date(now);
        quarterAgo.setMonth(quarterAgo.getMonth() - 3);
        startDate = quarterAgo.toISOString().split('T')[0];
        break;
      case 'year':
        const yearAgo = new Date(now);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        startDate = yearAgo.toISOString().split('T')[0];
        break;
    }

    return { startDate, endDate };
  }

  /**
   * Calculate previous date range for comparison
   */
  private static calculatePreviousDateRange(
    currentStart: string,
    currentEnd: string
  ): { startDate: string; endDate: string } {
    const start = new Date(currentStart);
    const end = new Date(currentEnd);

    const diffTime = end.getTime() - start.getTime();

    const previousEnd = new Date(start);
    previousEnd.setDate(previousEnd.getDate() - 1);

    const previousStart = new Date(previousEnd);
    previousStart.setTime(previousStart.getTime() - diffTime);

    return {
      startDate: previousStart.toISOString().split('T')[0],
      endDate: previousEnd.toISOString().split('T')[0],
    };
  }
}
