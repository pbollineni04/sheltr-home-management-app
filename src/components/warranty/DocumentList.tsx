
import { TabsContent } from "@/components/ui/tabs";
import { Document } from "@/types/warranty";
import DocumentCard from "./DocumentCard";

interface DocumentListProps {
  documents: Document[];
  activeTab: string;
}

const DocumentList = ({ documents, activeTab }: DocumentListProps) => {
  return (
    <TabsContent value={activeTab} className="mt-6">
      <div className="grid gap-4">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
      </div>
    </TabsContent>
  );
};

export default DocumentList;
