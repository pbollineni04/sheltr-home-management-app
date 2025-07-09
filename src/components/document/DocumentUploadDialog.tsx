import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  File, 
  X, 
  Plus,
  Calendar,
  Tag,
  FolderPlus
} from "lucide-react";
import { useDocuments } from "@/hooks/useDocuments";
import { DocumentCategory, NewDocumentForm } from "@/types/document";
import { useToast } from "@/hooks/use-toast";
import { categoryIcons } from "@/utils/categoryIcons";

interface DocumentUploadDialogProps {
  onClose: () => void;
}

const CATEGORIES: { value: DocumentCategory; label: string }[] = [
  { value: 'personal', label: 'Personal' },
  { value: 'financial', label: 'Financial' },
  { value: 'legal', label: 'Legal' },
  { value: 'medical', label: 'Medical' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'warranty', label: 'Warranty' },
  { value: 'tax', label: 'Tax' },
  { value: 'property', label: 'Property' },
  { value: 'education', label: 'Education' },
  { value: 'employment', label: 'Employment' },
  { value: 'travel', label: 'Travel' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'other', label: 'Other' }
];

const DocumentUploadDialog = ({ onClose }: DocumentUploadDialogProps) => {
  const { uploadDocument } = useDocuments();
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<NewDocumentForm>({
    name: "",
    type: "document",
    category_enum: 'other',
    description: "",
    tags: [],
    folder_path: "/",
    access_level: 'private'
  });
  const [newTag, setNewTag] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
    
    // Auto-fill name if only one file and name is empty
    if (files.length === 1 && !formData.name) {
      setFormData(prev => ({
        ...prev,
        name: files[0].name.split('.').slice(0, -1).join('.')
      }));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.name.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for the document.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      for (const file of selectedFiles) {
        const docData = selectedFiles.length === 1 
          ? formData 
          : { 
              ...formData, 
              name: `${formData.name} - ${file.name.split('.').slice(0, -1).join('.')}`
            };
        
        await uploadDocument(file, docData);
      }

      toast({
        title: "Upload completed",
        description: `Successfully uploaded ${selectedFiles.length} document(s).`
      });

      onClose();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload Area */}
      <div className="border-2 border-dashed border-muted rounded-lg p-6">
        <div className="text-center">
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop files here, or click to select
          </p>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.txt"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            Select Files
          </label>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium">Selected Files:</h4>
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                <File className="w-4 h-4" />
                <span className="flex-1 text-sm">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Information */}
      <div className="grid gap-4">
        <div>
          <Label htmlFor="name">Document Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter document name"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category_enum}
              onValueChange={(value) => setFormData(prev => ({ 
                ...prev, 
                category_enum: value as DocumentCategory 
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(category => {
                  const CategoryIcon = categoryIcons[category.value];
                  return (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="w-4 h-4" />
                        {category.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Input
              id="type"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              placeholder="e.g., Contract, Receipt, Certificate"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Brief description of the document"
            rows={3}
          />
        </div>

        {/* Tags */}
        <div>
          <Label htmlFor="tags">Tags</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            />
            <Button type="button" onClick={handleAddTag} size="sm">
              <Tag className="w-4 h-4" />
            </Button>
          </div>
          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Advanced Options */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="folder">Folder Path</Label>
            <Input
              id="folder"
              value={formData.folder_path}
              onChange={(e) => setFormData(prev => ({ ...prev, folder_path: e.target.value }))}
              placeholder="/Documents/Category"
            />
          </div>

          <div>
            <Label htmlFor="expiration">Expiration Date</Label>
            <Input
              id="expiration"
              type="date"
              value={formData.expiration_date || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, expiration_date: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={uploading || selectedFiles.length === 0}>
          {uploading ? "Uploading..." : `Upload ${selectedFiles.length} file(s)`}
        </Button>
      </div>
    </form>
  );
};

export default DocumentUploadDialog;