
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

  const loadSampleData = async () => {
    try {
      setLoading(true);
      const today = new Date();
      const iso = (d: Date) => d.toISOString().split('T')[0];
      const samples = [
        { description: "Home Depot - supplies", amount: 234.56, category: "renovation", date: iso(new Date(today.getFullYear(), today.getMonth(), today.getDate()-3)), vendor: "Home Depot", room: "Kitchen" },
        { description: "HVAC Service", amount: 180.00, category: "services", date: iso(new Date(today.getFullYear(), today.getMonth(), today.getDate()-10)), vendor: "AC Pros", room: "Utility Room" },
        { description: "LED Bulbs", amount: 42.15, category: "utilities", date: iso(new Date(today.getFullYear(), today.getMonth(), today.getDate()-5)), vendor: "Amazon", room: "Living Room" },
        { description: "Washing Machine Repair", amount: 129.00, category: "appliances", date: iso(new Date(today.getFullYear(), today.getMonth(), today.getDate()-15)), vendor: "ApplianceFix", room: "Laundry Room" },
      ];

      // Try to persist via Supabase
      try {
        for (const s of samples) {
          await ExpenseService.createExpense({
            description: s.description,
            amount: s.amount,
            category: s.category as any,
            date: s.date,
            vendor: s.vendor,
            room: s.room,
            metadata: { source: "sample" } as any,
          } as any);
        }
        toast.success("Sample expenses inserted");
        setRefreshTick((t) => t + 1);
      } catch {
        // Fallback: local-only mock to preview UI without auth
        const now = new Date();
        setRecent(
          samples.map((s, i) => ({
            id: -100 - i,
            user_id: "local",
            description: s.description,
            amount: s.amount,
            category: s.category as any,
            date: s.date,
            vendor: s.vendor,
            room: s.room,
            metadata: { source: "sample-local" } as any,
            created_at: now.toISOString(),
            updated_at: now.toISOString(),
          })) as any
        );
        setAllThisPeriod((prev) => {
          const merged = [...samples.map((s, i) => ({
            id: -200 - i,
            user_id: "local",
            description: s.description,
            amount: s.amount,
            category: s.category as any,
            date: s.date,
            vendor: s.vendor,
            room: s.room,
            metadata: { source: "sample-local" } as any,
            created_at: now.toISOString(),
            updated_at: now.toISOString(),
          })) as any, ...prev];
          return merged as any;
        });
        setLastRefreshedAt(new Date());
        toast.info("Loaded local sample data (not saved)");
      }
    } finally {
      setLoading(false);
    }
  };

  const clearSampleData = async () => {
    try {
      setLoading(true);
      // Try to delete from DB (if authenticated)
      try {
        const deleted = await ExpenseService.deleteSampleExpenses();
        if (deleted > 0) toast.success(`Deleted ${deleted} sample expenses`);
      } catch {
        // ignore auth errors
      }

      // Clear locally injected sample rows (negative IDs and metadata markers)
      const isLocalSample = (e: any) => {
        const src = (e?.metadata as any)?.source;
        return e.id < 0 || src === 'sample-local' || src === 'sample-year-local' || src === 'sample' || src === 'sample-year';
      };
      setRecent((prev) => prev.filter((e: any) => !isLocalSample(e)) as any);
      setAllThisPeriod((prev) => prev.filter((e: any) => !isLocalSample(e)) as any);
      setLastRefreshedAt(new Date());
      toast.success('Sample data cleared');
    } finally {
      setLoading(false);
    }
  };

  const loadYearSampleData = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const iso = (d: Date) => d.toISOString().split('T')[0];
      const rnd = (min: number, max: number) => Math.round((Math.random() * (max - min) + min) * 100) / 100;
      const monthsBack = 12;

      const monthlyTemplates = [
        (base: Date) => ({ description: "Home Depot - supplies", amount: rnd(50, 300), category: "renovation", vendor: "Home Depot", room: "Garage", date: iso(new Date(base.getFullYear(), base.getMonth(), 5)) }),
        (base: Date) => ({ description: "HVAC Service", amount: rnd(120, 260), category: "services", vendor: "AC Pros", room: "Utility Room", date: iso(new Date(base.getFullYear(), base.getMonth(), 12)) }),
        (base: Date) => ({ description: "LED Bulbs", amount: rnd(20, 80), category: "utilities", vendor: "Amazon", room: "Living Room", date: iso(new Date(base.getFullYear(), base.getMonth(), 18)) }),
        (base: Date) => ({ description: "Appliance Repair", amount: rnd(90, 220), category: "appliances", vendor: "ApplianceFix", room: "Laundry Room", date: iso(new Date(base.getFullYear(), base.getMonth(), 24)) }),
      ];

      const allSamples: { description: string; amount: number; category: string; date: string; vendor: string; room: string; }[] = [];
      for (let m = 0; m < monthsBack; m++) {
        const base = new Date(now.getFullYear(), now.getMonth() - m, 1);
        const count = 3 + (m % 2); // alternate 3/4 items per month
        for (let i = 0; i < count; i++) {
          const make = monthlyTemplates[(i + m) % monthlyTemplates.length]!;
          const sample = make(base);
          allSamples.push({ ...sample, date: String(sample.date) });
        }
      }

      // Attempt DB insert first
      try {
        for (const s of allSamples) {
          await ExpenseService.createExpense({
            description: s.description,
            amount: s.amount,
            category: s.category as any,
            date: s.date,
            vendor: s.vendor,
            room: s.room,
            metadata: { source: "sample-year" } as any,
          } as any);
        }
        toast.success("12 months of sample expenses inserted");
        setRefreshTick((t) => t + 1);
      } catch {
        // Local fall back
        const nowIso = new Date().toISOString();
        const localRecent = allSamples
          .slice(0, 10)
          .map((s, i) => ({
            id: -300 - i,
            user_id: "local",
            description: s.description,
            amount: s.amount,
            category: s.category as any,
            date: s.date,
            vendor: s.vendor,
            room: s.room,
            metadata: { source: "sample-year-local" } as any,
            created_at: nowIso,
            updated_at: nowIso,
          })) as any;
        setRecent(localRecent);
        setAllThisPeriod((prev) => {
          const merged = [
            ...allSamples.map((s, i) => ({
              id: -500 - i,
              user_id: "local",
              description: s.description,
              amount: s.amount,
              category: s.category as any,
              date: s.date,
              vendor: s.vendor,
              room: s.room,
              metadata: { source: "sample-year-local" } as any,
              created_at: nowIso,
              updated_at: nowIso,
            })) as any,
            ...prev,
          ];
          return merged as any;
        });
        setLastRefreshedAt(new Date());
        toast.info("Loaded 12 months of local sample data (not saved)");
      }
    } finally {
      setLoading(false);
    }
  };

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
        <div className="flex gap-2">
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
          <Button
            className="w-full sm:w-auto btn-secondary-luxury"
            size="sm"
            title="Insert example expenses"
            onClick={loadSampleData}
          >
            Load Sample Data
          </Button>
          <Button
            className="w-full sm:w-auto btn-secondary-luxury"
            size="sm"
            title="Insert 12 months of sample expenses"
            onClick={loadYearSampleData}
          >
            Load 12mo Sample
          </Button>
          <Button
            className="w-full sm:w-auto btn-secondary-luxury"
            size="sm"
            title="Clear sample expenses"
            onClick={clearSampleData}
          >
            Clear Sample Data
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card-luxury p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-24 mb-4"></div>
              <div className="h-6 bg-muted rounded w-32"></div>
            </div>
          ))}
        </div>
      ) : (
        <ExpenseSummaryCards
          thisMonthExpenses={thisMonthExpenses}
          totalExpenses={totalExpenses}
        />
      )}

      {loading ? (
        <div className="card-luxury p-6 animate-pulse">
          <div className="h-5 bg-muted rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card-luxury p-4">
                <div className="h-10 w-10 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                <div className="h-6 bg-muted rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ExpenseCategoryBreakdown categories={categories} />
      )}

      {loading ? (
        <div className="card-luxury p-6 animate-pulse">
          <div className="h-5 bg-muted rounded w-40 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      ) : (
        <ExpenseRecentList
          expenses={recent as any}
          getCategoryColor={getCategoryColor}
        />
      )}
    </div>
  );
};

export default ExpenseTracker;
