import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { homewealthApi, Property, PropertyImprovement } from "./homewealthApi";
import { useAuth } from "@/contexts/AuthContext";

export const useProperties = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['homewealth-properties', user?.id],
        queryFn: () => homewealthApi.getProperties(),
        enabled: !!user,
        retry: false,
    });
};

export const useProperty = (propertyId?: string) => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['homewealth-property', propertyId],
        queryFn: () => propertyId ? homewealthApi.getProperty(propertyId) : Promise.reject('No ID'),
        enabled: !!user && !!propertyId,
        retry: false,
    });
};

export const useImprovements = (propertyId?: string) => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['homewealth-improvements', propertyId],
        queryFn: () => propertyId ? homewealthApi.getImprovements(propertyId) : Promise.resolve([]),
        enabled: !!user && !!propertyId,
        retry: false,
    });
};

export const useEquityHistory = (propertyId?: string) => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['homewealth-equity', propertyId],
        queryFn: () => propertyId ? homewealthApi.getEquityHistory(propertyId) : Promise.resolve([]),
        enabled: !!user && !!propertyId,
        retry: false,
    });
};

export const useComparableSales = (propertyId?: string) => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['homewealth-comps', propertyId],
        queryFn: () => propertyId ? homewealthApi.getComparableSales(propertyId) : Promise.resolve([]),
        enabled: !!user && !!propertyId,
        retry: false,
    });
};

// Mutations
export const useToggleImprovement = (propertyId?: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, completed }: { id: string, completed: boolean }) =>
            homewealthApi.toggleImprovementCompleted(id, completed),
        onSuccess: () => {
            // Invalidate the improvements list
            queryClient.invalidateQueries({ queryKey: ['homewealth-improvements', propertyId] });
            // In a real app with cached combined calculations, we might invalidate property too
        },
    });
};

export const useUpdateProperty = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string, updates: Partial<Property> }) =>
            homewealthApi.updateProperty(id, updates),
        onSuccess: (updatedProperty) => {
            queryClient.invalidateQueries({ queryKey: ['homewealth-property', updatedProperty.id] });
            queryClient.invalidateQueries({ queryKey: ['homewealth-properties', user?.id] });
        },
    });
};

export const useCreateProperty = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: (newProperty: Partial<Property>) => {
            if (!user) throw new Error("Must be logged in to create property");
            return homewealthApi.createProperty({ ...newProperty, user_id: user.id });
        },
        onSuccess: (newProperty) => {
            queryClient.invalidateQueries({ queryKey: ['homewealth-properties', user?.id] });
            // Auto-trigger RentCast sync for new properties
            if (newProperty?.id) {
                homewealthApi.syncPropertyWithRentCast(newProperty.id)
                    .then(() => {
                        queryClient.invalidateQueries({ queryKey: ['homewealth-properties', user?.id] });
                        queryClient.invalidateQueries({ queryKey: ['homewealth-property', newProperty.id] });
                        queryClient.invalidateQueries({ queryKey: ['homewealth-equity', newProperty.id] });
                        queryClient.invalidateQueries({ queryKey: ['homewealth-comps', newProperty.id] });
                    })
                    .catch((err) => console.warn("Auto-sync failed, user can retry manually:", err));
            }
        },
    });
};

export const useSyncProperty = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: (propertyId: string) => homewealthApi.syncPropertyWithRentCast(propertyId),
        onSuccess: (_data, propertyId) => {
            // Invalidate everything so the UI picks up the new data
            queryClient.invalidateQueries({ queryKey: ['homewealth-properties', user?.id] });
            queryClient.invalidateQueries({ queryKey: ['homewealth-property', propertyId] });
            queryClient.invalidateQueries({ queryKey: ['homewealth-equity', propertyId] });
            queryClient.invalidateQueries({ queryKey: ['homewealth-comps', propertyId] });
        },
    });
};
