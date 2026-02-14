
import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    CheckCircle2,
    Clock,
    Circle,
    Loader2,
    BookOpen,
} from "lucide-react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable,
    type DragStartEvent,
    type DragEndEvent,
} from "@dnd-kit/core";
import { useTasks, type Task, type TaskStatus } from "../hooks/useTasks";
import TaskCard from "./tasks/TaskCard";
import TaskLibrary from "./tasks/TaskLibrary";
import TaskListSelector from "./tasks/TaskListSelector";
import QuickAddTask from "./tasks/QuickAddTask";
import InlineAddTaskForm from "./tasks/InlineAddTaskForm";
import EmptyTasksState from "./tasks/EmptyTasksState";
import TaskBundles from "./tasks/TaskBundles";
import TaskTemplateSelector from "./tasks/TaskTemplateSelector";
import AddTaskDialog from "./AddTaskDialog";
import type { TaskTemplate } from "../data/taskTemplates";
import { staggerContainer, staggerContainerFast, fadeUpItem, listItemAnim } from "@/lib/motion";

/* ── Droppable column wrapper ────────────────────────────── */
const DroppableColumn = ({ id, children }: { id: string; children: (isOver: boolean) => React.ReactNode }) => {
    const { setNodeRef, isOver } = useDroppable({ id });
    return <div ref={setNodeRef}>{children(isOver)}</div>;
};

