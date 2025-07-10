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
import { TaskTemplate } from "../data/taskTemplates";

interface AddTaskDialogProps {
  selectedList: string;
}

const AddTaskDialog = ({ selectedList }: AddTaskDialogProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("templates");
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    due_date: '',
    room: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { addTask } = useTasks();

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    
    const success = await addTask({
      title: formData.title,
      description: formData.description || undefined,
      list_type: selectedList as 'maintenance' | 'projects' | 'shopping',
      priority: formData.priority,
      due_date: formData.due_date || undefined,
      room: formData.room || undefined,
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

  const handleTemplateSelect = async (templates: TaskTemplate[]) => {
    setLoading(true);
    
    for (const template of templates) {
      const dueDate = template.due_date_offset_days 
        ? new Date(Date.now() + template.due_date_offset_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        : undefined;

      await addTask({
        title: template.title,
        description: template.description,
        list_type: selectedList as 'maintenance' | 'projects' | 'shopping',
        priority: template.priority,
        due_date: dueDate,
        room: template.suggested_room,
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
        <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
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
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setFormData(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="room">Room</Label>
                <Input
                  id="room"
                  value={formData.room}
                  onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                  placeholder="e.g., Kitchen, Living Room"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || !formData.title.trim()}>
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