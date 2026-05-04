import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// ---- Types ----

export type RecentExpense = {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  metadata?: Record<string, unknown> | null;
};

export type UrgentTask = {
  id: string;
  title: string;
  priority: string;
  due_date: string | null;
  completed: boolean;
  metadata?: Record<string, unknown> | null;
};

export type UpcomingService = {
  id: string;
  title: string;
  scheduled_date: string;
  scheduled_time?: string | null;
  category: string;
  provider?: { name: string } | null;
};

export type UpcomingRecurrence = {
  id: string;
  title: string;
  next_due_date: string;
  frequency: string;
  category: string;
  estimated_cost?: number | null;
};

export type UtilitySummary = {
  utility_type: string;
  latest_cost: number;
  previous_cost: number | null;
  change_pct: number | null;
};

export type ExpiringDocument = {
  id: string;
  name: string;
  expiration_date: string;
  folder?: string | null;
};

export type RecentActivity = {
  id: string;
  title: string;
  description?: string | null;
  date: string;
  category: string;
  cost?: number | null;
  source: string;
  source_id?: string | null;
  created_at: string;
};

export type DashboardMetrics = {
  // Counts
  pending_tasks: number;
  overdue_tasks: number;
  completed_tasks: number;
  total_documents: number;
  monthly_expenses: number;
  last_activity: string | null;

  // Detailed data for dashboard sections
  recent_expenses: RecentExpense[];
  urgent_tasks: UrgentTask[];
  upcoming_services: UpcomingService[];
  upcoming_recurrences: UpcomingRecurrence[];
  utility_summary: UtilitySummary[];
  expiring_documents: ExpiringDocument[];

  // Cross-feature integration
  recent_activity: RecentActivity[];
  unresolved_anomalies: number;
  expenses_needing_review: number;

  // Trend & HomeWealth
  expense_trend_pct: number | null;
  last_month_expenses: number;
  home_value: number | null;
  home_equity: number | null;
};

