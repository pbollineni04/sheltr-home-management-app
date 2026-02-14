
import { useState, useMemo } from "react";
import { Search, Plus, Tag, GripVertical } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { taskTemplates, searchTasks, type TaskTemplate } from "../../data/taskTemplates";

const priorityColors = {
  high: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
  low: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
};

const categoryOptions = ['All', 'Maintenance', 'Projects', 'Shopping'] as const;

/* ── Draggable template card ─────────────────────────── */
const DraggableTemplateCard = ({
  template,
  addingId,
  onAdd,
}: {
  template: TaskTemplate;
  addingId: string | null;
  onAdd: (t: TaskTemplate) => void;
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `template-${template.id}`,
    data: { template },
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-muted/40 border border-border rounded-lg p-4 flex flex-col gap-2"
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <button
            {...listeners}
            {...attributes}
            className="flex-shrink-0 mt-0.5 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Drag to add to board"
          >
            <GripVertical size={14} />
          </button>
          <h4 className="font-semibold text-sm text-foreground">{template.title}</h4>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${priorityColors[template.priority]}`}>
          {template.priority}
        </span>
      </div>
      {template.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
      )}
      <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
        {template.suggested_room && <span>📍 {template.suggested_room}</span>}
        {template.frequency && (
          <span className="flex items-center gap-1">
            <Tag size={10} /> {template.frequency}
          </span>
        )}
      </div>
      <button
        onClick={() => onAdd(template)}
        disabled={addingId === template.id}
        className="mt-auto self-end flex items-center gap-1 text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        <Plus size={14} />
        {addingId === template.id ? "Adding..." : "Add to Board"}
      </button>
    </div>
  );
};

interface TaskLibraryProps {
  selectedList: string;
  onAddTask: (taskData: any) => Promise<boolean>;
}

const TaskLibrary = ({ selectedList, onAddTask }: TaskLibraryProps) => {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [addingId, setAddingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let results = query.length >= 2 ? searchTasks(query) : taskTemplates;
    if (categoryFilter !== "All") {
      results = results.filter(t => t.category === categoryFilter);
    }
    return results;
  }, [query, categoryFilter]);

  // Group by subcategory
  const grouped = useMemo(() => {
    const map = new Map<string, TaskTemplate[]>();
    for (const t of filtered) {
      const key = `${t.category} — ${t.subcategory}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    }
    return map;
  }, [filtered]);

  const handleAdd = async (template: TaskTemplate) => {
    setAddingId(template.id);
    const dueDate = template.due_date_offset_days
      ? new Date(Date.now() + template.due_date_offset_days * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0]
      : undefined;

    await onAddTask({
      title: template.title,
      description: template.description ?? "",
      list_type: selectedList as 'maintenance' | 'projects' | 'shopping',
      priority: template.priority,
      due_date: dueDate ?? "",
      room: template.suggested_room ?? "",
      completed: false,
      status: 'todo',
    });
    setAddingId(null);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <input
          type="text"
          placeholder="Search templates..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Category chips */}
      <div className="flex gap-2 flex-wrap">
        {categoryOptions.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              categoryFilter === cat
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">Drag a template onto a column to add it</p>

      {/* Results — scrollable */}
      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-8 text-sm">No templates match your search.</p>
      ) : (
        <div className="max-h-[400px] overflow-y-auto space-y-6 pr-1">
          {Array.from(grouped.entries()).map(([group, templates]) => (
            <div key={group}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">{group}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {templates.map(template => (
                  <DraggableTemplateCard
                    key={template.id}
                    template={template}
                    addingId={addingId}
                    onAdd={handleAdd}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskLibrary;
