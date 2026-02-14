
import { useState } from "react";

interface InlineAddTaskFormProps {
    selectedList: string;
    onAddTask: (taskData: any) => Promise<boolean>;
    onClose: () => void;
}

const InlineAddTaskForm = ({ selectedList, onAddTask, onClose }: InlineAddTaskFormProps) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium' as 'low' | 'medium' | 'high',
        dueDate: new Date().toISOString().split('T')[0],
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        setLoading(true);
        const success = await onAddTask({
            title: formData.title,
            description: formData.description,
            list_type: selectedList as 'maintenance' | 'projects' | 'shopping',
            priority: formData.priority,
            due_date: formData.dueDate,
            completed: false,
        });

        if (success) {
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                dueDate: new Date().toISOString().split('T')[0],
            });
            onClose();
        }
        setLoading(false);
    };

    return (
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border micro-fade-in">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Add New Task</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Task Title</label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground placeholder-muted-foreground"
                        placeholder="Enter task title"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground placeholder-muted-foreground"
                        placeholder="Enter task description"
                        rows={3}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Priority</label>
                        <select
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Due Date</label>
                        <input
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                        />
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading || !formData.title.trim()}
                        className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:brightness-90 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Adding...' : 'Add Task'}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-muted text-muted-foreground px-6 py-2 rounded-lg hover:bg-muted/80 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InlineAddTaskForm;
