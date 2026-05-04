import {
  DollarSign,
  CheckSquare,
  FileText,
  Wrench,
  Clock,
  X,
  Link2,
} from "lucide-react";
import { getLinkedEntities, type LinkedEntity, type EntityType } from "@/lib/entityLinking";

interface LinkedEntitiesChipProps {
  metadata: Record<string, unknown> | null | undefined;
  onNavigate?: (tab: string) => void;
  onUnlink?: (type: EntityType, id: string) => void;
  compact?: boolean;
}

const TYPE_CONFIG: Record<string, {
  icon: typeof DollarSign;
  color: string;
  tab: string;
}> = {
  expense: { icon: DollarSign, color: "text-green-600 dark:text-green-400", tab: "expenses" },
  task: { icon: CheckSquare, color: "text-orange-600 dark:text-orange-400", tab: "tasks" },
  document: { icon: FileText, color: "text-blue-600 dark:text-blue-400", tab: "vault" },
  service: { icon: Wrench, color: "text-purple-600 dark:text-purple-400", tab: "services" },
  timeline_event: { icon: Clock, color: "text-muted-foreground", tab: "timeline" },
};

const LinkedEntitiesChip = ({
  metadata,
  onNavigate,
  onUnlink,
  compact = false,
}: LinkedEntitiesChipProps) => {
  const links = getLinkedEntities(metadata);

  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {!compact && (
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider">
          <Link2 size={10} />
          Linked
        </span>
      )}
      {links.map((link: LinkedEntity) => {
        const config = TYPE_CONFIG[link.type] || TYPE_CONFIG.timeline_event;
        const Icon = config.icon;

        return (
          <span
            key={`${link.type}-${link.id}`}
            className="group inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/70 border border-border/50 text-xs cursor-pointer hover:border-primary/30 hover:bg-muted transition-all"
            onClick={() => onNavigate?.(config.tab)}
          >
            <Icon size={10} className={config.color} />
            <span className="text-foreground truncate max-w-[120px]">
              {link.label}
            </span>
            {link.confidence === 'medium' && (
              <span
                className="w-1.5 h-1.5 rounded-full border border-current opacity-50"
                title="AI-suggested link"
              />
            )}
            {link.confidence === 'high' && (
              <span
                className="w-1.5 h-1.5 rounded-full bg-current opacity-30"
                title="Auto-linked"
              />
            )}
            {onUnlink && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUnlink(link.type, link.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-0.5"
              >
                <X size={10} className="text-muted-foreground hover:text-destructive" />
              </button>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default LinkedEntitiesChip;
