
import { NewDocumentForm } from "@/types/warranty";

export const processDocument = (file: File): Promise<Partial<NewDocumentForm>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const fileName = file.name.toLowerCase();
      let extractedData: Partial<NewDocumentForm> = {
        name: "",
        type: "warranty",
        category: "",
        expirationDate: "",
        notes: ""
      };

      if (fileName.includes('warranty')) {
        extractedData = {
          name: "Product Warranty Document",
          type: "warranty",
          category: "Electronics",
          expirationDate: "2025-12-31",
          notes: "Extracted from uploaded document"
        };
      } else if (fileName.includes('insurance')) {
        extractedData = {
          name: "Insurance Policy",
          type: "insurance",
          category: "Property",
          expirationDate: "2024-12-31",
          notes: "Policy details extracted automatically"
        };
      } else if (fileName.includes('certificate')) {
        extractedData = {
          name: "Service Certificate",
          type: "certificate",
          category: "Services",
          expirationDate: "2024-11-30",
          notes: "Certificate information extracted"
        };
      } else {
        extractedData = {
          name: file.name.replace(/\.[^/.]+$/, ""),
          type: "warranty",
          category: "General",
          expirationDate: "2025-06-30",
          notes: "Document uploaded and processed"
        };
      }

      resolve(extractedData);
    }, 2000);
  });
};

export const getExpirationStatus = (expirationDate: string, reminderDays: number) => {
  const expDate = new Date(expirationDate);
  const today = new Date();
  const reminderDate = new Date(expDate);
  reminderDate.setDate(reminderDate.getDate() - reminderDays);

  if (expDate < today) return 'expired';
  if (reminderDate <= today) return 'warning';
  return 'active';
};
