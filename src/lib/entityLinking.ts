import { supabase } from '@/integrations/supabase/client';

export type EntityType = 'expense' | 'task' | 'document' | 'service' | 'timeline_event';

export interface LinkedEntity {
  type: EntityType;
  id: string;
  label: string;
  confidence: 'high' | 'medium' | 'low';
  method: 'rule' | 'ai' | 'manual';
}

const TABLE_MAP: Record<EntityType, string> = {
  expense: 'expenses',
  task: 'tasks',
  document: 'documents',
  service: 'services',
  timeline_event: 'timeline_events',
};

async function getUserId(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;
  if (!userId) throw new Error('Not authenticated');
  return userId;
}

async function getEntityMetadata(
  table: string,
  id: string,
  userId: string
): Promise<Record<string, unknown>> {
  const { data } = await supabase
    .from(table)
    .select('metadata')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  return (data?.metadata as Record<string, unknown>) || {};
}

async function updateEntityMetadata(
  table: string,
  id: string,
  userId: string,
  metadata: Record<string, unknown>
): Promise<void> {
  const { error } = await supabase
    .from(table)
    .update({ metadata })
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

/**
 * Create a bidirectional link between two entities.
 */
export async function linkEntities(
  typeA: EntityType,
  idA: string,
  typeB: EntityType,
  idB: string,
  labelA: string,
  labelB: string,
  confidence: LinkedEntity['confidence'] = 'high',
  method: LinkedEntity['method'] = 'manual'
): Promise<void> {
  const userId = await getUserId();

  const tableA = TABLE_MAP[typeA];
  const tableB = TABLE_MAP[typeB];

  // Update entity A with link to B
  const metaA = await getEntityMetadata(tableA, idA, userId);
  const linksA: LinkedEntity[] = (metaA.linked_entities as LinkedEntity[]) || [];

  if (!linksA.some((l) => l.type === typeB && l.id === idB)) {
    linksA.push({ type: typeB, id: idB, label: labelB, confidence, method });
    await updateEntityMetadata(tableA, idA, userId, { ...metaA, linked_entities: linksA });
  }

  // Update entity B with link to A
  const metaB = await getEntityMetadata(tableB, idB, userId);
  const linksB: LinkedEntity[] = (metaB.linked_entities as LinkedEntity[]) || [];

  if (!linksB.some((l) => l.type === typeA && l.id === idA)) {
    linksB.push({ type: typeA, id: idA, label: labelA, confidence, method });
    await updateEntityMetadata(tableB, idB, userId, { ...metaB, linked_entities: linksB });
  }
}

/**
 * Remove a bidirectional link between two entities.
 */
export async function unlinkEntities(
  typeA: EntityType,
  idA: string,
  typeB: EntityType,
  idB: string
): Promise<void> {
  const userId = await getUserId();

  const tableA = TABLE_MAP[typeA];
  const tableB = TABLE_MAP[typeB];

  const metaA = await getEntityMetadata(tableA, idA, userId);
  const linksA: LinkedEntity[] = (metaA.linked_entities as LinkedEntity[]) || [];
  await updateEntityMetadata(tableA, idA, userId, {
    ...metaA,
    linked_entities: linksA.filter((l) => !(l.type === typeB && l.id === idB)),
  });

  const metaB = await getEntityMetadata(tableB, idB, userId);
  const linksB: LinkedEntity[] = (metaB.linked_entities as LinkedEntity[]) || [];
  await updateEntityMetadata(tableB, idB, userId, {
    ...metaB,
    linked_entities: linksB.filter((l) => !(l.type === typeA && l.id === idA)),
  });
}

/**
 * Get all linked entities for a given entity.
 */
export function getLinkedEntities(
  metadata: Record<string, unknown> | null | undefined
): LinkedEntity[] {
  if (!metadata) return [];
  return (metadata.linked_entities as LinkedEntity[]) || [];
}
