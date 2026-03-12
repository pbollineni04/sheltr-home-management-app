import { useEffect, useState, useCallback } from "react";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import {
    DollarSign,
    CheckSquare,
    Calendar,
    FileText,
    Clock,
    Plus,
    Search,
    Command as CommandIcon,
} from "lucide-react";

interface QuickAddProps {
    onNavigate: (tab: string) => void;
}

const QuickAdd = ({ onNavigate }: QuickAddProps) => {
    const [open, setOpen] = useState(false);

    // Listen for Ctrl+K / Cmd+K
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    const handleSelect = useCallback(
        (tab: string) => {
            setOpen(false);
            onNavigate(tab);
        },
        [onNavigate]
    );

    const actions = [
        {
            id: "add-expense",
            label: "Add Expense",
            description: "Log a new household expense",
            icon: DollarSign,
            tab: "expenses",
            color: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-100 dark:bg-green-900/40",
        },
        {
            id: "add-task",
            label: "Add Task",
            description: "Create a new to-do item",
            icon: CheckSquare,
            tab: "tasks",
            color: "text-orange-600 dark:text-orange-400",
            bgColor: "bg-orange-100 dark:bg-orange-900/40",
        },
        {
            id: "schedule-service",
            label: "Schedule Service",
            description: "Book a home service appointment",
            icon: Calendar,
            tab: "services",
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-100 dark:bg-blue-900/40",
        },
        {
            id: "upload-document",
            label: "Upload Document",
            description: "Store a warranty, receipt, or contract",
            icon: FileText,
            tab: "vault",
            color: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-100 dark:bg-purple-900/40",
        },
        {
            id: "add-timeline",
            label: "Add Timeline Event",
            description: "Record something that happened to your home",
            icon: Clock,
            tab: "timeline",
            color: "text-indigo-600 dark:text-indigo-400",
            bgColor: "bg-indigo-100 dark:bg-indigo-900/40",
        },
    ];

    return (
        <>
            {/* Floating Action Button (mobile-friendly) */}
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center lg:hidden"
                aria-label="Quick Add"
            >
                <Plus size={24} />
            </button>

            {/* Desktop keyboard hint */}
            <button
                onClick={() => setOpen(true)}
                className="hidden lg:flex fixed bottom-6 right-6 z-50 items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl shadow-lg hover:shadow-xl hover:border-primary/30 transition-all text-sm text-muted-foreground group"
            >
                <Plus size={16} className="text-primary" />
                <span>Quick Add</span>
                <kbd className="ml-2 px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono font-medium border border-border group-hover:border-primary/30">
                    Ctrl+K
                </kbd>
            </button>

            {/* Command Palette Overlay */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
                            onClick={() => setOpen(false)}
                        />

                        {/* Command Dialog */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: -10 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="fixed inset-x-4 top-[20vh] z-[70] mx-auto max-w-lg"
                        >
                            <Command
                                className="bg-card rounded-xl shadow-2xl border border-border overflow-hidden"
                                label="Quick Add"
                            >
                                {/* Search Input */}
                                <div className="flex items-center gap-3 px-4 border-b border-border">
                                    <Search size={18} className="text-muted-foreground shrink-0" />
                                    <Command.Input
                                        placeholder="What do you want to do?"
                                        className="w-full py-4 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                                    />
                                </div>

                                {/* Actions List */}
                                <Command.List className="py-2 px-2 max-h-[50vh] overflow-y-auto">
                                    <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
                                        No actions found.
                                    </Command.Empty>

                                    <Command.Group heading="Quick Actions" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 py-1.5">
                                        {actions.map((action) => {
                                            const Icon = action.icon;
                                            return (
                                                <Command.Item
                                                    key={action.id}
                                                    value={action.label}
                                                    onSelect={() => handleSelect(action.tab)}
                                                    className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer text-sm
                            hover:bg-muted/80 data-[selected=true]:bg-muted/80
                            transition-colors group"
                                                >
                                                    <div className={`p-2 rounded-lg ${action.bgColor} shrink-0`}>
                                                        <Icon size={18} className={action.color} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-foreground">{action.label}</p>
                                                        <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 group-data-[selected=true]:opacity-100 transition-opacity">
                                                        Enter ↵
                                                    </span>
                                                </Command.Item>
                                            );
                                        })}
                                    </Command.Group>
                                </Command.List>

                                {/* Footer */}
                                <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/30">
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">↑↓</kbd>
                                            Navigate
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">↵</kbd>
                                            Select
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">Esc</kbd>
                                    </button>
                                </div>
                            </Command>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default QuickAdd;