const TasksLists = () => {
    const { tasks, loading, addTask, deleteTask, toggleTaskComplete, updateTaskStatus } = useTasks();
    const [selectedList, setSelectedList] = useState("maintenance");
    const [showAddForm, setShowAddForm] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const [showBundles, setShowBundles] = useState(false);
    const [showLibrary, setShowLibrary] = useState(false);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [activeTemplate, setActiveTemplate] = useState<TaskTemplate | null>(null);

    /* ── DnD sensors ────────────────────────────── */
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    const filteredTasks = tasks.filter((t) => t.list_type === selectedList);

    const todoTasks = filteredTasks.filter((t) => t.status === 'todo');
    const inProgressTasks = filteredTasks.filter((t) => t.status === 'in_progress');
    const completedTasks = filteredTasks.filter((t) => t.status === 'completed');

    const handleToggleComplete = async (taskId: string, completed: boolean) => {
        await toggleTaskComplete(taskId, !completed);
    };

    const handleDelete = async (taskId: string) => {
        await deleteTask(taskId);
    };

    const handleAddTask = async (taskData: any): Promise<boolean> => {
        return await addTask(taskData);
    };

    const handleTemplateTasks = async (templates: TaskTemplate[]) => {
        for (const t of templates) {
            const dueDate = t.due_date_offset_days
                ? new Date(Date.now() + t.due_date_offset_days * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0]
                : undefined;

            await addTask({
                title: t.title,
                description: t.description ?? "",
                list_type: selectedList as "maintenance" | "projects" | "shopping",
                priority: t.priority,
                due_date: dueDate,
                room: t.suggested_room ?? "",
                completed: false,
                status: 'todo',
            });
        }
        setShowTemplates(false);
    };

    const handleBundleAdd = async (bundleTasks: TaskTemplate[]) => {
        await handleTemplateTasks(bundleTasks);
        setShowBundles(false);
    };

    /* ── Build task data from a template ────────────────────── */
    const buildTaskFromTemplate = (template: TaskTemplate, status: TaskStatus) => {
        const dueDate = template.due_date_offset_days
            ? new Date(Date.now() + template.due_date_offset_days * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0]
            : undefined;

        return {
            title: template.title,
            description: template.description ?? "",
            list_type: selectedList as "maintenance" | "projects" | "shopping",
            priority: template.priority,
            due_date: dueDate ?? "",
            room: template.suggested_room ?? "",
            completed: false,
            status,
        };
    };

    /* ── DnD handlers ────────────────────────────── */
    const handleDragStart = (event: DragStartEvent) => {
        const task = event.active.data.current?.task as Task | undefined;
        const template = event.active.data.current?.template as TaskTemplate | undefined;
        setActiveTask(task ?? null);
        setActiveTemplate(template ?? null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveTask(null);
        setActiveTemplate(null);
        const { active, over } = event;
        if (!over) return;

        const newStatus = over.id as TaskStatus;

        // Template drag → create new task
        const template = active.data.current?.template as TaskTemplate | undefined;
        if (template) {
            addTask(buildTaskFromTemplate(template, newStatus));
            return;
        }

        // Task drag → move between columns
        const task = active.data.current?.task as Task | undefined;
        if (!task || task.status === newStatus) return;
        updateTaskStatus(task.id, newStatus);
    };

    // Kanban columns
    const columns = [
        {
            id: 'todo' as TaskStatus,
            title: "To Do",
            tasks: todoTasks,
            icon: Circle,
            iconColor: "text-blue-600 dark:text-blue-400",
            headerBg: "bg-blue-50 dark:bg-blue-950/30",
            headerText: "text-blue-900 dark:text-blue-200",
            statBg: "bg-blue-100 dark:bg-blue-900/40",
        },
        {
            id: 'in_progress' as TaskStatus,
            title: "In Progress",
            tasks: inProgressTasks,
            icon: Clock,
            iconColor: "text-yellow-600 dark:text-yellow-400",
            headerBg: "bg-yellow-50 dark:bg-yellow-950/30",
            headerText: "text-yellow-900 dark:text-yellow-200",
            statBg: "bg-yellow-100 dark:bg-yellow-900/40",
        },
        {
            id: 'completed' as TaskStatus,
            title: "Completed",
            tasks: completedTasks,
            icon: CheckCircle2,
            iconColor: "text-green-600 dark:text-green-400",
            headerBg: "bg-green-50 dark:bg-green-950/30",
            headerText: "text-green-900 dark:text-green-200",
            statBg: "bg-green-100 dark:bg-green-900/40",
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between gap-3"
            >
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Tasks</h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowLibrary(!showLibrary)}
                        className={`text-sm px-3 py-2 flex items-center gap-1 rounded-lg border transition-colors ${showLibrary
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background text-muted-foreground border-border hover:bg-muted'
                            }`}
                    >
                        <BookOpen size={14} />
                        <span className="hidden sm:inline">Library</span>
                    </button>
                    <button
                        onClick={() => setShowBundles(!showBundles)}
                        className="btn-secondary-luxury text-sm px-3 py-2 hidden sm:flex items-center gap-1"
                    >
                        Quick Bundles
                    </button>
                    <button
                        onClick={() => setShowTemplates(!showTemplates)}
                        className="btn-secondary-luxury text-sm px-3 py-2 hidden sm:flex items-center gap-1"
                    >
                        Templates
                    </button>
                    <AddTaskDialog selectedList={selectedList} />
                </div>
            </motion.div>

            {/* List Selector */}
            <TaskListSelector
                selectedList={selectedList}
                onSelectList={setSelectedList}
                tasks={tasks}
            />

            {/* Summary stat cards */}
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                {columns.map((column) => {
                    const Icon = column.icon;
                    return (
                        <motion.div
                            key={column.title}
                            variants={fadeUpItem}
                            className="bg-card p-6 rounded-lg shadow-sm border border-border"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-lg ${column.statBg}`}>
                                    <Icon className={column.iconColor} size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{column.title}</p>
                                    <p className="text-2xl font-bold text-foreground">{column.tasks.length}</p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Quick Add */}
            <QuickAddTask selectedList={selectedList} onAddTask={handleAddTask} />

            {/* Inline Add Form */}
            {showAddForm && (
                <InlineAddTaskForm
                    selectedList={selectedList}
                    onAddTask={handleAddTask}
                    onClose={() => setShowAddForm(false)}
                />
            )}

            {/* Template Selector */}
            {showTemplates && (
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                    <TaskTemplateSelector
                        selectedListType={selectedList as "maintenance" | "projects" | "shopping"}
                        onSelectTasks={handleTemplateTasks}
                        onClose={() => setShowTemplates(false)}
                    />
                </div>
            )}

            {/* Bundles */}
            {showBundles && (
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                    <TaskBundles onAddBundle={handleBundleAdd} />
                </div>
            )}

            {/* DndContext wraps both Library panel and Kanban board */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                {/* Library panel (inline dropdown) */}
                {showLibrary && (
                    <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                        <TaskLibrary selectedList={selectedList} onAddTask={handleAddTask} />
                    </div>
                )}

                {/* Kanban Board */}
                {filteredTasks.length === 0 ? (
                    <EmptyTasksState />
                ) : (
                    <motion.div
                        variants={staggerContainerFast}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    >
                        {columns.map((column) => (
                            <DroppableColumn key={column.id} id={column.id}>
                                {(isOver) => (
                                    <motion.div
                                        variants={fadeUpItem}
                                        className={`bg-card rounded-lg shadow-sm border overflow-hidden transition-colors ${isOver
                                                ? 'border-primary ring-2 ring-primary/20'
                                                : 'border-border'
                                            }`}
                                    >
                                        {/* Column header */}
                                        <div className={`p-4 border-b border-border ${column.headerBg}`}>
                                            <h2 className={`font-semibold ${column.headerText} flex items-center justify-between`}>
                                                <span>{column.title}</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {column.tasks.length}
                                                </Badge>
                                            </h2>
                                        </div>

                                        {/* Column body */}
                                        <div className="p-4 space-y-3 min-h-[120px]">
                                            {column.tasks.length === 0 ? (
                                                <p className="text-muted-foreground text-center py-4 text-sm">No tasks</p>
                                            ) : (
                                                column.tasks.map((task, taskIdx) => (
                                                    <motion.div key={task.id} {...listItemAnim(taskIdx)}>
                                                        <TaskCard
                                                            task={task}
                                                            status={task.status || 'todo'}
                                                            onToggleComplete={handleToggleComplete}
                                                            onDelete={handleDelete}
                                                        />
                                                    </motion.div>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </DroppableColumn>
                        ))}
                    </motion.div>
                )}

                {/* Drag overlay — floating semi-transparent copy */}
                <DragOverlay>
                    {activeTask ? (
                        <div className="opacity-70">
                            <TaskCard
                                task={activeTask}
                                status={activeTask.status || 'todo'}
                                onToggleComplete={async () => { }}
                                onDelete={async () => { }}
                                dragDisabled
                            />
                        </div>
                    ) : activeTemplate ? (
                        <div className="opacity-70 bg-card border border-primary rounded-lg p-3 shadow-lg w-64">
                            <div className="flex items-center justify-between gap-2">
                                <h4 className="font-semibold text-sm text-foreground truncate">{activeTemplate.title}</h4>
                                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${activeTemplate.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' :
                                        activeTemplate.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300' :
                                            'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                                    }`}>
                                    {activeTemplate.priority}
                                </span>
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default TasksLists;
