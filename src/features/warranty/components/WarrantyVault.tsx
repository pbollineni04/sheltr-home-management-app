
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Shield, 
  FileText, 
  Plus,
  Search
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Document, NewDocumentForm } from "../types";
import { getExpirationStatus } from "../utils/documentProcessor";
import DocumentUpload from "./warranty/DocumentUpload";
import DocumentForm from "./warranty/DocumentForm";
import DocumentList from "./warranty/DocumentList";
import AlertsSection from "./warranty/AlertsSection";

const WarrantyVault = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 1,
      name: "Samsung Refrigerator Warranty",
      type: "warranty",
      category: "Appliances",
      expirationDate: "2025-08-15",
      uploadDate: "2024-01-15",
      reminderDays: 30,
      notes: "Model RF28R7351SG - Kitchen"
    },
    {
      id: 2,
      name: "Home Insurance Policy",
      type: "insurance",
      category: "Property",
      expirationDate: "2024-12-31",
      uploadDate: "2024-01-01",
      reminderDays: 60,
      notes: "Policy #: HI-2024-001"
    },
    {
      id: 3,
      name: "HVAC Service Certificate",
      type: "certificate",
      category: "HVAC",
      expirationDate: "2024-09-30",
      uploadDate: "2024-03-30",
      reminderDays: 15,
      notes: "Annual maintenance - ABC HVAC Co."
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [newDocument, setNewDocument] = useState<NewDocumentForm>({
    name: "",
    type: "warranty",
    category: "",
    expirationDate: "",
    reminderDays: 30,
    notes: ""
  });

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Handle archive tab - only show archived documents
    if (activeTab === "archive") {
      return matchesSearch && doc.archived;
    }
    
    // For all other tabs, exclude archived documents
    const notArchived = !doc.archived;
    const matchesTab = activeTab === "all" || doc.type === activeTab;
    return matchesSearch && matchesTab && notArchived;
  });

  const activeDocuments = documents.filter(doc => !doc.archived);
  
  const expiringDocuments = activeDocuments.filter(doc => 
    getExpirationStatus(doc.expirationDate, doc.reminderDays) === 'warning'
  );

  const expiredDocuments = activeDocuments.filter(doc => 
    getExpirationStatus(doc.expirationDate, doc.reminderDays) === 'expired'
  );

  const handleExtractedData = (data: Partial<NewDocumentForm>) => {
    setNewDocument(prev => ({
      ...prev,
      ...data
    }));
  };

  const resetForm = () => {
    setNewDocument({
      name: "",
      type: "warranty",
      category: "",
      expirationDate: "",
      reminderDays: 30,
      notes: ""
    });
    setUploadedFile(null);
  };

  const handleAddDocument = () => {
    const newDoc: Document = {
      id: documents.length + 1,
      ...newDocument,
      uploadDate: new Date().toISOString().split('T')[0],
      fileUrl: uploadedFile ? URL.createObjectURL(uploadedFile) : undefined
    };
    setDocuments([...documents, newDoc]);
    resetForm();
    setIsAddDialogOpen(false);
    toast({
      title: "Document Added",
      description: "Your document has been securely stored in the vault."
    });
  };

  const handleArchiveDocument = (id: number) => {
    setDocuments(docs => 
      docs.map(doc => 
        doc.id === id ? { ...doc, archived: true } : doc
      )
    );
    toast({
      title: "Document Archived",
      description: "The document has been moved to the archive."
    });
  };

  const handleDeleteDocument = (id: number) => {
    setDocuments(docs => docs.filter(doc => doc.id !== id));
    toast({
      title: "Document Deleted",
      description: "The document has been permanently deleted."
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Warranty & Insurance Vault</h2>
        <p className="text-gray-600">Secure storage for all your important documents</p>
      </div>

      {/* Alerts */}
      <AlertsSection 
        expiringCount={expiringDocuments.length}
        expiredCount={expiredDocuments.length}
      />

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <DocumentUpload
                onExtractedData={handleExtractedData}
                uploadedFile={uploadedFile}
                setUploadedFile={setUploadedFile}
              />
              <DocumentForm
                formData={newDocument}
                onChange={setNewDocument}
                onSubmit={handleAddDocument}
                isProcessing={false}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Document Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full max-w-lg">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="warranty">Warranties</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="certificate">Certificates</TabsTrigger>
          <TabsTrigger value="archive">Archive</TabsTrigger>
        </TabsList>

        <DocumentList 
          documents={filteredDocuments} 
          activeTab={activeTab}
          onArchive={activeTab !== "archive" ? handleArchiveDocument : undefined}
          onDelete={handleDeleteDocument}
        />
      </Tabs>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600 mb-4">
              {activeTab === "archive" 
                ? "No archived documents yet." 
                : "Get started by adding your first warranty or insurance document."
              }
            </p>
            {activeTab !== "archive" && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Document
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WarrantyVault;
