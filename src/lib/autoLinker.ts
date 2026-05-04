import { supabase } from '@/integrations/supabase/client';
import { linkEntities, type EntityType } from './entityLinking';

// Scoring weights
const SCORE_SAME_DAY = 30;
const SCORE_WITHIN_3_DAYS = 15;
const SCORE_WITHIN_7_DAYS = 5;
const SCORE_AMOUNT_MATCH = 40;
const SCORE_KEYWORD_OVERLAP = 25;
const SCORE_CATEGORY_MATCH = 15;
const SCORE_ROOM_MATCH = 20;

// Thresholds
const AUTO_LINK_THRESHOLD = 70;
const SUGGEST_THRESHOLD = 40;

interface Candidate {
  type: EntityType;
  id: string;
  label: string;
  date: string;
  amount?: number | null;
  keywords: string[];
  category?: string | null;
  room?: string | null;
}

interface MatchResult {
  candidate: Candidate;
  score: number;
  confidence: 'high' | 'medium';
}

function extractKeywords(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA).getTime();
  const b = new Date(dateB).getTime();
  return Math.abs(Math.floor((a - b) / (1000 * 60 * 60 * 24)));
}

function scoreTemporalProximity(daysApart: number): number {
  if (daysApart === 0) return SCORE_SAME_DAY;
  if (daysApart <= 3) return SCORE_WITHIN_3_DAYS;
  if (daysApart <= 7) return SCORE_WITHIN_7_DAYS;
  return 0;
}

function scoreAmountMatch(amountA: number | null | undefined, amountB: number | null | undefined): number {
  if (amountA == null || amountB == null || amountA === 0 || amountB === 0) return 0;
  const diff = Math.abs(amountA - amountB) / Math.max(amountA, amountB);
  return diff <= 0.05 ? SCORE_AMOUNT_MATCH : 0;
}

function scoreKeywordOverlap(keywordsA: string[], keywordsB: string[]): number {
  if (keywordsA.length === 0 || keywordsB.length === 0) return 0;
  const setB = new Set(keywordsB);
  const overlap = keywordsA.filter((w) => setB.has(w)).length;
  const overlapRatio = overlap / Math.min(keywordsA.length, keywordsB.length);
  return overlapRatio >= 0.3 ? SCORE_KEYWORD_OVERLAP : 0;
}

function scoreCategoryMatch(catA: string | null | undefined, catB: string | null | undefined): number {
  if (!catA || !catB) return 0;
  const CATEGORY_ALIASES: Record<string, string> = {
    maintenance: 'maintenance',
    repair: 'maintenance',
    renovation: 'renovation',
    improvement: 'renovation',
    projects: 'renovation',
    purchase: 'purchase',
    shopping: 'purchase',
    warranty: 'purchase',
    insurance: 'insurance',
    inspection: 'inspection',
    property: 'property',
    financial: 'financial',
  };
  const normA = CATEGORY_ALIASES[catA.toLowerCase()] || catA.toLowerCase();
  const normB = CATEGORY_ALIASES[catB.toLowerCase()] || catB.toLowerCase();
  return normA === normB ? SCORE_CATEGORY_MATCH : 0;
}

function scoreRoomMatch(roomA: string | null | undefined, roomB: string | null | undefined): number {
  if (!roomA || !roomB) return 0;
  return roomA.toLowerCase() === roomB.toLowerCase() ? SCORE_ROOM_MATCH : 0;
}

function scoreCandidate(source: Candidate, candidate: Candidate): number {
  let score = 0;
  score += scoreTemporalProximity(daysBetween(source.date, candidate.date));
  score += scoreAmountMatch(source.amount, candidate.amount);
  score += scoreKeywordOverlap(source.keywords, candidate.keywords);
  score += scoreCategoryMatch(source.category, candidate.category);
  score += scoreRoomMatch(source.room, candidate.room);
  return score;
}

