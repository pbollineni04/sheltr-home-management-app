import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Sparkles, Edit } from 'lucide-react';
import { useTasks } from "../hooks/useTasks";
import TaskTemplateSelector from "./tasks/TaskTemplateSelector";
import TaskBundles from "./tasks/TaskBundles";
import type { TaskTemplate } from "../data/taskTemplates";
import { searchTasks } from "../data/taskTemplates";

interface AddTaskDialogProps {
  selectedList: string;
}

const AddTaskDialog = ({ selectedList }: AddTaskDialogProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("templates");
  const [suggestions, setSuggestions] = useState<TaskTemplate[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    due_date: '',
    room: ''
  });
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const { addTask } = useTasks();

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    
    const success = await addTask({
      title: formData.title,
      description: formData.description ?? "",
      list_type: selectedList as 'maintenance' | 'projects' | 'shopping',
      priority: formData.priority,
      due_date: formData.due_date ?? "",
      room: formData.room ?? "",
      completed: false
    });

    if (success) {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        due_date: '',
        room: ''
      });
      setOpen(false);
    }
    
    setLoading(false);
  };

  const applyTemplateToForm = (template: TaskTemplate) => {
    let dueDateStr: string = "";
    if (template.due_date_offset_days) {
      dueDateStr = new Date(Date.now() + template.due_date_offset_days * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
    }
    setFormData(prev => ({
      ...prev,
      title: template.title,
      description: template.description ?? "",
      priority: template.priority,
      due_date: dueDateStr,
      room: template.suggested_room ?? ""
    }));
    setShowSuggestions(false);
  };

  const handleTemplateSelect = async (templates: TaskTemplate[]) => {
    setLoading(true);
    
    for (const template of templates as TaskTemplate[]) {
      const dueDate = template.due_date_offset_days 
        ? new Date(Date.now() + template.due_date_offset_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        : undefined;

      await addTask({
        title: template.title,
        description: template.description ?? "",
        list_type: selectedList as 'maintenance' | 'projects' | 'shopping',
        priority: template.priority,
        due_date: dueDate ?? "",
        room: template.suggested_room ?? "",
        completed: false
      });
    }
    
    setLoading(false);
    setOpen(false);
  };

  const handleBundleAdd = (bundleTasks: TaskTemplate[]) => {
    handleTemplateSelect(bundleTasks);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-primary-luxury">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 card-luxury">
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Quick Select
            </TabsTrigger>
            <TabsTrigger value="bundles" className="flex items-center gap-2">
              📦 Bundles
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Custom
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="mt-4">
            <TaskTemplateSelector
              selectedListType={selectedList as 'maintenance' | 'projects' | 'shopping'}
              onSelectTasks={handleTemplateSelect}
              onClose={() => setOpen(false)}
            />
          </TabsContent>

          <TabsContent value="bundles" className="mt-4">
            <TaskBundles onAddBundle={handleBundleAdd} />
          </TabsContent>

          <TabsContent value="custom" className="mt-4">
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div className="space-y-2 relative">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, title: value }));
                    if (value.length >= 2) {
                      const results = searchTasks(value).filter(t => t.list_type === (selectedList as 'maintenance' | 'projects' | 'shopping'));
                      setSuggestions(results.slice(0, 6));
                      setShowSuggestions(results.length > 0);
                      setActiveIndex(0);
                    } else {
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }
                  }}
                  placeholder="Enter task title"
                  required
                  className="input-luxury"
                  onFocus={() => {
                    if (formData.title.length >= 2 && suggestions.length > 0) setShowSuggestions(true);
                  }}
                  onBlur={() => {
                    // Delay to allow click on suggestion
                    setTimeout(() => setShowSuggestions(false), 120);
                  }}
                  onKeyDown={(e) => {
                    if (!showSuggestions || suggestions.length === 0) return;
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setActiveIndex((prev) => (prev + 1) % suggestions.length);
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
                    } else if (e.key === 'Enter') {
                      e.preventDefault();
                      const chosen = suggestions[activeIndex] ?? suggestions[0];
                      if (chosen) applyTemplateToForm(chosen);
                    } else if (e.key === 'Escape') {
                      setShowSuggestions(false);
                    }
                  }}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 z-50 mt-1 card-luxury p-2">
                    {suggestions.map((t, idx) => (
                      <button
                        key={t.id}
                        type="button"
                        className={`w-full text-left px-3 py-2 rounded hover:bg-neutral-50 focus:bg-neutral-50 ${idx === activeIndex ? 'bg-neutral-50' : ''}`}
                        onMouseDown={() => applyTemplateToForm(t)}
                        onMouseEnter={() => setActiveIndex(idx)}
                      >
                        <div className="text-sm font-medium text-neutral-800">{t.title}</div>
                        {t.description && (
                          <div className="text-xs text-neutral-600 truncate">{t.description}</div>
                        )}
                        <div className="text-xs text-neutral-500">{t.priority} • {t.list_type}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter task description"
                  rows={3}
                  className="input-luxury"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setFormData(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger className="input-luxury">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                  className="input-luxury"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="room">Room</Label>
                <Input
                  id="room"
                  value={formData.room}
                  onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                  placeholder="e.g., Kitchen, Living Room"
                  className="input-luxury"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                  className="btn-secondary-luxury"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || !formData.title.trim()} className="btn-primary-luxury">
                  {loading ? 'Adding...' : 'Add Task'}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;