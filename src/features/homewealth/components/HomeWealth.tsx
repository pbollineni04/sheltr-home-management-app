import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp,
    Home,
    DollarSign,
    PiggyBank,
    ArrowUpRight,
    ArrowDownRight,
    Calculator,
    Lightbulb,
    Zap,
    Droplet,
    Wind,
    TreePine,
    Palette,
    HardHat,
    Info,
    Activity,
    Plus,
    RefreshCw,
} from "lucide-react";
import { staggerContainer, staggerContainerFast, fadeUpItem } from "@/lib/motion";
import { Button } from "@/components/ui/button";

import { useProperties, useImprovements, useEquityHistory, useComparableSales, useToggleImprovement, useSyncProperty } from "../api/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { EditPropertyModal } from "./EditPropertyModal";
import { useToast } from "@/hooks/use-toast";

/* ───── Helpers ───── */
const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);

/* ───── Component ───── */
const HomeWealth = () => {
    // We assume the user has 1 property for this MVP
    const { data: properties, isLoading: isLoadingProperty } = useProperties();
    const property = properties?.[0]; // Get the primary property

    const { data: dbImprovements, isLoading: isLoadingImprovements } = useImprovements(property?.id);
    const { data: dbEquityHistory } = useEquityHistory(property?.id);
    const { data: dbComps } = useComparableSales(property?.id);
    const toggleMutation = useToggleImprovement(property?.id);
    const syncMutation = useSyncProperty();
    const { toast } = useToast();

    const [marketTrend, setMarketTrend] = useState(3.5);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleSync = (force = false) => {
        if (!property?.id) return;

        // Caching: skip if last sync was less than 30 days ago (unless forced)
        if (!force && property.last_avm_sync) {
            const lastSync = new Date(property.last_avm_sync);
            const daysSinceSync = (Date.now() - lastSync.getTime()) / (1000 * 60 * 60 * 24);
            if (daysSinceSync < 30) {
                toast({ title: "Data is up to date", description: `Last synced ${Math.floor(daysSinceSync)} day(s) ago. Click again to force refresh.` });
                return;
            }
        }

        toast({ title: "Syncing market data...", description: "Fetching latest value from RentCast." });
        syncMutation.mutate(property.id, {
            onSuccess: () => {
                toast({ title: "Market data updated!", description: "Property value and comps have been refreshed." });
            },
            onError: (err) => {
                toast({ title: "Sync failed", description: err.message, variant: "destructive" });
            },
        });
    };

    // Track whether user already saw the "up to date" message (for force-refresh on second click)
    const [syncClickedOnce, setSyncClickedOnce] = useState(false);
    const onSyncClick = () => {
        if (syncClickedOnce) {
            handleSync(true); // force
            setSyncClickedOnce(false);
        } else {
            handleSync(false);
            setSyncClickedOnce(true);
            // Reset after 5 seconds so they don't accidentally force-refresh later
            setTimeout(() => setSyncClickedOnce(false), 5000);
        }
    };

    if (isLoadingProperty) {
        return (
            <div className="max-w-7xl mx-auto space-y-6">
                <Skeleton className="h-40 w-full rounded-2xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-xl" />
            </div>
        )
    }

    if (!property) {
        return (
            <div className="max-w-7xl mx-auto space-y-6 text-center py-20">
                <Home className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                <h2 className="text-2xl font-bold mb-2">Welcome to HomeWealth</h2>
                <p className="text-muted-foreground mb-6">Track your home's investment performance, calculate ROI on renovations, and build wealth.</p>
                <Button className="gap-2" onClick={() => setIsEditModalOpen(true)}>
                    <Plus size={16} /> Add Your Property
                </Button>

                <EditPropertyModal
                    property={null}
                    open={isEditModalOpen}
                    onOpenChange={setIsEditModalOpen}
                />
            </div>
        )
    }

    if (isLoadingImprovements) {
        return (
            <div className="max-w-7xl mx-auto space-y-6">
                <Skeleton className="h-40 w-full rounded-2xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-xl" />
            </div>
        )
    }

    // Map DB data or fallback to defaults
    const currentPropertyValue = property.current_value || 0;
    const currentMortgageDebt = property.current_mortgage_debt || 0;
    const currentEquity = currentPropertyValue - currentMortgageDebt;
    const originalPurchasePrice = property.purchase_price || currentPropertyValue;
    const ltvRatio = currentPropertyValue > 0 ? ((currentMortgageDebt / currentPropertyValue) * 100).toFixed(1) : "0.0";

    const improvements = dbImprovements || [];
    const equityHistory = dbEquityHistory || [];
    const compSalesData = dbComps || [];

    const totalROI = improvements.reduce((sum, imp) => (imp.completed ? sum + (imp.estimated_roi || 0) : sum), 0);
    const totalCost = improvements.reduce((sum, imp) => (imp.completed ? sum + imp.cost : sum), 0);
    const projectedValue = currentPropertyValue + totalROI + (currentPropertyValue * marketTrend) / 100;

    const yoyAppreciation = originalPurchasePrice > 0 ? (
        ((currentPropertyValue - originalPurchasePrice) / originalPurchasePrice) *
        100
    ).toFixed(1) : "0.0";

    const rentalIncome = property.monthly_rental_income || 0;
    const estimatedExpenses = property.estimated_monthly_expenses || 0;
    const monthlyMortgage = 2100; // Simplified for MVP, ideally calculate from debt + interest
    const netRentalIncome = rentalIncome - monthlyMortgage - estimatedExpenses;

    // Profit Calculator
    const salePrice = projectedValue;
    const agentCommission = salePrice * 0.06;
    const closingCosts = salePrice * 0.02;
    const remainingMortgage = currentMortgageDebt;
    const netProceeds = salePrice - agentCommission - closingCosts - remainingMortgage;

    const toggleImprovement = (id: string, currentStatus: boolean) => {
        toggleMutation.mutate({ id, completed: !currentStatus });
    }

    const getLTVColor = () => {
        const ltv = parseFloat(ltvRatio);
        if (ltv < 60) return "#10b981";
        if (ltv < 80) return "#f59e0b";
        return "#ef4444";
    };

    const getLTVStatus = () => {
        const ltv = parseFloat(ltvRatio);
        if (ltv < 60) return "Excellent";
        if (ltv < 80) return "Good";
        return "High";
    };

    // Calculate generic amortization schedule based on current debts (simplified)
    const generateAmort = () => {
        let balance = currentMortgageDebt;
        let equity = currentEquity;
        const rate = property.interest_rate || 6.5; // API or default
        const yearStart = new Date().getFullYear();

        const sched = [];
        for (let i = 0; i < 5; i++) {
            const interest = balance * (rate / 100);
            // simplify principal to spread remaining over loan term, minus some interest
            const principal = (balance / 30) - (interest * 0.2);
            balance -= principal;
            equity += principal;
            sched.push({ year: yearStart + i, principal, interest, balance, equity });
        }
        return sched;
    }
    const amortizationSchedule = generateAmort();

    // Max value in amortization for simple bar chart scaling
    const maxAmort = Math.max(...amortizationSchedule.map((r) => r.principal + r.interest));

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Hero Header */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 md:p-8 text-white shadow-xl flex justify-between items-center"
            >
                <div className="flex items-center gap-3">
                    <TrendingUp size={36} />
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold">HomeWealth</h1>
                        <p className="text-emerald-100 text-sm md:text-base mt-1">
                            {property.address_line1}, {property.city}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        className="font-semibold text-emerald-900"
                        onClick={onSyncClick}
                        disabled={syncMutation.isPending}
                    >
                        <RefreshCw size={16} className={syncMutation.isPending ? "animate-spin" : ""} />
                        {syncMutation.isPending ? "Syncing..." : "Sync Market Data"}
                    </Button>
                    <Button
                        variant="secondary"
                        className="font-semibold text-emerald-900"
                        onClick={() => setIsEditModalOpen(true)}
                    >
                        Edit Property
                    </Button>
                </div>
            </motion.div>

            {/* Live Market Pulse */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 text-white shadow-lg overflow-hidden"
            >
                <div className="flex items-center gap-2 mb-3">
                    <Activity size={20} />
                    <span className="font-semibold">Live Market Pulse</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                        <p className="text-xs text-blue-100 mb-1">Current Market Value</p>
                        <p className="text-2xl font-bold tabular-nums">{formatCurrency(currentPropertyValue)}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-blue-100 mb-1">YoY Appreciation</p>
                            <ArrowUpRight size={16} className="text-emerald-300" />
                        </div>
                        <p className="text-2xl font-bold tabular-nums text-emerald-300">+{yoyAppreciation}%</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                        <p className="text-xs text-blue-100 mb-1">Neighborhood Velocity</p>
                        <p className="text-2xl font-bold">
                            <span className="text-emerald-300">High</span>
                            <span className="text-sm font-normal text-blue-100 ml-2">5 recent sales</span>
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Equity Hero Card — simple bar visualization */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="bg-card rounded-xl shadow-lg border border-border p-6"
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Total Household Wealth</h2>
                        <p className="text-muted-foreground text-sm mt-1">Property Value vs. Mortgage Debt</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Current Equity</p>
                        <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                            {formatCurrency(currentEquity)}
                        </p>
                    </div>
                </div>

                {/* Mini equity trend bars */}
                <div className="space-y-2">
                    {equityHistory.slice(-6).map((d, i) => (
                        <div key={i} className="flex items-center gap-3 text-xs">
                            <span className="w-14 text-muted-foreground text-right">{d.recorded_date}</span>
                            <div className="flex-1 flex gap-1 items-center h-5">
                                <div
                                    className="bg-blue-500 rounded-sm h-4"
                                    style={{ width: `${(d.property_value / 600000) * 100}%` }}
                                    title={`Value: ${formatCurrency(d.property_value)}`}
                                />
                                <div
                                    className="bg-red-400 rounded-sm h-4"
                                    style={{ width: `${((d.mortgage_debt || 0) / 600000) * 100}%` }}
                                    title={`Debt: ${formatCurrency(d.mortgage_debt || 0)}`}
                                />
                            </div>
                            <span className="w-16 text-right font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">
                                {formatCurrency(d.equity || 0)}
                            </span>
                        </div>
                    ))}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-sm" /> Property Value</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-400 rounded-sm" /> Mortgage Debt</div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
                {/* LTV Ratio Gauge */}
                <motion.div variants={fadeUpItem} className="bg-card rounded-xl shadow-lg border border-border p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">Loan-to-Value Ratio</h3>
                    <div className="flex flex-col items-center">
                        <div className="relative w-48 h-48">
                            <svg viewBox="0 0 200 200" className="transform -rotate-90">
                                <circle cx="100" cy="100" r="80" fill="none" stroke="hsl(var(--muted))" strokeWidth="20" />
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="80"
                                    fill="none"
                                    stroke={getLTVColor()}
                                    strokeWidth="20"
                                    strokeDasharray={`${(parseFloat(ltvRatio) / 100) * 502.4} 502.4`}
                                    strokeLinecap="round"
                                    className="transition-all duration-500"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <p className="text-4xl font-bold tabular-nums" style={{ color: getLTVColor() }}>
                                    {ltvRatio}%
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">{getLTVStatus()}</p>
                            </div>
                        </div>

                        <div className="mt-6 w-full space-y-3">
                            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <span className="text-sm text-muted-foreground">Current Mortgage</span>
                                <span className="font-semibold text-foreground tabular-nums">{formatCurrency(currentMortgageDebt)}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <span className="text-sm text-muted-foreground">Property Value</span>
                                <span className="font-semibold text-foreground tabular-nums">{formatCurrency(currentPropertyValue)}</span>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg border border-indigo-200 dark:border-indigo-800">
                                <Info size={16} className="text-indigo-600 dark:text-indigo-400" />
                                <span className="text-xs text-indigo-700 dark:text-indigo-300">
                                    Below 80% LTV: PMI typically removed
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Rental Potential Card */}
                <motion.div variants={fadeUpItem} className="bg-card rounded-xl shadow-lg border border-border p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Home className="text-purple-600 dark:text-purple-400" size={24} />
                        <h3 className="text-xl font-bold text-foreground">Rental Potential</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                            <p className="text-sm text-purple-700 dark:text-purple-300 mb-1">Estimated Monthly Rental Income</p>
                            <p className="text-3xl font-bold text-purple-900 dark:text-purple-200 tabular-nums">
                                {formatCurrency(rentalIncome)}
                            </p>
                            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Based on local market averages</p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Monthly Rental Income</span>
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">+{formatCurrency(rentalIncome)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Mortgage Payment</span>
                                <span className="font-semibold text-red-600 dark:text-red-400 tabular-nums">-{formatCurrency(monthlyMortgage)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Est. Expenses (15%)</span>
                                <span className="font-semibold text-red-600 dark:text-red-400 tabular-nums">-{formatCurrency(estimatedExpenses)}</span>
                            </div>
                            <div className="h-px bg-border" />
                            <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
                                <span className="font-semibold text-foreground">Net Monthly Cash Flow</span>
                                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                                    {formatCurrency(netRentalIncome)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Annual Cash Flow</span>
                                <span className="font-semibold tabular-nums">{formatCurrency(netRentalIncome * 12)}</span>
                            </div>
                        </div>

                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2 mb-2">
                                <Calculator size={16} className="text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-semibold text-blue-900 dark:text-blue-200">Cap Rate</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-200 tabular-nums">
                                {(((netRentalIncome * 12) / currentPropertyValue) * 100).toFixed(2)}%
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Interactive ROI Tool */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="bg-card rounded-xl shadow-lg border border-border p-6"
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-2">
                        <Lightbulb className="text-yellow-600 dark:text-yellow-400" size={24} />
                        <h3 className="text-xl font-bold text-foreground">ROI Simulator</h3>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Projected Valuation</p>
                        <p className="text-2xl font-bold text-primary tabular-nums transition-all duration-300">
                            {formatCurrency(projectedValue)}
                        </p>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-3">
                        Market Trend Adjustment:{" "}
                        <span className="text-primary tabular-nums">{marketTrend.toFixed(1)}%</span>
                    </label>
                    <input
                        type="range"
                        min="-5"
                        max="10"
                        step="0.5"
                        value={marketTrend}
                        onChange={(e) => setMarketTrend(parseFloat(e.target.value))}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>-5%</span>
                        <span>0%</span>
                        <span>+10%</span>
                    </div>
                </div>

                <motion.div
                    variants={staggerContainerFast}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {improvements.map((improvement) => {
                        // For MVP, map static icons based on name.
                        const Icon = Zap;
                        const roiPercent = (((improvement.estimated_roi || 0) / improvement.cost) * 100).toFixed(0);
                        return (
                            <motion.button
                                key={improvement.id}
                                variants={fadeUpItem}
                                onClick={() => toggleImprovement(improvement.id, improvement.completed)}
                                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${improvement.completed
                                    ? "border-primary bg-primary/10 shadow-md scale-105"
                                    : "border-border bg-card hover:border-muted-foreground/40 hover:shadow"
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <Icon
                                        size={24}
                                        className={improvement.completed ? "text-primary" : "text-muted-foreground"}
                                    />
                                    <div
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${improvement.completed
                                            ? "border-primary bg-primary"
                                            : "border-muted-foreground/40"
                                            }`}
                                    >
                                        {improvement.completed && (
                                            <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <h4 className="font-semibold text-foreground mb-2">{improvement.name}</h4>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Cost:</span>
                                        <span className="font-semibold text-foreground tabular-nums">{formatCurrency(improvement.cost)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">ROI:</span>
                                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                                            {formatCurrency(improvement.estimated_roi || 0)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Return:</span>
                                        <span className="font-semibold text-purple-600 dark:text-purple-400 tabular-nums">{roiPercent}%</span>
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </motion.div>

                {totalCost > 0 && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Total Investment</p>
                                <p className="text-xl font-bold text-foreground tabular-nums">{formatCurrency(totalCost)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Total Value Add</p>
                                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{formatCurrency(totalROI)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Net Gain</p>
                                <p className="text-xl font-bold text-teal-600 dark:text-teal-400 tabular-nums">{formatCurrency(totalROI - totalCost)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Combined ROI</p>
                                <p className="text-xl font-bold text-purple-600 dark:text-purple-400 tabular-nums">
                                    {((totalROI / totalCost) * 100).toFixed(0)}%
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Profit Calculator */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-card rounded-xl shadow-lg border border-border p-6"
            >
                <div className="flex items-center gap-2 mb-6">
                    <Calculator className="text-green-600 dark:text-green-400" size={24} />
                    <h3 className="text-xl font-bold text-foreground">Sale Profit Calculator</h3>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-foreground">Projected Sale Price</span>
                        <span className="text-xl font-bold text-foreground tabular-nums">{formatCurrency(salePrice)}</span>
                    </div>

                    <div className="space-y-2 pl-4">
                        <div className="flex items-center justify-between text-red-600 dark:text-red-400">
                            <span className="text-sm">Agent Commission (6%)</span>
                            <span className="font-semibold tabular-nums">-{formatCurrency(agentCommission)}</span>
                        </div>
                        <div className="flex items-center justify-between text-red-600 dark:text-red-400">
                            <span className="text-sm">Closing Costs (2%)</span>
                            <span className="font-semibold tabular-nums">-{formatCurrency(closingCosts)}</span>
                        </div>
                        <div className="flex items-center justify-between text-red-600 dark:text-red-400">
                            <span className="text-sm">Remaining Mortgage</span>
                            <span className="font-semibold tabular-nums">-{formatCurrency(remainingMortgage)}</span>
                        </div>
                    </div>

                    <div className="h-px bg-border" />

                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg text-white">
                        <span className="text-lg font-semibold">Net Proceeds (Your Profit)</span>
                        <span className="text-3xl font-bold tabular-nums">{formatCurrency(netProceeds)}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg text-center">
                            <p className="text-xs text-muted-foreground mb-1">Total Appreciation</p>
                            <p className="text-lg font-bold text-primary tabular-nums">
                                {formatCurrency(projectedValue - originalPurchasePrice)}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-lg text-center">
                            <p className="text-xs text-muted-foreground mb-1">ROI on Purchase</p>
                            <p className="text-lg font-bold text-purple-600 dark:text-purple-400 tabular-nums">
                                {((netProceeds / originalPurchasePrice) * 100).toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Comparable Sales */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="bg-card rounded-xl shadow-lg border border-border p-6"
            >
                <h3 className="text-xl font-bold text-foreground mb-4">Recent Comparable Sales</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Address</th>
                                <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Sold Date</th>
                                <th className="text-right py-3 px-2 text-sm font-semibold text-foreground">Price</th>
                                <th className="text-right py-3 px-2 text-sm font-semibold text-foreground">Sq Ft</th>
                                <th className="text-right py-3 px-2 text-sm font-semibold text-foreground">$/Sq Ft</th>
                            </tr>
                        </thead>
                        <tbody>
                            {compSalesData.map((sale, idx) => (
                                <tr key={idx} className="border-b border-border/40 hover:bg-muted/50">
                                    <td className="py-3 px-2 text-sm text-foreground">{sale.address}</td>
                                    <td className="py-3 px-2 text-sm text-muted-foreground">{new Date(sale.sold_date).toLocaleDateString()}</td>
                                    <td className="py-3 px-2 text-sm font-semibold text-foreground text-right tabular-nums">
                                        {formatCurrency(sale.sold_price)}
                                    </td>
                                    <td className="py-3 px-2 text-sm text-muted-foreground text-right tabular-nums">
                                        {sale.sqft?.toLocaleString() || '-'}
                                    </td>
                                    <td className="py-3 px-2 text-sm font-semibold text-primary text-right tabular-nums">
                                        ${sale.price_per_sqft || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* 5-Year Mortgage Projection — CSS bar chart */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-card rounded-xl shadow-lg border border-border p-6"
            >
                <h3 className="text-xl font-bold text-foreground mb-4">5-Year Mortgage Projection</h3>

                {/* Simple CSS bar chart */}
                <div className="space-y-3 mb-6">
                    {amortizationSchedule.map((row) => (
                        <div key={row.year} className="flex items-center gap-3">
                            <span className="w-12 text-sm font-medium text-foreground tabular-nums">{row.year}</span>
                            <div className="flex-1 flex h-8 rounded overflow-hidden">
                                <div
                                    className="bg-emerald-500 flex items-center justify-center text-white text-xs font-medium"
                                    style={{ width: `${(row.principal / maxAmort) * 50}%` }}
                                >
                                    {row.principal >= 3000 ? formatCurrency(row.principal) : ""}
                                </div>
                                <div
                                    className="bg-red-400 flex items-center justify-center text-white text-xs font-medium"
                                    style={{ width: `${(row.interest / maxAmort) * 50}%` }}
                                >
                                    {row.interest >= 3000 ? formatCurrency(row.interest) : ""}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-emerald-500 rounded-sm" /> Principal
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-red-400 rounded-sm" /> Interest
                        </div>
                    </div>
                </div>

                {/* Amortization table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Year</th>
                                <th className="text-right py-3 px-2 text-sm font-semibold text-foreground">Principal</th>
                                <th className="text-right py-3 px-2 text-sm font-semibold text-foreground">Interest</th>
                                <th className="text-right py-3 px-2 text-sm font-semibold text-foreground">Balance</th>
                                <th className="text-right py-3 px-2 text-sm font-semibold text-foreground">Equity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {amortizationSchedule.map((row) => (
                                <tr key={row.year} className="border-b border-border/40">
                                    <td className="py-3 px-2 text-sm font-medium text-foreground">{row.year}</td>
                                    <td className="py-3 px-2 text-sm text-emerald-600 dark:text-emerald-400 font-semibold text-right tabular-nums">
                                        {formatCurrency(row.principal)}
                                    </td>
                                    <td className="py-3 px-2 text-sm text-red-600 dark:text-red-400 font-semibold text-right tabular-nums">
                                        {formatCurrency(row.interest)}
                                    </td>
                                    <td className="py-3 px-2 text-sm text-foreground font-semibold text-right tabular-nums">
                                        {formatCurrency(row.balance)}
                                    </td>
                                    <td className="py-3 px-2 text-sm text-primary font-semibold text-right tabular-nums">
                                        {formatCurrency(row.equity)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {property && (
                <EditPropertyModal
                    property={property as any}
                    open={isEditModalOpen}
                    onOpenChange={setIsEditModalOpen}
                />
            )}
        </div>
    );
};

export default HomeWealth;
