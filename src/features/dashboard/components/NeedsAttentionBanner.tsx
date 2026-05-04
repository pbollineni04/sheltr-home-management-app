import { motion } from "framer-motion";
import {
    AlertTriangle,
    CheckSquare,
    FileText,
    Wrench,
    ChevronRight,
    X,
    Zap,
    DollarSign,
} from "lucide-react";
import { useState } from "react";
import { easeDefault } from "@/lib/motion";
import type { DashboardMetrics } from "../hooks/useDashboardMetrics";

interface NeedsAttentionBannerProps {
    metrics: DashboardMetrics;
    onNavigate: (tab: string) => void;
}

type AttentionItem = {
    id: string;
    label: string;
    count: number;
    icon: typeof AlertTriangle;
    tab: string;
    color: string;
};

const NeedsAttentionBanner = ({ metrics, onNavigate }: NeedsAttentionBannerProps) => {
    const [dismissed, setDismissed] = useState(false);

    // Build attention items from real data
    const items: AttentionItem[] = [];

    if (metrics.overdue_tasks > 0) {
        items.push({
            id: "overdue-tasks",
            label: `overdue task${metrics.overdue_tasks !== 1 ? "s" : ""}`,
            count: metrics.overdue_tasks,
            icon: CheckSquare,
            tab: "tasks",
            color: "text-red-600 dark:text-red-400",
        });
    }

    if (metrics.expiring_documents.length > 0) {
        const soonest = metrics.expiring_documents[0];
        const daysUntil = Math.ceil(
            (new Date(soonest.expiration_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        items.push({
            id: "expiring-docs",
            label: `document${metrics.expiring_documents.length !== 1 ? "s" : ""} expiring${daysUntil <= 7 ? ` in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}` : " soon"}`,
            count: metrics.expiring_documents.length,
            icon: FileText,
            tab: "vault",
            color: "text-amber-600 dark:text-amber-400",
        });
    }

    // Check for upcoming recurrences within 3 days
    const soonRecurrences = metrics.upcoming_recurrences.filter((r) => {
        const daysUntil = Math.ceil(
            (new Date(r.next_due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        return daysUntil <= 3;
    });
    if (soonRecurrences.length > 0) {
        items.push({
            id: "upcoming-recurrences",
            label: `service${soonRecurrences.length !== 1 ? "s" : ""} due soon`,
            count: soonRecurrences.length,
            icon: Wrench,
            tab: "services",
            color: "text-blue-600 dark:text-blue-400",
        });
    }

    if (metrics.unresolved_anomalies > 0) {
        items.push({
            id: "energy-anomalies",
            label: `energy anomal${metrics.unresolved_anomalies !== 1 ? "ies" : "y"} detected`,
            count: metrics.unresolved_anomalies,
            icon: Zap,
            tab: "energy",
            color: "text-yellow-600 dark:text-yellow-400",
        });
    }

    if (metrics.expenses_needing_review > 0) {
        items.push({
            id: "expenses-review",
            label: `expense${metrics.expenses_needing_review !== 1 ? "s" : ""} to review`,
            count: metrics.expenses_needing_review,
            icon: DollarSign,
            tab: "expenses",
            color: "text-green-600 dark:text-green-400",
        });
    }

    // Don't show if nothing needs attention or dismissed
    if (items.length === 0 || dismissed) return null;

    const totalCount = items.reduce((sum, item) => sum + item.count, 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={easeDefault}
            className="relative bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 shadow-sm"
        >
            {/* Dismiss button */}
            <button
                onClick={() => setDismissed(true)}
                className="absolute top-3 right-3 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
                <X size={16} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="text-amber-600 dark:text-amber-400 shrink-0" size={18} />
                <p className="text-sm font-semibold text-foreground">
                    {totalCount} {totalCount === 1 ? "item needs" : "items need"} attention
                </p>
            </div>

            {/* Items */}
            <div className="flex flex-wrap gap-2">
                {items.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.tab)}
                            className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/70 dark:bg-white/5 border border-border/50 hover:border-primary/30 hover:bg-white dark:hover:bg-white/10 transition-all text-sm"
                        >
                            <Icon size={14} className={item.color} />
                            <span className="text-foreground">
                                <span className="font-semibold">{item.count}</span> {item.label}
                            </span>
                            <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default NeedsAttentionBanner;
