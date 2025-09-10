
import { useState } from "react";
import { FileText, Upload, Scan, Loader2, Eye } from "lucide-react";
import { processDocument } from "../../utils/documentProcessor";
import { NewDocumentForm } from "../../types";
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

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image (JPG, PNG, GIF) or PDF file.",
        variant: "destructive"
      });
      return;
    }

    setUploadedFile(file);
    setIsScanning(true);

    try {
      const extractedData = await processDocument(file);
      onExtractedData(extractedData);
      setIsScanning(false);
      
      toast({
        title: "Document Scanned Successfully",
        description: "Text extracted and form auto-filled. Please review and adjust as needed."
      });
    } catch (error) {
      setIsScanning(false);
      console.error('OCR Error:', error);
      toast({
        title: "OCR Processing Failed",
        description: "Could not extract text from document. Please fill the form manually.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <div className="flex flex-col items-center gap-2">
        {isScanning ? (
          <>
            <div className="relative">
              <Eye className="w-8 h-8 text-blue-600" />
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin absolute -top-1 -right-1" />
            </div>
            <p className="text-sm text-gray-600">Scanning document with OCR...</p>
            <p className="text-xs text-gray-500">This may take a few moments</p>
          </>
        ) : uploadedFile ? (
          <>
            <FileText className="w-8 h-8 text-green-600" />
            <p className="text-sm font-medium">{uploadedFile.name}</p>
            <p className="text-xs text-gray-500">OCR processing completed</p>
          </>
        ) : (
          <>
            <Scan className="w-8 h-8 text-gray-400" />
            <p className="text-sm text-gray-600">Upload a document for OCR text extraction</p>
            <p className="text-xs text-gray-500">Supports JPG, PNG, GIF, and PDF files</p>
          </>
        )}
      </div>
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.gif"
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
