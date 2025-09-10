
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, FileText, Eye, Download, Archive, Trash2 } from "lucide-react";
import { Document } from "../../types";
import { getExpirationStatus } from "../../utils/documentProcessor";

interface DocumentCardProps {
  document: Document;
  onArchive?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const DocumentCard = ({ document, onArchive, onDelete }: DocumentCardProps) => {
  const status = getExpirationStatus(document.expirationDate, document.reminderDays);

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
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {getTypeIcon(document.type)}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{document.name}</h3>
              <p className="text-sm text-gray-600">{document.category}</p>
              {document.notes && (
                <p className="text-sm text-gray-500 mt-1">{document.notes}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>Expires: {new Date(document.expirationDate).toLocaleDateString()}</span>
                <span>Uploaded: {new Date(document.uploadDate).toLocaleDateString()}</span>
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
            {onArchive && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onArchive(document.id)}
                title="Archive"
              >
                <Archive className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onDelete(document.id)}
                title="Delete"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