async function fetchCandidates(
  userId: string,
  sourceType: EntityType,
  sourceId: string,
  since: string
): Promise<Candidate[]> {
  const candidates: Candidate[] = [];

  // Fetch recent expenses
  if (sourceType !== 'expense') {
    const { data } = await supabase
      .from('expenses')
      .select('id, description, amount, category, date, room, vendor')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .gte('date', since)
      .order('date', { ascending: false })
      .limit(20);

    for (const e of data ?? []) {
      candidates.push({
        type: 'expense',
        id: e.id,
        label: `${e.description || 'Expense'} - $${Number(e.amount).toFixed(0)}`,
        date: e.date,
        amount: Number(e.amount),
        keywords: extractKeywords(`${e.description} ${e.vendor} ${e.category}`),
        category: e.category,
        room: e.room,
      });
    }
  }

  // Fetch recent tasks
  if (sourceType !== 'task') {
    const { data } = await supabase
      .from('tasks')
      .select('id, title, description, list_type, room, created_at')
      .eq('user_id', userId)
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(20);

    for (const t of data ?? []) {
      candidates.push({
        type: 'task',
        id: t.id,
        label: t.title,
        date: t.created_at,
        keywords: extractKeywords(`${t.title} ${t.description} ${t.list_type}`),
        category: t.list_type,
        room: t.room,
      });
    }
  }

  // Fetch recent documents
  if (sourceType !== 'document') {
    const { data } = await supabase
      .from('documents')
      .select('id, name, description, category_enum, created_at')
      .eq('user_id', userId)
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(20);

    for (const d of data ?? []) {
      candidates.push({
        type: 'document',
        id: d.id,
        label: d.name,
        date: d.created_at,
        keywords: extractKeywords(`${d.name} ${d.description}`),
        category: d.category_enum,
      });
    }
  }

  // Filter out self
  return candidates.filter((c) => !(c.type === sourceType && c.id === sourceId));
}

export interface AutoLinkResult {
  autoLinked: MatchResult[];
  suggestions: MatchResult[];
}

/**
 * Find matches for a newly created entity.
 * Returns auto-linked items (high confidence) and suggestions (medium confidence).
 */
export async function findMatches(
  sourceType: EntityType,
  sourceId: string,
  source: {
    label: string;
    date: string;
    amount?: number | null;
    title?: string | null;
    description?: string | null;
    category?: string | null;
    room?: string | null;
  }
): Promise<AutoLinkResult> {
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData.user?.id;
  if (!userId) return { autoLinked: [], suggestions: [] };

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const since = thirtyDaysAgo.toISOString();

  const sourceCandidate: Candidate = {
    type: sourceType,
    id: sourceId,
    label: source.label,
    date: source.date,
    amount: source.amount,
    keywords: extractKeywords(`${source.title} ${source.description} ${source.category}`),
    category: source.category,
    room: source.room,
  };

  const candidates = await fetchCandidates(userId, sourceType, sourceId, since);

  const autoLinked: MatchResult[] = [];
  const suggestions: MatchResult[] = [];

  for (const candidate of candidates) {
    const score = scoreCandidate(sourceCandidate, candidate);

    if (score >= AUTO_LINK_THRESHOLD) {
      autoLinked.push({ candidate, score, confidence: 'high' });
    } else if (score >= SUGGEST_THRESHOLD) {
      suggestions.push({ candidate, score, confidence: 'medium' });
    }
  }

  // Sort by score descending, limit results
  autoLinked.sort((a, b) => b.score - a.score);
  suggestions.sort((a, b) => b.score - a.score);

  // Auto-link high confidence matches (limit to top 3)
  for (const match of autoLinked.slice(0, 3)) {
    try {
      await linkEntities(
        sourceType,
        sourceId,
        match.candidate.type,
        match.candidate.id,
        source.label,
        match.candidate.label,
        'high',
        'rule'
      );
    } catch (err) {
      console.error('Auto-link failed:', err);
    }
  }

  return {
    autoLinked: autoLinked.slice(0, 3),
    suggestions: suggestions.slice(0, 3),
  };
}

/**
 * Confirm a suggested link (called after user approves or AI confirms).
 */
export async function confirmSuggestion(
  sourceType: EntityType,
  sourceId: string,
  sourceLabel: string,
  targetType: EntityType,
  targetId: string,
  targetLabel: string,
  method: 'ai' | 'manual' = 'manual'
): Promise<void> {
  await linkEntities(
    sourceType,
    sourceId,
    targetType,
    targetId,
    sourceLabel,
    targetLabel,
    'medium',
    method
  );
}
