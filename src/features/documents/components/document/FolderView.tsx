import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Folder, 
  FolderOpen, 
  File, 
  ChevronRight, 
  ChevronDown,
  Home
} from "lucide-react";
import { Document, FolderStructure } from "../../types";
import DocumentCard from "./DocumentCard";

interface FolderViewProps {
  documents: Document[];
}

const FolderView = ({ documents }: FolderViewProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/']));
  const [selectedFolder, setSelectedFolder] = useState<string>('/');

  const folderStructure = useMemo(() => {
    const folders: Record<string, FolderStructure> = {
      '/': {
        path: '/',
        name: 'Root',
        children: [],
        documentCount: 0
      }
    };

    // Create folder structure
    documents.forEach(doc => {
      const folderPath = doc.folder_path || '/';
      const pathParts = folderPath.split('/').filter(Boolean);
      
      let currentPath = '/';
      
      // Ensure root folder exists
      if (!folders[currentPath]) {
        folders[currentPath] = {
          path: currentPath,
          name: 'Root',
          children: [],
          documentCount: 0
        };
      }

      // Create nested folders
      for (let i = 0; i < pathParts.length; i++) {
        const parentPath = currentPath;
        currentPath = '/' + pathParts.slice(0, i + 1).join('/');
        
        if (!folders[currentPath]) {
          folders[currentPath] = {
            path: currentPath,
            name: pathParts[i],
            children: [],
            documentCount: 0
          };
          
          // Add to parent's children if not already there
          if (!folders[parentPath].children.find(child => child.path === currentPath)) {
            folders[parentPath].children.push(folders[currentPath]);
          }
        }
      }

      // Count documents in each folder
      folders[folderPath].documentCount++;
    });

    return folders['/'];
  }, [documents]);

  const documentsInSelectedFolder = useMemo(() => {
    return documents.filter(doc => (doc.folder_path || '/') === selectedFolder);
  }, [documents, selectedFolder]);

  const toggleFolder = (folderPath: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolder = (folder: FolderStructure, level: number = 0) => {
    const isExpanded = expandedFolders.has(folder.path);
    const isSelected = selectedFolder === folder.path;
    const hasChildren = folder.children.length > 0;

    return (
      <div key={folder.path}>
        <div
          className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted/50 ${
            isSelected ? 'bg-muted' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => setSelectedFolder(folder.path)}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-4 w-4"
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folder.path);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </Button>
          )}
          {!hasChildren && <div className="w-4" />}
          
          {folder.path === '/' ? (
            <Home className="w-4 h-4 text-primary" />
          ) : isExpanded ? (
            <FolderOpen className="w-4 h-4 text-primary" />
          ) : (
            <Folder className="w-4 h-4 text-primary" />
          )}
          
          <span className="flex-1">{folder.name}</span>
          
          {folder.documentCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {folder.documentCount}
            </Badge>
          )}
        </div>

        {isExpanded && hasChildren && (
          <div>
            {folder.children
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(child => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      {/* Folder Tree */}
      <div className="lg:col-span-1">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Folders</h3>
            <div className="space-y-1">
              {renderFolder(folderStructure)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents in Selected Folder */}
      <div className="lg:col-span-3">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            {selectedFolder === '/' ? 'Root Folder' : selectedFolder}
          </h3>
          <p className="text-sm text-muted-foreground">
            {documentsInSelectedFolder.length} document(s)
          </p>
        </div>

        {documentsInSelectedFolder.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Folder className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Empty Folder</h3>
              <p className="text-muted-foreground">
                This folder doesn't contain any documents yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documentsInSelectedFolder.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderView;