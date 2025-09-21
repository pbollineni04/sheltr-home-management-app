
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ExpenseHeader } from "./expense/ExpenseHeader";
import { ExpensePlaidControls } from "./expense/ExpensePlaidControls";
import { ExpenseSummaryCards } from "./expense/ExpenseSummaryCards";
import { ExpenseCategoryBreakdown } from "./expense/ExpenseCategoryBreakdown";
import { ExpenseRecentList } from "./expense/ExpenseRecentList";
import { ExpenseService, type ExpenseRow } from "@/features/expenses/services/expenseService";
import { toast } from "sonner";
import { 
  Home as IconHome,
  Wrench as IconWrench,
  ShoppingBag as IconShoppingBag,
  Calendar as IconCalendar,
  Lightbulb as IconLightbulb
} from "lucide-react";

const ExpenseTracker = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<"month" | "year">("month");
  const [recent, setRecent] = useState<ExpenseRow[]>([]);
  const [allThisPeriod, setAllThisPeriod] = useState<ExpenseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      renovation: "bg-blue-100 text-blue-800",
      maintenance: "bg-green-100 text-green-800",
      appliances: "bg-purple-100 text-purple-800",
      services: "bg-orange-100 text-orange-800",
      utilities: "bg-yellow-100 text-yellow-800",
    };
    return colors[category] ?? "bg-gray-100 text-gray-800";
  };

  const iconMap: Record<string, any> = {
    renovation: IconHome,
    maintenance: IconWrench,
    appliances: IconShoppingBag,
    services: IconCalendar,
    utilities: IconLightbulb,
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const now = new Date();
        const start = selectedPeriod === "month"
          ? new Date(now.getFullYear(), now.getMonth(), 1)
          : new Date(now.getFullYear(), 0, 1);

        const [recentData, periodData] = await Promise.all([
          ExpenseService.getRecent(10),
          ExpenseService.getByDateRange(start.toISOString(), now.toISOString()),
        ]);

        if (!mounted) return;
        setRecent(recentData);
        setAllThisPeriod(periodData);
        setLastRefreshedAt(new Date());
      } catch (e: any) {
        if (!mounted) return;
        setError(e.message || "Failed to load expenses");
        toast.error(e.message || "Failed to load expenses");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [selectedPeriod, refreshTick]);

  const totalExpenses = useMemo(() => allThisPeriod.reduce((sum, e) => sum + Number(e.amount || 0), 0), [allThisPeriod]);
  const thisMonthExpenses = totalExpenses; // reflects selectedPeriod; rename is kept for existing UI prop names

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    allThisPeriod.forEach(e => map.set(e.category, (map.get(e.category) || 0) + Number(e.amount || 0)));
    return Array.from(map.entries()).map(([id, amount]) => ({
      id,
      label: id.charAt(0).toUpperCase() + id.slice(1),
      icon: iconMap[id] ?? IconHome,
      color: id === 'renovation' ? 'blue'
        : id === 'maintenance' ? 'green'
        : id === 'appliances' ? 'purple'
        : id === 'services' ? 'orange'
        : id === 'utilities' ? 'yellow'
        : 'gray',
      amount,
    }));
  }, [allThisPeriod]);

  return (
    <div className="space-y-6 px-3 sm:px-4">
      <ExpenseHeader />
      <ExpensePlaidControls />
      {/* Freshness + Dev Refresh */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-gray-500">
          {loading
            ? 'Loading…'
            : lastRefreshedAt
              ? (() => { const s = Math.max(0, Math.round((Date.now() - lastRefreshedAt.getTime()) / 1000)); return `Updated ${Math.floor(s/60)}m ${s%60}s ago`; })()
              : ''}
        </p>
        {import.meta.env.DEV && (
          <Button
            className="w-full sm:w-auto"
            variant="outline"
            size="sm"
            title="Re-fetch expenses (dev only)"
            onClick={() => { setRefreshTick(t => t + 1); toast.success('Expenses refreshed'); }}
          >
            Refresh
          </Button>
        )}
      </div>
      
      <ExpenseSummaryCards
        thisMonthExpenses={loading ? 0 : thisMonthExpenses}
        totalExpenses={loading ? 0 : totalExpenses}
      />

      <ExpenseCategoryBreakdown categories={categories} />

      <ExpenseRecentList
        expenses={recent as any}
        getCategoryColor={getCategoryColor}
      />
    </div>
  );
};

export default ExpenseTracker;
