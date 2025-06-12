
import { useState } from "react";
import { FileText, Upload, Scan, Loader2 } from "lucide-react";
import { processDocument } from "@/utils/documentProcessor";
import { NewDocumentForm } from "@/types/warranty";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploadProps {
  onExtractedData: (data: Partial<NewDocumentForm>) => void;
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
}

const DocumentUpload = ({ onExtractedData, uploadedFile, setUploadedFile }: DocumentUploadProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsScanning(true);

    try {
      const extractedData = await processDocument(file);
      onExtractedData(extractedData);
      setIsScanning(false);
      
      toast({
        title: "Document Scanned",
        description: "Information extracted and form auto-filled. Please review and adjust as needed."
      });
    } catch (error) {
      setIsScanning(false);
      toast({
        title: "Scan Failed",
        description: "Could not extract information from document.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <div className="flex flex-col items-center gap-2">
        {isScanning ? (
          <>
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm text-gray-600">Scanning document...</p>
          </>
        ) : uploadedFile ? (
          <>
            <FileText className="w-8 h-8 text-green-600" />
            <p className="text-sm font-medium">{uploadedFile.name}</p>
            <p className="text-xs text-gray-500">Information extracted successfully</p>
          </>
        ) : (
          <>
            <Scan className="w-8 h-8 text-gray-400" />
            <p className="text-sm text-gray-600">Upload a document to auto-fill details</p>
          </>
        )}
      </div>
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        onChange={handleFileUpload}
        className="hidden"
        id="file-upload"
        disabled={isScanning}
      />
      <label
        htmlFor="file-upload"
        className={`mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 cursor-pointer transition-colors ${isScanning ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Upload className="w-4 h-4" />
        {uploadedFile ? 'Replace File' : 'Upload Document'}
      </label>
    </div>
  );
};

export default DocumentUpload;
