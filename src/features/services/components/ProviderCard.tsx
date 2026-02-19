import { Star, Phone, Mail, Globe, Heart, Trash2, Edit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ServiceProvider } from '../types';
import { SERVICE_CATEGORY_LABELS } from '../types';

interface ProviderCardProps {
    provider: ServiceProvider;
    onToggleFavorite: (id: string) => void;
    onEdit: (provider: ServiceProvider) => void;
    onDelete: (id: string) => void;
}

export const ProviderCard = ({ provider, onToggleFavorite, onEdit, onDelete }: ProviderCardProps) => {
    const stars = Array.from({ length: 5 }, (_, i) => i < (provider.rating || 0));

    return (
        <Card className="group hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground truncate">{provider.name}</h3>
                            <button
                                onClick={() => onToggleFavorite(provider.id)}
                                className="flex-shrink-0"
                            >
                                <Heart
                                    size={16}
                                    className={provider.is_favorite
                                        ? 'fill-red-500 text-red-500'
                                        : 'text-muted-foreground hover:text-red-400 transition-colors'}
                                />
                            </button>
                        </div>

                        <Badge variant="outline" className="text-xs mb-2">
                            {SERVICE_CATEGORY_LABELS[provider.category]}
                        </Badge>

                        {/* Rating stars */}
                        {provider.rating && (
                            <div className="flex items-center gap-0.5 mb-2">
                                {stars.map((filled, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        className={filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Contact info */}
                        <div className="space-y-1 text-sm text-muted-foreground">
                            {provider.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone size={13} />
                                    <a href={`tel:${provider.phone}`} className="hover:text-foreground transition-colors">
                                        {provider.phone}
                                    </a>
                                </div>
                            )}
                            {provider.email && (
                                <div className="flex items-center gap-2">
                                    <Mail size={13} />
                                    <a href={`mailto:${provider.email}`} className="hover:text-foreground transition-colors truncate">
                                        {provider.email}
                                    </a>
                                </div>
                            )}
                            {provider.website && (
                                <div className="flex items-center gap-2">
                                    <Globe size={13} />
                                    <a href={provider.website} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors truncate">
                                        {provider.website.replace(/^https?:\/\//, '')}
                                    </a>
                                </div>
                            )}
                        </div>

                        {provider.notes && (
                            <p className="text-xs text-muted-foreground mt-2 italic line-clamp-2">{provider.notes}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(provider)}>
                            <Edit size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete(provider.id)}>
                            <Trash2 size={14} />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
