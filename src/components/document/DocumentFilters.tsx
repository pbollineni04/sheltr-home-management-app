import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Filter,
  Tag,
  Calendar,
  FileType,
  FolderOpen
 } from "lucide-react";
import { DocumentFilter, DocumentCategory } from "@/types/document";
import { categoryIcons } from "@/utils/categoryIcons";

interface DocumentFiltersProps {
  onFilterChange: (filter: DocumentFilter) => void;
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

const FILE_TYPES = [
  { value: 'application/pdf', label: 'PDF' },
  { value: 'image/', label: 'Images' },
  { value: 'application/msword', label: 'Word Documents' },
  { value: 'application/vnd.ms-excel', label: 'Excel Files' },
  { value: 'text/', label: 'Text Files' }
];

const DocumentFilters = ({ onFilterChange, onClose }: DocumentFiltersProps) => {
  const [filter, setFilter] = useState<DocumentFilter>({});
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag.trim() && !filter.tags?.includes(newTag.trim())) {
      const updatedTags = [...(filter.tags || []), newTag.trim()];
      setFilter(prev => ({ ...prev, tags: updatedTags }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFilter(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleApplyFilter = () => {
    onFilterChange(filter);
    onClose();
  };

  const handleClearFilter = () => {
    setFilter({});
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(filter).some(key => {
    const value = filter[key as keyof DocumentFilter];
    return value !== undefined && value !== null && 
           (Array.isArray(value) ? value.length > 0 : true);
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Category Filter */}
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={filter.category || ""}
              onValueChange={(value) => setFilter(prev => ({ 
                ...prev, 
                category: value as DocumentCategory || undefined 
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All categories</SelectItem>
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

          {/* File Type Filter */}
          <div>
            <Label htmlFor="fileType">File Type</Label>
            <Select
              value={filter.fileType || ""}
              onValueChange={(value) => setFilter(prev => ({ 
                ...prev, 
                fileType: value || undefined 
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="All file types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All file types</SelectItem>
                {FILE_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Document Type Filter */}
          <div>
            <Label htmlFor="type">Document Type</Label>
            <Input
              id="type"
              value={filter.type || ""}
              onChange={(e) => setFilter(prev => ({ 
                ...prev, 
                type: e.target.value || undefined 
              }))}
              placeholder="e.g., Contract, Receipt"
            />
          </div>
        </div>

        {/* Folder Filter */}
        <div>
          <Label htmlFor="folder">Folder Path</Label>
          <Input
            id="folder"
            value={filter.folder || ""}
            onChange={(e) => setFilter(prev => ({ 
              ...prev, 
              folder: e.target.value || undefined 
            }))}
            placeholder="e.g., /Documents/Contracts"
          />
        </div>

        {/* Tags Filter */}
        <div>
          <Label htmlFor="tags">Tags</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag to filter by"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            />
            <Button type="button" onClick={handleAddTag} size="sm">
              <Tag className="w-4 h-4" />
            </Button>
          </div>
          {filter.tags && filter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filter.tags.map(tag => (
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

        {/* Date Range Filter */}
        <div>
          <Label>Upload Date Range</Label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div>
              <Label htmlFor="startDate" className="text-xs text-muted-foreground">From</Label>
              <Input
                id="startDate"
                type="date"
                value={filter.dateRange?.start || ""}
                onChange={(e) => setFilter(prev => ({
                  ...prev,
                  dateRange: {
                    start: e.target.value,
                    end: prev.dateRange?.end || ""
                  }
                }))}
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="text-xs text-muted-foreground">To</Label>
              <Input
                id="endDate"
                type="date"
                value={filter.dateRange?.end || ""}
                onChange={(e) => setFilter(prev => ({
                  ...prev,
                  dateRange: {
                    start: prev.dateRange?.start || "",
                    end: e.target.value
                  }
                }))}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClearFilter}
            disabled={!hasActiveFilters}
          >
            Clear All
          </Button>
          <Button onClick={handleApplyFilter}>
            Apply Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {Object.keys(filter).filter(key => {
                  const value = filter[key as keyof DocumentFilter];
                  return value !== undefined && value !== null && 
                         (Array.isArray(value) ? value.length > 0 : true);
                }).length}
              </Badge>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentFilters;