import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { EnergyService } from '../services/energyService';
import { checkForAnomalies } from '../services/anomalyDetectionService';
import { generateTips } from '../services/efficiencyTipsService';
import { getPendingReviews } from '@/integrations/utility/utilityService';
import type {
  UtilityReadingRow,
  UtilityReadingInsert,
  Period,
  TrendData,
  SustainabilityMetrics,
  CostSummary,
  EfficiencyTip,
} from '../types';

export const useUtilityReadings = () => {
  const [readings, setReadings] = useState<UtilityReadingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');
  const { toast } = useToast();

  // Fetch readings for current period
  const fetchReadings = async () => {
    try {
      setLoading(true);
      const data = await EnergyService.getReadingsByPeriod(selectedPeriod);
      setReadings(data);
    } catch (error) {
      console.error('Error fetching utility readings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch utility readings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new reading
  const addReading = async (reading: Omit<UtilityReadingInsert, 'user_id'>): Promise<boolean> => {
    try {
      const newReading = await EnergyService.createReading(reading);
      setReadings(prev => [newReading, ...prev]);
      toast({
        title: "Success",
        description: "Utility reading added successfully",
      });
      return true;
    } catch (error) {
      console.error('Error adding reading:', error);
      toast({
        title: "Error",
        description: "Failed to add utility reading",
        variant: "destructive",
      });
      return false;
    }
  };

  // Update existing reading
  const updateReading = async (
    id: string,
    updates: Partial<UtilityReadingInsert>
  ): Promise<boolean> => {
    try {
      const updated = await EnergyService.updateReading(id, updates);
      setReadings(prev =>
        prev.map(reading => reading.id === id ? updated : reading)
      );
      toast({
        title: "Success",
        description: "Utility reading updated successfully",
      });
      return true;
    } catch (error) {
      console.error('Error updating reading:', error);
      toast({
        title: "Error",
        description: "Failed to update utility reading",
        variant: "destructive",
      });
      return false;
    }
  };

  // Delete reading
  const deleteReading = async (id: string): Promise<boolean> => {
    try {
      await EnergyService.deleteReading(id);
      setReadings(prev => prev.filter(reading => reading.id !== id));
      toast({
        title: "Success",
        description: "Utility reading deleted successfully",
      });
      return true;
    } catch (error) {
      console.error('Error deleting reading:', error);
      toast({
        title: "Error",
        description: "Failed to delete utility reading",
        variant: "destructive",
      });
      return false;
    }
  };

  // Calculated metrics (memoized for performance)
  const metrics = useMemo(() => {
    if (readings.length === 0) {
      return {
        trends: [] as TrendData[],
        carbonFootprint: 0,
        totalCost: 0,
        averageUsage: 0,
      };
    }

    const trends = EnergyService.calculateTrends(readings);
    const carbonFootprint = EnergyService.calculateCarbonFootprint(readings);
    const totalCost = readings.reduce((sum, r) => sum + (r.cost || 0), 0);
    const averageUsage = readings.reduce((sum, r) => sum + r.usage_amount, 0) / readings.length;

    return {
      trends,
      carbonFootprint,
      totalCost,
      averageUsage,
    };
  }, [readings]);

  // Sustainability metrics (separate from basic metrics for async loading)
  const [sustainabilityMetrics, setSustainabilityMetrics] = useState<SustainabilityMetrics | null>(null);
  const [costSummary, setCostSummary] = useState<CostSummary | null>(null);
  const [pendingReviewCount, setPendingReviewCount] = useState(0);
  const [dynamicTips, setDynamicTips] = useState<EfficiencyTip[]>([]);

  // Load sustainability metrics when period changes
  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const [sustainability, costs] = await Promise.all([
          EnergyService.getSustainabilityMetrics(selectedPeriod),
          EnergyService.getCostSummary(selectedPeriod),
        ]);
        setSustainabilityMetrics(sustainability);
        setCostSummary(costs);
      } catch (error) {
        console.error('Error loading sustainability metrics:', error);
      }
    };

    if (readings.length > 0) {
      loadMetrics();
    }
  }, [selectedPeriod, readings.length]);

  // Run anomaly detection and generate dynamic tips after readings load
  useEffect(() => {
    if (readings.length > 0 && metrics.trends.length > 0) {
      // Anomaly detection (fire-and-forget)
      checkForAnomalies(readings).catch((err) =>
        console.error('Anomaly detection error:', err)
      );

      // Generate dynamic tips
      const tips = generateTips(readings, metrics.trends);
      setDynamicTips(tips);
    }
  }, [readings, metrics.trends]);

  // Load pending review count
  useEffect(() => {
    const loadPendingReviews = async () => {
      try {
        const pending = await getPendingReviews();
        setPendingReviewCount(pending.length);
      } catch {
        // Silently fail - pending reviews are not critical
      }
    };
    loadPendingReviews();
  }, [readings.length]);

  // Fetch readings when period changes
  useEffect(() => {
    fetchReadings();
  }, [selectedPeriod]);

  return {
    readings,
    loading,
    selectedPeriod,
    setSelectedPeriod,
    addReading,
    updateReading,
    deleteReading,
    refetch: fetchReadings,
    metrics,
    sustainabilityMetrics,
    costSummary,
    pendingReviewCount,
    dynamicTips,
  };
};
