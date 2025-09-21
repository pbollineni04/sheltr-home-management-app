import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type ExpenseRow = Database["public"]["Tables"]["expenses"]["Row"];
export type ExpenseInsert = Database["public"]["Tables"]["expenses"]["Insert"];

export class ExpenseService {
  static async createExpense(expense: ExpenseInsert): Promise<ExpenseRow> {
    const userRes = await supabase.auth.getUser();
    const userId = userRes.data.user?.id;
    if (!userId) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("expenses")
      .insert({ ...expense, user_id: userId })
      .select("*")
      .single();

    if (error) throw error;
    return data as ExpenseRow;
  }

  static async getByDateRange(startISO: string, endISO: string): Promise<ExpenseRow[]> {
    const userRes = await supabase.auth.getUser();
    const userId = userRes.data.user?.id;
    if (!userId) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", userId)
      .gte("date", startISO)
      .lte("date", endISO)
      .order("date", { ascending: false });

    if (error) throw error;
    return (data ?? []) as ExpenseRow[];
  }

  static async getRecent(limit = 10): Promise<ExpenseRow[]> {
    const userRes = await supabase.auth.getUser();
    const userId = userRes.data.user?.id;
    if (!userId) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data ?? []) as ExpenseRow[];
  }

  static async deleteSampleExpenses(): Promise<number> {
    const userRes = await supabase.auth.getUser();
    const userId = userRes.data.user?.id;
    if (!userId) throw new Error("Not authenticated");

    // Try deleting rows where metadata->>source matches any of our sample markers
    const { data, error, count } = await supabase
      .from("expenses")
      .delete({ count: 'exact' })
      .eq("user_id", userId)
      .or("metadata->>source.eq.sample,metadata->>source.eq.sample-local,metadata->>source.eq.sample-year,metadata->>source.eq.sample-year-local");

    if (error) throw error;
    return count ?? 0;
  }
}
