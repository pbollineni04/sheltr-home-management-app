import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";

interface TransactionReviewModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onReviewComplete: () => void;
}

export const TransactionReviewModal = ({
    isOpen,
    onOpenChange,
    onReviewComplete,
}: TransactionReviewModalProps) => {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);

    // Edit state for the current expense being reviewed
    const [currentExpenseIndex, setCurrentExpenseIndex] = useState(0);
    const [editedCategory, setEditedCategory] = useState<string>("");
    const [editedDescription, setEditedDescription] = useState<string>("");

    const currentExpense = expenses[currentExpenseIndex];

    // Fetch expenses needing review
    useEffect(() => {
        if (isOpen) {
            fetchExpenses();
        }
    }, [isOpen]);

    // Update edit state when current expense changes
    useEffect(() => {
        if (currentExpense) {
            setEditedCategory(currentExpense.category);
            setEditedDescription(currentExpense.vendor || currentExpense.description);
        }
    }, [currentExpense]);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("expenses")
                .select("*")
                .eq("needs_review", true)
                .order("date", { ascending: false });

            if (error) throw error;
            setExpenses(data || []);
            setCurrentExpenseIndex(0);
        } catch (error) {
            console.error("Error fetching expenses:", error);
            toast.error("Failed to load transactions for review");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!currentExpense) return;

        setProcessingId(currentExpense.id);
        try {
            const { error } = await supabase
                .from("expenses")
                .update({
                    category: editedCategory as any,
                    description: editedDescription, // We might update description if user changed it
                    vendor: editedDescription,      // Also update vendor for consistency
                    needs_review: false,
                })
                .eq("id", currentExpense.id);

            if (error) throw error;

            toast.success("Transaction approved");

            // Remove approved expense from local state
            const newExpenses = [...expenses];
            newExpenses.splice(currentExpenseIndex, 1);
            setExpenses(newExpenses);

            // If we approved the last item, close modal
            if (newExpenses.length === 0) {
                onOpenChange(false);
                onReviewComplete();
            } else if (currentExpenseIndex >= newExpenses.length) {
                // If we were at the end, go to the new end
                setCurrentExpenseIndex(newExpenses.length - 1);
            }
        } catch (error) {
            console.error("Error approving expense:", error);
            toast.error("Failed to approve transaction");
        } finally {
            setProcessingId(null);
        }
    };

    const handleSkip = () => {
        if (currentExpenseIndex < expenses.length - 1) {
            setCurrentExpenseIndex(currentExpenseIndex + 1);
        } else {
            setCurrentExpenseIndex(0); // Loop back to start
        }
    };

    // Categories same as DB enum
    const categories = [
        "renovation",
        "maintenance",
        "appliances",
        "services",
        "utilities",
        "uncategorized"
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Review Transactions</DialogTitle>
                    <DialogDescription>
                        {expenses.length} transaction{expenses.length !== 1 ? 's' : ''} require your review to confirm categories.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                ) : expenses.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Check className="w-12 h-12 mx-auto mb-2 text-green-500" />
                        <p>All catchy up! No transactions to review.</p>
                    </div>
                ) : currentExpense ? (
                    <div className="space-y-6 py-4">
                        {/* Transaction Details Card */}
                        <div className="bg-muted/50 p-4 rounded-lg space-y-2 border">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-sm text-muted-foreground">
                                        {format(new Date(currentExpense.date), "MMM d, yyyy")}
                                    </div>
                                    <div className="font-medium text-lg">
                                        {currentExpense.description}
                                    </div>
                                    {currentExpense.metadata?.original_name && (
                                        <div className="text-xs text-muted-foreground mt-1">
                                            Original: {currentExpense.metadata.original_name}
                                        </div>
                                    )}
                                </div>
                                <div className="text-xl font-bold">
                                    ${currentExpense.amount.toFixed(2)}
                                </div>
                            </div>
                        </div>

                        {/* Edit Form */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="vendor">Merchant / Vendor</Label>
                                <Input
                                    id="vendor"
                                    value={editedDescription}
                                    onChange={(e) => setEditedDescription(e.target.value)}
                                    placeholder="Enter merchant name"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={editedCategory}
                                    onValueChange={setEditedCategory}
                                >
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Progress Indicator */}
                        <div className="text-xs text-center text-muted-foreground">
                            Reviewing {currentExpenseIndex + 1} of {expenses.length}
                        </div>
                    </div>
                ) : null}

                <DialogFooter className="gap-2 sm:gap-0">
                    {expenses.length > 0 && (
                        <>
                            {expenses.length > 1 && (
                                <Button variant="outline" onClick={handleSkip} disabled={!!processingId}>
                                    Skip for now
                                </Button>
                            )}
                            <Button
                                onClick={handleApprove}
                                className="w-full sm:w-auto"
                                disabled={!!processingId}
                            >
                                {processingId ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    <Check className="w-4 h-4 mr-2" />
                                )}
                                Approve
                            </Button>
                        </>
                    )}
                    {expenses.length === 0 && (
                        <Button onClick={() => onOpenChange(false)} className="w-full">
                            Close
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
