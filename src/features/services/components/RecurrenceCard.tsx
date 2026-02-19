import { Calendar, DollarSign, Pause, Play, Trash2, Edit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ServiceRecurrence } from '../types';
import { SERVICE_CATEGORY_LABELS, SERVICE_FREQUENCY_LABELS } from '../types';

interface RecurrenceCardProps {
    recurrence: ServiceRecurrence;
    onToggleActive: (id: string) => void;
    onEdit: (recurrence: ServiceRecurrence) => void;
    onDelete: (id: string) => void;
}

export const RecurrenceCard = ({ recurrence, onToggleActive, onEdit, onDelete }: RecurrenceCardProps) => {
    const nextDue = new Date(recurrence.next_due_date + 'T00:00:00');
    const today = new Date(new Date().toDateString());
    const daysUntil = Math.ceil((nextDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const daysLabel = daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : daysUntil < 0 ? `${Math.abs(daysUntil)}d overdue` : `In ${daysUntil} days`;
    const isOverdue = daysUntil < 0 && recurrence.is_active;

    return (
        <Card className={`group hover:shadow-md transition-shadow ${!recurrence.is_active ? 'opacity-50' : ''} ${isOverdue ? 'border-red-500/30' : ''}`}>
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <h3 className="font-semibold text-foreground">{recurrence.title}</h3>
                            <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20">
                                {SERVICE_FREQUENCY_LABELS[recurrence.frequency]}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                                {SERVICE_CATEGORY_LABELS[recurrence.category]}
                            </Badge>
                            {!recurrence.is_active && (
                                <Badge variant="outline" className="text-xs bg-gray-500/10 text-gray-500 border-gray-500/20">Paused</Badge>
                            )}
                        </div>

                        {recurrence.provider && (
                            <p className="text-sm text-muted-foreground mb-1.5">
                                Provider: <span className="text-foreground font-medium">{recurrence.provider.name}</span>
                            </p>
                        )}

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-500 font-medium' : daysUntil <= 7 ? 'text-orange-500' : ''}`}>
                                <Calendar size={13} />
                                Next: {daysLabel}
                            </span>
                            {recurrence.estimated_cost && (
                                <span className="flex items-center gap-1.5">
                                    <DollarSign size={13} />
                                    ~${recurrence.estimated_cost.toFixed(2)} / occurrence
                                </span>
                            )}
                        </div>

                        {recurrence.description && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{recurrence.description}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onToggleActive(recurrence.id)} title={recurrence.is_active ? 'Pause' : 'Resume'}>
                            {recurrence.is_active ? <Pause size={14} /> : <Play size={14} />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(recurrence)}>
                            <Edit size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete(recurrence.id)}>
                            <Trash2 size={14} />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
