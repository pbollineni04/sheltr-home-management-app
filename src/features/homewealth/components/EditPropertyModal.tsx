import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUpdateProperty, useCreateProperty } from "../api/queries";
import { Property } from "../api/homewealthApi";
import { useToast } from "@/hooks/use-toast";

const inputClass = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

interface EditPropertyModalProps {
    property?: Property | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const EditPropertyModal: React.FC<EditPropertyModalProps> = ({
    property,
    open,
    onOpenChange,
}) => {
    const updateMutation = useUpdateProperty();
    const createMutation = useCreateProperty();
    const isCreating = !property;
    const { toast } = useToast();

    const [formData, setFormData] = useState<Partial<Property>>(property ? { ...property } : { property_type: 'single_family' });

    // Reset form data when the modal opens or property changes
    useEffect(() => {
        if (open) {
            setFormData(property ? { ...property } : { property_type: 'single_family' });
        }
    }, [open, property]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        // Handle number inputs
        if (type === "number") {
            setFormData((prev) => ({
                ...prev,
                [name]: value === "" ? null : parseFloat(value),
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isCreating) {
            createMutation.mutate(formData, {
                onSuccess: () => {
                    toast({ title: "Property added!", description: "Your property has been saved successfully." });
                    onOpenChange(false);
                },
                onError: (err) => {
                    toast({ title: "Failed to add property", description: err.message, variant: "destructive" });
                },
            });
        } else {
            updateMutation.mutate(
                { id: property!.id, updates: formData },
                {
                    onSuccess: () => {
                        toast({ title: "Property updated!" });
                        onOpenChange(false);
                    },
                    onError: (err) => {
                        toast({ title: "Failed to update", description: err.message, variant: "destructive" });
                    },
                }
            );
        }
    };

    const isPending = updateMutation.isPending || createMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px] overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{isCreating ? "Add Property" : "Edit Property Details"}</DialogTitle>
                    <DialogDescription>
                        {isCreating ? "Enter your home's details to start tracking its value and your wealth." : "Update your home's financial and physical details for accurate HomeWealth tracking."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {/* Location Details */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium leading-none">Location Details</h4>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">Address</label>
                                <input
                                    name="address_line1"
                                    value={formData.address_line1 || ""}
                                    onChange={handleChange}
                                    placeholder="123 Main St"
                                    className={inputClass}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">City</label>
                                    <input name="city" value={formData.city || ""} onChange={handleChange} className={inputClass} required />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">State</label>
                                    <input name="state" value={formData.state || ""} onChange={handleChange} maxLength={2} placeholder="CA" className={inputClass} required />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">ZIP Code</label>
                                    <input name="zip_code" value={formData.zip_code || ""} onChange={handleChange} maxLength={10} placeholder="90210" className={inputClass} required />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Property Details */}
                    <div className="space-y-2 pt-2 border-t">
                        <h4 className="text-sm font-medium leading-none">Property Details</h4>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">Year Built</label>
                                <input type="number" name="year_built" value={formData.year_built || ""} onChange={handleChange} placeholder="2005" className={inputClass} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">Sq. Ft</label>
                                <input type="number" name="sqft" value={formData.sqft || ""} onChange={handleChange} placeholder="2000" className={inputClass} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">Lot Size (sf)</label>
                                <input type="number" name="lot_size" value={formData.lot_size || ""} onChange={handleChange} placeholder="5000" className={inputClass} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">Bedrooms</label>
                                <input type="number" name="bedrooms" value={formData.bedrooms || ""} onChange={handleChange} placeholder="3" className={inputClass} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">Bathrooms</label>
                                <input type="number" name="bathrooms" value={formData.bathrooms || ""} onChange={handleChange} step="0.5" placeholder="2" className={inputClass} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">Property Taxes ($)</label>
                                <input type="number" name="property_taxes" value={formData.property_taxes || ""} onChange={handleChange} placeholder="5200" className={inputClass} />
                            </div>
                        </div>
                    </div>

                    {/* Purchase Info */}
                    <div className="space-y-2 pt-2 border-t">
                        <h4 className="text-sm font-medium leading-none">Purchase Info</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">Purchase Price ($)</label>
                                <input type="number" name="purchase_price" value={formData.purchase_price || ""} onChange={handleChange} placeholder="350000" className={inputClass} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">Purchase Date</label>
                                <input type="date" name="purchase_date" value={formData.purchase_date || ""} onChange={handleChange} className={inputClass} />
                            </div>
                        </div>
                    </div>

                    {/* Financial Data */}
                    <div className="space-y-2 pt-2 border-t">
                        <h4 className="text-sm font-medium leading-none">Financial Data</h4>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">Current Value ($)</label>
                                    <input type="number" name="current_value" value={formData.current_value || ""} onChange={handleChange} className={inputClass} />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">Mortgage Debt ($)</label>
                                    <input type="number" name="current_mortgage_debt" value={formData.current_mortgage_debt || ""} onChange={handleChange} className={inputClass} />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">Interest Rate (%)</label>
                                <input type="number" step="0.01" name="interest_rate" value={formData.interest_rate || ""} onChange={handleChange} placeholder="6.5" className={inputClass} />
                            </div>
                        </div>
                    </div>

                    {/* Rental Potential */}
                    <div className="space-y-2 pt-2 border-t">
                        <h4 className="text-sm font-medium leading-none">Rental Potential</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">Monthly Rent ($)</label>
                                <input type="number" name="monthly_rental_income" value={formData.monthly_rental_income || ""} onChange={handleChange} className={inputClass} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">Est. Expenses ($)</label>
                                <input type="number" name="estimated_monthly_expenses" value={formData.estimated_monthly_expenses || ""} onChange={handleChange} className={inputClass} />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : isCreating ? "Add Property" : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