export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let mounted = true;

    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);

        const userRes = await supabase.auth.getUser();
        const userId = userRes.data.user?.id;
        if (!userId) throw new Error("User not authenticated");

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        const today = now.toISOString().split("T")[0];
        const thirtyDaysFromNow = new Date(now);
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        const thirtyDaysStr = thirtyDaysFromNow.toISOString().split("T")[0];

        // Fire all queries in parallel for maximum speed
        const [
          tasksRes,
          docsRes,
          expensesThisMonthRes,
          expensesLastMonthRes,
          recentExpensesRes,
          upcomingServicesRes,
          upcomingRecurrencesRes,
          utilityReadingsRes,
          expiringDocsRes,
          propertyRes,
          recentActivityRes,
          anomalyAlertsRes,
          expensesReviewRes,
        ] = await Promise.all([
          // Tasks (all)
          supabase
            .from("tasks")
            .select("id, title, completed, due_date, priority, updated_at, metadata")
            .eq("user_id", userId),

          // Documents (count)
          supabase
            .from("documents")
            .select("id")
            .eq("user_id", userId),

          // Expenses this month (for total + trend)
          supabase
            .from("expenses")
            .select("amount, date, created_at")
            .eq("user_id", userId)
            .gte("date", startOfMonth.toISOString())
            .lte("date", now.toISOString()),

          // Expenses last month (for trend)
          supabase
            .from("expenses")
            .select("amount")
            .eq("user_id", userId)
            .gte("date", startOfLastMonth.toISOString())
            .lte("date", endOfLastMonth.toISOString()),

          // 5 most recent expenses (for dashboard card)
          supabase
            .from("expenses")
            .select("id, description, amount, category, date, metadata")
            .eq("user_id", userId)
            .order("date", { ascending: false })
            .limit(5),

          // Upcoming scheduled services
          supabase
            .from("services")
            .select("id, title, scheduled_date, scheduled_time, category, provider:service_providers(name)")
            .eq("user_id", userId)
            .eq("status", "scheduled")
            .gte("scheduled_date", today)
            .order("scheduled_date", { ascending: true })
            .limit(5),

          // Upcoming recurrences
          (supabase as any)
            .from("service_recurrences")
            .select("id, title, next_due_date, frequency, category, estimated_cost")
            .eq("user_id", userId)
            .eq("is_active", true)
            .gte("next_due_date", today)
            .order("next_due_date", { ascending: true })
            .limit(5),

          // Utility readings (latest 2 per type for trend)
          supabase
            .from("utility_readings")
            .select("id, utility_type, cost, reading_date")
            .eq("user_id", userId)
            .order("reading_date", { ascending: false })
            .limit(30),

          // Expiring documents (next 30 days)
          supabase
            .from("documents")
            .select("id, name, expiration_date, folder")
            .eq("user_id", userId)
            .not("expiration_date", "is", null)
            .gte("expiration_date", today)
            .lte("expiration_date", thirtyDaysStr)
            .order("expiration_date", { ascending: true }),

          // Property (for home value/equity)
          (supabase as any)
            .from("properties")
            .select("current_value, current_mortgage_debt")
            .eq("user_id", userId)
            .limit(1),

          // Recent activity (cross-feature timeline feed)
          supabase
            .from("timeline_events")
            .select("id, title, description, date, category, cost, metadata, created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(8),

          // Unresolved energy anomaly alerts
          supabase
            .from("alerts")
            .select("id")
            .eq("user_id", userId)
            .eq("alert_type", "utility_anomaly")
            .eq("resolved", false),

          // Expenses needing review (auto-imported low confidence)
          supabase
            .from("expenses")
            .select("id")
            .eq("user_id", userId)
            .eq("needs_review", true)
            .is("deleted_at", null),
        ]);

        if (!mounted) return;

        // ---- Process Tasks ----
        const tasks = tasksRes.data ?? [];
        const pending_tasks = tasks.filter((t: any) => !t.completed).length;
        const completed_tasks = tasks.filter((t: any) => t.completed).length;
        const overdue_tasks = tasks.filter((t: any) => {
          if (t.completed) return false;
          const due = t.due_date ? new Date(t.due_date) : null;
          return due !== null && due < now;
        }).length;

        // Urgent tasks: incomplete, sorted by overdue first, then priority
        const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
        const urgent_tasks: UrgentTask[] = tasks
          .filter((t: any) => !t.completed)
          .sort((a: any, b: any) => {
            // Overdue first
            const aOverdue = a.due_date && new Date(a.due_date) < now ? -1 : 0;
            const bOverdue = b.due_date && new Date(b.due_date) < now ? -1 : 0;
            if (aOverdue !== bOverdue) return aOverdue - bOverdue;
            // Then by priority
            return (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2);
          })
          .slice(0, 5)
          .map((t: any) => ({
            id: t.id,
            title: t.title,
            priority: t.priority || "medium",
            due_date: t.due_date,
            completed: t.completed,
            metadata: t.metadata,
          }));

        // ---- Process Expenses ----
        const expensesThisMonth = expensesThisMonthRes.data ?? [];
        const expensesLastMonth = expensesLastMonthRes.data ?? [];
        const monthly_expenses = expensesThisMonth.reduce((sum: number, e: any) => sum + Number(e.amount || 0), 0);
        const last_month_expenses = expensesLastMonth.reduce((sum: number, e: any) => sum + Number(e.amount || 0), 0);
        const expense_trend_pct = last_month_expenses > 0
          ? ((monthly_expenses - last_month_expenses) / last_month_expenses) * 100
          : null;

        const recent_expenses: RecentExpense[] = (recentExpensesRes.data ?? []).map((e: any) => ({
          id: e.id,
          description: e.description || "Untitled expense",
          amount: Number(e.amount || 0),
          category: e.category || "other",
          date: e.date,
          metadata: e.metadata,
        }));

        // ---- Process Services ----
        const upcoming_services: UpcomingService[] = (upcomingServicesRes.data ?? []).map((s: any) => ({
          id: s.id,
          title: s.title,
          scheduled_date: s.scheduled_date,
          scheduled_time: s.scheduled_time,
          category: s.category,
          provider: s.provider,
        }));

        // ---- Process Recurrences ----
        const upcoming_recurrences: UpcomingRecurrence[] = (upcomingRecurrencesRes.data ?? []).map((r: any) => ({
          id: r.id,
          title: r.title,
          next_due_date: r.next_due_date,
          frequency: r.frequency,
          category: r.category,
          estimated_cost: r.estimated_cost,
        }));

        // ---- Process Utility Readings ----
        const utilityReadings = utilityReadingsRes.data ?? [];
        const utilityByType: Record<string, { latest: number; previous: number | null }> = {};
        for (const r of utilityReadings as any[]) {
          const type = r.utility_type;
          if (!utilityByType[type]) {
            utilityByType[type] = { latest: r.cost || 0, previous: null };
          } else if (utilityByType[type].previous === null) {
            utilityByType[type].previous = r.cost || 0;
          }
        }
        const utility_summary: UtilitySummary[] = Object.entries(utilityByType).map(([type, vals]) => ({
          utility_type: type,
          latest_cost: vals.latest,
          previous_cost: vals.previous,
          change_pct: vals.previous !== null && vals.previous > 0
            ? ((vals.latest - vals.previous) / vals.previous) * 100
            : null,
        }));

        // ---- Process Documents ----
        const total_documents = docsRes.data?.length ?? 0;
        const expiring_documents: ExpiringDocument[] = (expiringDocsRes.data ?? []).map((d: any) => ({
          id: d.id,
          name: d.name,
          expiration_date: d.expiration_date,
          folder: d.folder,
        }));

        // ---- Process Property ----
        const property = (propertyRes.data ?? [])[0] as any;
        const home_value = property?.current_value ?? null;
        const home_equity = property
          ? (property.current_value || 0) - (property.current_mortgage_debt || 0)
          : null;

        // ---- Process Recent Activity ----
        const recent_activity: RecentActivity[] = (recentActivityRes.data ?? []).map((e: any) => ({
          id: e.id,
          title: e.title,
          description: e.description,
          date: e.date,
          category: e.category,
          cost: e.cost,
          source: (e.metadata as any)?.source || 'manual',
          source_id: (e.metadata as any)?.source_id || null,
          created_at: e.created_at,
        }));

        // ---- Process Anomalies & Review Counts ----
        const unresolved_anomalies = anomalyAlertsRes.data?.length ?? 0;
        const expenses_needing_review = expensesReviewRes.data?.length ?? 0;

        // ---- Last Activity ----
        const dateVals: number[] = [];
        tasks.forEach((t: any) => t.updated_at && dateVals.push(new Date(t.updated_at).getTime()));
        expensesThisMonth.forEach((e: any) => e.created_at && dateVals.push(new Date(e.created_at).getTime()));
        const last_activity = dateVals.length ? new Date(Math.max(...dateVals)).toISOString() : null;

        if (mounted) {
          setMetrics({
            pending_tasks,
            overdue_tasks,
            completed_tasks,
            total_documents,
            monthly_expenses,
            last_activity,
            recent_expenses,
            urgent_tasks,
            upcoming_services,
            upcoming_recurrences,
            utility_summary,
            expiring_documents,
            recent_activity,
            unresolved_anomalies,
            expenses_needing_review,
            expense_trend_pct,
            last_month_expenses,
            home_value,
            home_equity,
          });
          setLastRefreshedAt(new Date());
        }
      } catch (e: any) {
        if (mounted) setError(e.message || "Failed to load metrics");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMetrics();

    // Realtime listeners for instant UI updates
    const channel = supabase
      .channel("dashboard_updates")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "documents" }, () => {
        setMetrics((prev) => prev ? { ...prev, total_documents: prev.total_documents + 1 } : prev);
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "documents" }, () => {
        setMetrics((prev) => prev ? { ...prev, total_documents: Math.max(0, prev.total_documents - 1) } : prev);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "expenses" }, () => {
        // Full refresh on expense changes for accurate totals and recent list
        setRefreshTick((t) => t + 1);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, () => {
        // Full refresh on task changes for accurate counts and urgent list
        setRefreshTick((t) => t + 1);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "services" }, () => {
        setRefreshTick((t) => t + 1);
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "timeline_events" }, () => {
        setRefreshTick((t) => t + 1);
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [refreshTick]);

  const freshnessSeconds = lastRefreshedAt ? Math.max(0, Math.round((Date.now() - lastRefreshedAt.getTime()) / 1000)) : null;
  const refresh = () => setRefreshTick((t) => t + 1);

  return { metrics, loading, error, freshnessSeconds, refresh };
};
