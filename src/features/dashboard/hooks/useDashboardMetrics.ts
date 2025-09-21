import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type DashboardMetrics = {
  pending_tasks: number;
  overdue_tasks: number;
  total_documents: number;
  monthly_expenses: number;
  last_activity: string | null;
};

export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const [refreshMode, setRefreshMode] = useState<'cached' | 'live'>('cached');

  useEffect(() => {
    let mounted = true;

    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user id
        const userRes = await supabase.auth.getUser();
        const userId = userRes.data.user?.id;
        if (!userId) {
          throw new Error("User not authenticated");
        }

        const computeFromTables = async () => {
          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

          const [tasksRes, docsRes, expensesRes] = await Promise.all([
            supabase
              .from("tasks")
              .select("id, completed, due_date, updated_at")
              .eq("user_id", userId),
            supabase
              .from("documents")
              .select("id")
              .eq("user_id", userId),
            supabase
              .from("expenses")
              .select("amount, date, created_at")
              .eq("user_id", userId)
              .gte("date", startOfMonth.toISOString()),
          ]);

          if (tasksRes.error) throw tasksRes.error;
          if (docsRes.error) throw docsRes.error;
          if (expensesRes.error) throw expensesRes.error;

          const tasks = tasksRes.data ?? [] as any[];
          const documents = docsRes.data ?? [] as any[];
          const expenses = expensesRes.data ?? [] as any[];

          const pending_tasks = tasks.filter((t: any) => !t.completed).length;
          const overdue_tasks = tasks.filter((t: any) => {
            if (t.completed) return false;
            const due = t.due_date ? new Date(t.due_date) : null;
            return due !== null && due < now;
          }).length;
          const total_documents = documents.length;
          const monthly_expenses = expenses.reduce((sum: number, e: any) => sum + Number(e.amount || 0), 0);
          const dateVals: number[] = [];
          tasks.forEach((t: any) => t.updated_at && dateVals.push(new Date(t.updated_at).getTime()));
          expenses.forEach((e: any) => e.created_at && dateVals.push(new Date(e.created_at).getTime()));
          const last_activity = dateVals.length ? new Date(Math.max(...dateVals)).toISOString() : null;

          if (mounted) {
            setMetrics({ pending_tasks, overdue_tasks, total_documents, monthly_expenses, last_activity });
            setLastRefreshedAt(new Date());
          }
        };

        if (refreshMode === 'live') {
          await computeFromTables();
        } else {
          // Try querying the secure dashboard view if it exists
          const viewRes = await supabase
            .from("dashboard_metrics_secure" as any)
            .select("*")
            .eq("user_id", userId)
            .maybeSingle();

          if (viewRes.data && !viewRes.error) {
            if (mounted) setMetrics({
              pending_tasks: (viewRes.data as any).pending_tasks ?? 0,
              overdue_tasks: (viewRes.data as any).overdue_tasks ?? 0,
              total_documents: (viewRes.data as any).total_documents ?? 0,
              monthly_expenses: Number((viewRes.data as any).monthly_expenses ?? 0),
              last_activity: (viewRes.data as any).last_activity ?? null,
            });
            if (mounted) setLastRefreshedAt(new Date());
          } else {
            await computeFromTables();
          }
        }
      } catch (e: any) {
        if (mounted) setError(e.message || "Failed to load metrics");
      } finally {
        if (mounted) setLoading(false);
        // reset mode back to cached after any fetch
        setRefreshMode('cached');
      }
    };

    fetchMetrics();

    // Realtime listeners: apply light-weight deltas so UI feels live between mat view refreshes
    const channel = supabase
      .channel("dashboard_updates")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "documents" }, () => {
        setMetrics((prev) => prev ? { ...prev, total_documents: prev.total_documents + 1 } : prev);
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "documents" }, () => {
        setMetrics((prev) => prev ? { ...prev, total_documents: Math.max(0, prev.total_documents - 1) } : prev);
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "expenses" }, (payload) => {
        const amt = Number((payload.new as any)?.amount ?? 0);
        setMetrics((prev) => prev ? { ...prev, monthly_expenses: prev.monthly_expenses + amt } : prev);
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "expenses" }, (payload) => {
        const amt = Number((payload.old as any)?.amount ?? 0);
        setMetrics((prev) => prev ? { ...prev, monthly_expenses: Math.max(0, prev.monthly_expenses - amt) } : prev);
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "tasks" }, (payload) => {
        const completed = Boolean((payload.new as any)?.completed);
        const dueDate = (payload.new as any)?.due_date ? new Date((payload.new as any).due_date) : null;
        const now = new Date();
        setMetrics((prev) => {
          if (!prev) return prev;
          let pending = prev.pending_tasks + (completed ? 0 : 1);
          let overdue = prev.overdue_tasks + (!completed && dueDate && dueDate < now ? 1 : 0);
          return { ...prev, pending_tasks: pending, overdue_tasks: overdue };
        });
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "tasks" }, (payload) => {
        const oldCompleted = Boolean((payload.old as any)?.completed);
        const newCompleted = Boolean((payload.new as any)?.completed);
        const oldDue = (payload.old as any)?.due_date ? new Date((payload.old as any).due_date) : null;
        const newDue = (payload.new as any)?.due_date ? new Date((payload.new as any).due_date) : null;
        const now = new Date();
        setMetrics((prev) => {
          if (!prev) return prev;
          let pending = prev.pending_tasks;
          let overdue = prev.overdue_tasks;
          if (oldCompleted !== newCompleted) {
            // toggled completion
            pending += newCompleted ? -1 : 1;
            const wasOverdue = !oldCompleted && oldDue && oldDue < now;
            const nowOverdue = !newCompleted && newDue && newDue < now;
            if (wasOverdue && !nowOverdue) overdue -= 1;
            if (!wasOverdue && nowOverdue) overdue += 1;
          } else if (oldDue?.getTime() !== newDue?.getTime()) {
            // due date changed may affect overdue status
            const wasOverdue = !oldCompleted && oldDue && oldDue < now;
            const nowOverdue = !newCompleted && newDue && newDue < now;
            if (wasOverdue && !nowOverdue) overdue -= 1;
            if (!wasOverdue && nowOverdue) overdue += 1;
          }
          return { ...prev, pending_tasks: Math.max(0, pending), overdue_tasks: Math.max(0, overdue) };
        });
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "tasks" }, (payload) => {
        const completed = Boolean((payload.old as any)?.completed);
        const dueDate = (payload.old as any)?.due_date ? new Date((payload.old as any).due_date) : null;
        const now = new Date();
        setMetrics((prev) => {
          if (!prev) return prev;
          let pending = prev.pending_tasks - (completed ? 0 : 1);
          let overdue = prev.overdue_tasks - (!completed && dueDate && dueDate < now ? 1 : 0);
          return { ...prev, pending_tasks: Math.max(0, pending), overdue_tasks: Math.max(0, overdue) };
        });
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [refreshTick]);

  // derived freshness in seconds
  const freshnessSeconds = lastRefreshedAt ? Math.max(0, Math.round((Date.now() - lastRefreshedAt.getTime()) / 1000)) : null;

  const refresh = () => setRefreshTick((t) => t + 1);
  const refreshLive = () => { setRefreshMode('live'); setRefreshTick((t) => t + 1); };

  return { metrics, loading, error, freshnessSeconds, refresh, refreshLive };
};
