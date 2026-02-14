import { supabase } from '@/integrations/supabase/client';
import type { UtilityReadingRow, UtilityType, AnomalyAlert } from '../types';

const SPIKE_THRESHOLD = 0.20; // 20% above rolling average
const ROLLING_MONTHS = 3;

/**
 * Check for usage anomalies and create alerts for significant spikes
 */
export async function checkForAnomalies(
  currentReadings: UtilityReadingRow[]
): Promise<AnomalyAlert[]> {
  if (currentReadings.length === 0) return [];

  const userRes = await supabase.auth.getUser();
  const userId = userRes.data.user?.id;
  if (!userId) return [];

  const anomalies: AnomalyAlert[] = [];

  // Get 3-month historical data for rolling average
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - ROLLING_MONTHS);

  const { data: historicalReadings } = await supabase
    .from('utility_readings')
    .select('*')
    .eq('user_id', userId)
    .gte('reading_date', threeMonthsAgo.toISOString().split('T')[0])
    .order('reading_date', { ascending: false });

  if (!historicalReadings || historicalReadings.length === 0) return [];

  const utilityTypes: UtilityType[] = ['electricity', 'gas', 'water', 'internet'];

  for (const utilityType of utilityTypes) {
    const historical = (historicalReadings as UtilityReadingRow[])
      .filter(r => r.utility_type === utilityType);
    const current = currentReadings.filter(r => r.utility_type === utilityType);

    if (historical.length < 2 || current.length === 0) continue;

    // Calculate rolling average (excluding current readings to avoid self-comparison)
    const currentIds = new Set(current.map(r => r.id));
    const pastOnly = historical.filter(r => !currentIds.has(r.id));

    if (pastOnly.length === 0) continue;

    const avgUsage = pastOnly.reduce((sum, r) => sum + r.usage_amount, 0) / pastOnly.length;

    // Check each current reading for spikes
    for (const reading of current) {
      if (avgUsage <= 0) continue;

      const percentIncrease = (reading.usage_amount - avgUsage) / avgUsage;

      if (percentIncrease > SPIKE_THRESHOLD) {
        anomalies.push({
          utilityType,
          currentUsage: reading.usage_amount,
          averageUsage: avgUsage,
          percentIncrease: percentIncrease * 100,
          readingDate: reading.reading_date,
        });
      }
    }
  }

  // Create alerts for detected anomalies
  for (const anomaly of anomalies) {
    await createAnomalyAlert(userId, anomaly);
  }

  return anomalies;
}

async function createAnomalyAlert(userId: string, anomaly: AnomalyAlert): Promise<void> {
  const label = anomaly.utilityType.charAt(0).toUpperCase() + anomaly.utilityType.slice(1);

  // Check for existing unresolved alert for same utility type and date
  const { data: existing } = await supabase
    .from('alerts')
    .select('id')
    .eq('user_id', userId)
    .eq('alert_type', 'utility_anomaly')
    .eq('resolved', false)
    .contains('metadata', { utility_type: anomaly.utilityType })
    .limit(1);

  if (existing && existing.length > 0) return; // Already alerted

  const { error } = await supabase
    .from('alerts')
    .insert({
      user_id: userId,
      alert_type: 'utility_anomaly',
      alert_type_enum: 'utility_anomaly',
      title: `${label} Usage Spike Detected`,
      description: `${label} usage is ${anomaly.percentIncrease.toFixed(0)}% above your 3-month average (${anomaly.currentUsage.toLocaleString()} vs avg ${anomaly.averageUsage.toFixed(0)}).`,
      severity: anomaly.percentIncrease > 50 ? 'high' : 'medium',
      metadata: {
        utility_type: anomaly.utilityType,
        current_usage: anomaly.currentUsage,
        average_usage: anomaly.averageUsage,
        percent_increase: anomaly.percentIncrease,
        reading_date: anomaly.readingDate,
      },
    });

  if (error) {
    console.error('Error creating anomaly alert:', error);
  }
}
