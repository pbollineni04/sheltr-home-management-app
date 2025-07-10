import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Star, 
  Archive, 
  Trash2, 
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

interface DocumentListProps {
  documents: Document[];
}

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

const DocumentList = ({ documents }: DocumentListProps) => {
  const { updateDocument, deleteDocument, downloadDocument } = useDocuments();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const setLoading = (docId: string, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [docId]: loading }));
  };

  const handleToggleFavorite = async (document: Document) => {
    setLoading(document.id, true);
    await updateDocument(document.id, { is_favorite: !document.is_favorite });
    setLoading(document.id, false);
  };

  const handleToggleArchive = async (document: Document) => {
    setLoading(document.id, true);
    await updateDocument(document.id, { archived: !document.archived });
    setLoading(document.id, false);
  };

  const handleDownload = async (document: Document) => {
    setLoading(document.id, true);
    await downloadDocument(document);
    setLoading(document.id, false);
  };

  const handleDelete = async (document: Document) => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      setLoading(document.id, true);
      await deleteDocument(document.id, document.file_url);
      setLoading(document.id, false);
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead>Expiration</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow key={document.id} className={document.archived ? 'opacity-60' : ''}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{document.name}</span>
                      {document.is_favorite && (
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      )}
                      {document.archived && (
                        <Archive className="w-3 h-3 text-muted-foreground" />
                      )}
                    </div>
                    {document.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {document.description}
                      </p>
                    )}
                    {document.tags && document.tags.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {document.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Tag className="w-2 h-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {document.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{document.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {document.category_enum && (() => {
                  const categoryBadge = getCategoryBadgeContent(document.category_enum);
                  if (!categoryBadge) return null;
                  const { CategoryIcon, colorClass } = categoryBadge;
                  return (
                    <Badge className={`gap-1 ${colorClass}`}>
                      <CategoryIcon className="w-3 h-3" />
                      {document.category_enum}
                    </Badge>
                  );
                })()}
              </TableCell>
              <TableCell>
                {document.type && (
                  <Badge variant="outline">{document.type}</Badge>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatFileSize(document.file_size)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(document.upload_date), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell className="text-sm">
                {document.expiration_date ? (
                  <span className="text-orange-600">
                    {format(new Date(document.expiration_date), 'MMM dd, yyyy')}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(document)}
                    disabled={loadingStates[document.id]}
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => handleToggleFavorite(document)}
                        disabled={loadingStates[document.id]}
                      >
                        <Star className="w-4 h-4 mr-2" />
                        {document.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleToggleArchive(document)}
                        disabled={loadingStates[document.id]}
                      >
                        <Archive className="w-4 h-4 mr-2" />
                        {document.archived ? 'Unarchive' : 'Archive'}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(document)}
                        disabled={loadingStates[document.id]}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentList;