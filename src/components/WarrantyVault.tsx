
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Shield, 
  FileText, 
  Upload, 
  Plus,
  Calendar,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: number;
  name: string;
  type: 'warranty' | 'insurance' | 'certificate';
  category: string;
  expirationDate: string;
  uploadDate: string;
  fileUrl?: string;
  reminderDays: number;
  notes?: string;
}

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
  const [newDocument, setNewDocument] = useState({
    name: "",
    type: "warranty" as const,
    category: "",
    expirationDate: "",
    reminderDays: 30,
    notes: ""
  });

  const getExpirationStatus = (expirationDate: string, reminderDays: number) => {
    const expDate = new Date(expirationDate);
    const today = new Date();
    const reminderDate = new Date(expDate);
    reminderDate.setDate(reminderDate.getDate() - reminderDays);

    if (expDate < today) return 'expired';
    if (reminderDate <= today) return 'warning';
    return 'active';
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || doc.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const expiringDocuments = documents.filter(doc => 
    getExpirationStatus(doc.expirationDate, doc.reminderDays) === 'warning'
  );

  const expiredDocuments = documents.filter(doc => 
    getExpirationStatus(doc.expirationDate, doc.reminderDays) === 'expired'
  );

  const handleAddDocument = () => {
    const newDoc: Document = {
      id: documents.length + 1,
      ...newDocument,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setDocuments([...documents, newDoc]);
    setNewDocument({
      name: "",
      type: "warranty",
      category: "",
      expirationDate: "",
      reminderDays: 30,
      notes: ""
    });
    setIsAddDialogOpen(false);
    toast({
      title: "Document Added",
      description: "Your document has been securely stored in the vault."
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'expired':
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Expired</span>;
      case 'warning':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Expiring Soon</span>;
      default:
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warranty': return <Shield className="w-4 h-4 text-blue-600" />;
      case 'insurance': return <Shield className="w-4 h-4 text-green-600" />;
      case 'certificate': return <FileText className="w-4 h-4 text-purple-600" />;
      default: return <FileText className="w-4 h-4" />;
    }
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
      {(expiringDocuments.length > 0 || expiredDocuments.length > 0) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-800">Document Alerts</h3>
            </div>
            {expiredDocuments.length > 0 && (
              <p className="text-sm text-red-700 mb-1">
                {expiredDocuments.length} document(s) have expired
              </p>
            )}
            {expiringDocuments.length > 0 && (
              <p className="text-sm text-yellow-700">
                {expiringDocuments.length} document(s) expiring soon
              </p>
            )}
          </CardContent>
        </Card>
      )}

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
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Document Name</Label>
                <Input
                  id="name"
                  value={newDocument.name}
                  onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
                  placeholder="e.g., Dishwasher Warranty"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={newDocument.type}
                  onChange={(e) => setNewDocument({...newDocument, type: e.target.value as any})}
                  className="w-full h-10 px-3 border border-input rounded-md"
                >
                  <option value="warranty">Warranty</option>
                  <option value="insurance">Insurance</option>
                  <option value="certificate">Certificate</option>
                </select>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newDocument.category}
                  onChange={(e) => setNewDocument({...newDocument, category: e.target.value})}
                  placeholder="e.g., Appliances, HVAC, Property"
                />
              </div>
              <div>
                <Label htmlFor="expiration">Expiration Date</Label>
                <Input
                  id="expiration"
                  type="date"
                  value={newDocument.expirationDate}
                  onChange={(e) => setNewDocument({...newDocument, expirationDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="reminder">Reminder (days before)</Label>
                <Input
                  id="reminder"
                  type="number"
                  value={newDocument.reminderDays}
                  onChange={(e) => setNewDocument({...newDocument, reminderDays: parseInt(e.target.value)})}
                  placeholder="30"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={newDocument.notes}
                  onChange={(e) => setNewDocument({...newDocument, notes: e.target.value})}
                  placeholder="Additional details..."
                />
              </div>
              <Button onClick={handleAddDocument} className="w-full">
                Add Document
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Document Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="warranty">Warranties</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="certificate">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4">
            {filteredDocuments.map((doc) => {
              const status = getExpirationStatus(doc.expirationDate, doc.reminderDays);
              return (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getTypeIcon(doc.type)}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                          <p className="text-sm text-gray-600">{doc.category}</p>
                          {doc.notes && (
                            <p className="text-sm text-gray-500 mt-1">{doc.notes}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>Expires: {new Date(doc.expirationDate).toLocaleDateString()}</span>
                            <span>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(status)}
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first warranty or insurance document.</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Document
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WarrantyVault;
