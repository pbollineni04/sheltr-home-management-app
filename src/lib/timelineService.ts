import { supabase } from '@/integrations/supabase/client';

type TimelineCategory = 'maintenance' | 'renovation' | 'purchase' | 'inspection';

interface TimelineEventInput {
  title: string;
  description?: string;
  date: string;
  category: TimelineCategory;
  room?: string | null;
  cost?: number | null;
  task_id?: string | null;
  metadata?: Record<string, unknown>;
}

async function getUserId(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;
  if (!userId) throw new Error('Not authenticated');
  return userId;
}

async function createTimelineEvent(
  userId: string,
  input: TimelineEventInput,
  source: string,
  sourceId: string
): Promise<void> {
  const { error } = await supabase.from('timeline_events').insert({
    user_id: userId,
    title: input.title,
    description: input.description || null,
    date: input.date,
    category: input.category,
    room: input.room || null,
    cost: input.cost || null,
    task_id: input.task_id || null,
    metadata: {
      auto_created: true,
      source,
      source_id: sourceId,
      ...input.metadata,
    },
  });

  if (error) {
    console.error(`Error creating timeline event from ${source}:`, error);
    throw error;
  }
}

export class TimelineService {
  /**
   * Create timeline entry from a significant expense ($50+).
   * Skips if the expense was auto-logged from a service (services create their own timeline events).
   */
  static async createFromExpense(expense: {
    id: string;
    description?: string | null;
    vendor?: string | null;
    category?: string | null;
    date: string;
    room?: string | null;
    amount: number;
    metadata?: Record<string, unknown> | null;
  }): Promise<void> {
    const alreadyFromService = expense.metadata?.source === 'service';
    if (alreadyFromService) return;

    const userId = await getUserId();

    const descParts = [
      expense.vendor ? `From ${expense.vendor}` : '',
      expense.category || '',
    ].filter(Boolean);

    await createTimelineEvent(
      userId,
      {
        title: expense.description || 'Purchase',
        description: descParts.join(' - ') || undefined,
        date: expense.date,
        category: expense.category === 'renovation' ? 'renovation' : 'purchase',
        room: expense.room,
        cost: expense.amount,
      },
      'expense',
      expense.id
    );

    // Mark expense as having created a timeline entry
    await supabase
      .from('expenses')
      .update({
        metadata: {
          ...(expense.metadata || {}),
          timeline_created: true,
        },
      })
      .eq('id', expense.id);
  }

  /**
   * Create timeline entry from a completed task.
   */
  static async createFromTask(task: {
    id: string;
    title: string;
    description?: string;
    list_type: string;
    room?: string;
  }): Promise<void> {
    const userId = await getUserId();

    const categoryMap: Record<string, TimelineCategory> = {
      maintenance: 'maintenance',
      projects: 'renovation',
      shopping: 'purchase',
    };

    await createTimelineEvent(
      userId,
      {
        title: task.title,
        description: task.description,
        date: new Date().toISOString(),
        category: categoryMap[task.list_type] || 'maintenance',
        room: task.room,
        task_id: task.id,
      },
      'task',
      task.id
    );
  }

  /**
   * Create timeline entry for important document uploads.
   * Only creates entries for document categories that represent significant home events.
   */
  static async createFromDocument(doc: {
    id: string;
    name: string;
    category_enum?: string | null;
    description?: string | null;
    expiration_date?: string | null;
  }): Promise<void> {
    const timelineCategories = new Set([
      'warranty', 'insurance', 'property', 'legal', 'financial',
    ]);

    if (!doc.category_enum || !timelineCategories.has(doc.category_enum)) return;

    const userId = await getUserId();

    const categoryMap: Record<string, TimelineCategory> = {
      warranty: 'purchase',
      insurance: 'inspection',
      property: 'inspection',
      legal: 'inspection',
      financial: 'inspection',
    };

    await createTimelineEvent(
      userId,
      {
        title: `${doc.name} uploaded`,
        description: doc.description || `${doc.category_enum} document added to vault`,
        date: new Date().toISOString(),
        category: categoryMap[doc.category_enum] || 'inspection',
      },
      'document',
      doc.id
    );
  }

  /**
   * Create timeline entry from a detected energy usage anomaly.
   */
  static async createFromAnomaly(
    userId: string,
    anomaly: {
      utilityType: string;
      currentUsage: number;
      averageUsage: number;
      percentIncrease: number;
      readingDate: string;
    }
  ): Promise<void> {
    const label = anomaly.utilityType.charAt(0).toUpperCase() + anomaly.utilityType.slice(1);

    await createTimelineEvent(
      userId,
      {
        title: `${label} Usage Spike`,
        description: `${label} usage ${anomaly.percentIncrease.toFixed(0)}% above 3-month average`,
        date: anomaly.readingDate,
        category: 'maintenance',
        metadata: {
          utility_type: anomaly.utilityType,
          percent_increase: anomaly.percentIncrease,
        },
      },
      'energy_anomaly',
      `${anomaly.utilityType}_${anomaly.readingDate}`
    );
  }
}
