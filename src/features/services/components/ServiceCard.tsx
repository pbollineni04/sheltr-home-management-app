import { Calendar, Clock, DollarSign, MapPin, Trash2, Edit, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ServiceStatusBadge } from './ServiceStatusBadge';
import type { Service } from '../types';
import { SERVICE_CATEGORY_LABELS } from '../types';

interface ServiceCardProps {
    service: Service;
    onComplete: (id: string) => void;
    onCancel: (id: string) => void;
    onEdit: (service: Service) => void;
    onDelete: (id: string) => void;
}

export const ServiceCard = ({ service, onComplete, onCancel, onEdit, onDelete }: ServiceCardProps) => {
    const isOverdue = service.status === 'scheduled' && new Date(service.scheduled_date) < new Date(new Date().toDateString());
    const displayStatus = isOverdue ? 'overdue' as const : service.status;
    const isPast = service.status === 'completed' || service.status === 'cancelled';

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <Card className={`group hover:shadow-md transition-shadow ${isPast ? 'opacity-70' : ''} ${isOverdue ? 'border-red-500/30' : ''}`}>
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <h3 className="font-semibold text-foreground">{service.title}</h3>
                            <ServiceStatusBadge status={displayStatus} />
                            <Badge variant="outline" className="text-xs">
                                {SERVICE_CATEGORY_LABELS[service.category]}
                            </Badge>
                        </div>

                        {/* Provider */}
                        {service.provider && (
                            <p className="text-sm text-muted-foreground mb-1.5">
                                by <span className="text-foreground font-medium">{service.provider.name}</span>
                            </p>
                        )}

                        {/* Details row */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <Calendar size={13} />
                                {formatDate(service.scheduled_date)}
                            </span>
                            {service.scheduled_time && (
                                <span className="flex items-center gap-1.5">
                                    <Clock size={13} />
                                    {service.scheduled_time.slice(0, 5)}
                                </span>
                            )}
                            {service.room && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin size={13} />
                                    {service.room}
                                </span>
                            )}
                            {(service.estimated_cost || service.actual_cost) && (
                                <span className="flex items-center gap-1.5">
                                    <DollarSign size={13} />
                                    {service.actual_cost
                                        ? `$${service.actual_cost.toFixed(2)}`
                                        : `~$${service.estimated_cost?.toFixed(2)}`}
                                </span>
                            )}
                        </div>

                        {service.description && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{service.description}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!isPast && (
                            <>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600" onClick={() => onComplete(service.id)} title="Mark complete">
                                    <CheckCircle2 size={14} />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-orange-500" onClick={() => onCancel(service.id)} title="Cancel">
                                    <XCircle size={14} />
                                </Button>
                            </>
                        )}
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(service)} title="Edit">
                            <Edit size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete(service.id)} title="Delete">
                            <Trash2 size={14} />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
