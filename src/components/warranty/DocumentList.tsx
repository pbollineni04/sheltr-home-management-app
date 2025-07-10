import { TabsContent } from "@/components/ui/tabs";
import { Document } from "@/types/warranty";
import DocumentCard from "./DocumentCard";

interface DocumentListProps {
  documents: Document[];
  activeTab: string;
  onArchive?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const DocumentList = ({ documents, activeTab, onArchive, onDelete }: DocumentListProps) => {
  return (
    <TabsContent value={activeTab} className="mt-6">
      <div className="grid gap-4">
        {documents.map((doc) => (
          <DocumentCard 
            key={doc.id} 
            document={doc} 
            onArchive={onArchive}
            onDelete={onDelete}
          />
        ))}
      </div>
    </TabsContent>
  );
};

export default DocumentList;
