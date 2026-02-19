import { Badge } from '@/components/ui/badge';
import type { ServiceStatus } from '../types';
import { SERVICE_STATUS_LABELS } from '../types';

const statusStyles: Record<ServiceStatus, string> = {
    scheduled: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20',
    needs_reschedule: 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/20',
    in_progress: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
    completed: 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20',
    cancelled: 'bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/20',
    overdue: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20',
};

interface ServiceStatusBadgeProps {
    status: ServiceStatus;
}

export const ServiceStatusBadge = ({ status }: ServiceStatusBadgeProps) => (
    <Badge variant="outline" className={`text-xs font-medium ${statusStyles[status]}`}>
        {SERVICE_STATUS_LABELS[status]}
    </Badge>
);
