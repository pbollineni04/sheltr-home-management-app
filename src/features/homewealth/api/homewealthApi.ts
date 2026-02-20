import { supabase } from "@/integrations/supabase/client";

export type PropertyType = 'single_family' | 'multi_family' | 'condo' | 'townhouse' | 'other';

export interface Property {
    id: string;
    user_id: string;
    address_line1: string;
    address_line2?: string | null;
    city: string;
    state: string;
    zip_code: string;
    property_type: PropertyType;
    year_built?: number | null;
    sqft?: number | null;
    lot_size?: number | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    purchase_price?: number | null;
    purchase_date?: string | null;
    current_value?: number | null;
    current_mortgage_debt?: number | null;
    interest_rate?: number | null;
    loan_term_years: number;
    monthly_rental_income?: number | null;
    estimated_monthly_expenses?: number | null;
    property_taxes?: number | null;
    tax_year?: number | null;
    last_sale_price?: number | null;
    last_sale_date?: string | null;
    last_avm_sync?: string | null;
    created_at: string;
    updated_at: string;
}

export interface PropertyImprovement {
    id: string;
    property_id: string;
    user_id: string;
    name: string;
    type?: string | null;
    cost: number;
    estimated_roi?: number | null;
    completed: boolean;
    completion_date?: string | null;
    is_planned: boolean;
    created_at: string;
    updated_at: string;
}

export interface PropertyValueHistory {
    id: string;
    property_id: string;
    user_id: string;
    recorded_date: string;
    property_value: number;
    mortgage_debt?: number | null;
    equity?: number | null;
    source: string;
}

export interface ComparableSale {
    id: string;
    property_id: string;
    user_id: string;
    address: string;
    sold_price: number;
    sold_date: string;
    sqft?: number | null;
    price_per_sqft?: number | null;
    distance_miles?: number | null;
    similarity_score?: number | null;
    source: string;
}

export const homewealthApi = {
    // Properties
    async getProperties() {
        const { data, error } = await (supabase as any)
            .from('properties')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching properties:", error);
            return []; // Gracefully fallback to empty state
        }
        return data as Property[];
    },

    async getProperty(id: string) {
        const { data, error } = await (supabase as any)
            .from('properties')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Property;
    },

    async createProperty(property: Partial<Property>) {
        const { data, error } = await (supabase as any)
            .from('properties')
            .insert(property)
            .select()
            .single();

        if (error) throw error;
        return data as Property;
    },

    async updateProperty(id: string, updates: Partial<Property>) {
        const { data, error } = await (supabase as any)
            .from('properties')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Property;
    },

    // Improvements
    async getImprovements(propertyId: string) {
        const { data, error } = await (supabase as any)
            .from('property_improvements')
            .select('*')
            .eq('property_id', propertyId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data as PropertyImprovement[];
    },

    async toggleImprovementCompleted(id: string, completed: boolean) {
        const { data, error } = await (supabase as any)
            .from('property_improvements')
            .update({ completed })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as PropertyImprovement;
    },

    // History
    async getEquityHistory(propertyId: string) {
        const { data, error } = await (supabase as any)
            .from('property_value_history')
            .select('*')
            .eq('property_id', propertyId)
            .order('recorded_date', { ascending: true });

        if (error) throw error;
        return data as PropertyValueHistory[];
    },

    // Comps
    async getComparableSales(propertyId: string) {
        const { data, error } = await (supabase as any)
            .from('comparable_sales')
            .select('*')
            .eq('property_id', propertyId)
            .order('sold_date', { ascending: false });

        if (error) throw error;
        return data as ComparableSale[];
    },

    // RentCast Sync via Edge Function
    async syncPropertyWithRentCast(propertyId: string) {
        const { data, error } = await supabase.functions.invoke('rentcast-sync', {
            body: { propertyId },
        });

        if (error) throw error;
        return data;
    },
};
