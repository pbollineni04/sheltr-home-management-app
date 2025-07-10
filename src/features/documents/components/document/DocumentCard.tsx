import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Edit, 
  Trash2, 
  Star, 
  Archive, 
  Eye,
  MoreHorizontal,
  Calendar,
  FolderOpen,
  Tag
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Document } from "../../types";
import { useDocuments } from "../../hooks/useDocuments";
import { getCategoryColor, getCategoryIcon } from "../../utils/categoryIcons";
import { format } from "date-fns";

interface DocumentCardProps {
  document: Document;
}

const getFileIcon = (mimeType?: string) => {
  if (!mimeType) return FileText;
  
  if (mimeType.startsWith('image/')) return FileText;
  if (mimeType.includes('pdf')) return FileText;
  if (mimeType.includes('word') || mimeType.includes('document')) return FileText;
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return FileText;
  
  return FileText;
};

const getCategoryBadgeContent = (category?: string) => {
  if (!category) return null;
  
  const CategoryIcon = getCategoryIcon(category as any);
  const colorClass = getCategoryColor(category as any);
  
  return { CategoryIcon, colorClass };
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return '';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const DocumentCard = ({ document }: DocumentCardProps) => {
  const { updateDocument, deleteDocument, downloadDocument } = useDocuments();
  const [isLoading, setIsLoading] = useState(false);
  const FileIcon = getFileIcon(document.mime_type);

  const handleToggleFavorite = async () => {
    setIsLoading(true);
    await updateDocument(document.id, { is_favorite: !document.is_favorite });
    setIsLoading(false);
  };

  const handleToggleArchive = async () => {
    setIsLoading(true);
    await updateDocument(document.id, { archived: !document.archived });
    setIsLoading(false);
  };

  const handleDownload = async () => {
    setIsLoading(true);
    await downloadDocument(document);
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      setIsLoading(true);
      await deleteDocument(document.id, document.file_url);
      setIsLoading(false);
    }
  };

  return (
    <Card className={`hover:shadow-md transition-all duration-200 ${document.archived ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileIcon className="w-5 h-5 text-primary" />
            {document.is_favorite && (
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
            )}
            {document.archived && (
              <Archive className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDownload} disabled={isLoading}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggleFavorite} disabled={isLoading}>
                <Star className="w-4 h-4 mr-2" />
                {document.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggleArchive} disabled={isLoading}>
                <Archive className="w-4 h-4 mr-2" />
                {document.archived ? 'Unarchive' : 'Archive'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} disabled={isLoading} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-sm line-clamp-2">{document.name}</h3>
          
          {document.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {document.description}
            </p>
          )}

          <div className="flex flex-wrap gap-1">
            {document.category_enum && (() => {
              const categoryBadge = getCategoryBadgeContent(document.category_enum);
              if (!categoryBadge) return null;
              const { CategoryIcon, colorClass } = categoryBadge;
              return (
                <Badge variant="secondary" className={`text-xs gap-1 ${colorClass}`}>
                  <CategoryIcon className="w-3 h-3" />
                  {document.category_enum}
                </Badge>
              );
            })()}
            {document.type && (
              <Badge variant="outline" className="text-xs">
                {document.type}
              </Badge>
            )}
          </div>

          {document.tags && document.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {document.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tag className="w-2 h-2 mr-1" />
                  {tag}
                </Badge>
              ))}
              {document.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{document.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(document.upload_date), 'MMM dd, yyyy')}
            </div>
            {document.file_size && (
              <span>{formatFileSize(document.file_size)}</span>
            )}
          </div>

          {document.folder_path && document.folder_path !== '/' && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <FolderOpen className="w-3 h-3" />
              {document.folder_path}
            </div>
          )}

          {document.expiration_date && (
            <div className="text-xs text-orange-600 font-medium">
              Expires: {format(new Date(document.expiration_date), 'MMM dd, yyyy')}
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
            disabled={isLoading}
            className="flex-1"
          >
            <Download className="w-3 h-3 mr-1" />
            Download
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleToggleFavorite}
            disabled={isLoading}
          >
            <Star className={`w-3 h-3 ${document.is_favorite ? 'text-yellow-500 fill-current' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;