import { createWorker } from 'tesseract.js';
import { NewDocumentForm } from "../types";

export const processDocument = async (file: File): Promise<Partial<NewDocumentForm>> => {
  try {
    // Create Tesseract worker
    const worker = await createWorker('eng');
    
    // Convert file to image URL for OCR processing
    const imageUrl = URL.createObjectURL(file);
    
    // Perform OCR
    const { data: { text } } = await worker.recognize(imageUrl);
    
    // Clean up
    URL.revokeObjectURL(imageUrl);
    await worker.terminate();
    
    // Extract information from OCR text
    const extractedData = extractDocumentInfo(text, file.name);
    
    return extractedData;
  } catch (error) {
    console.error('OCR processing failed:', error);
    // Fallback to filename-based extraction
    return extractFromFilename(file.name);
  }
};

const extractDocumentInfo = (ocrText: string, fileName: string): Partial<NewDocumentForm> => {
  const text = ocrText.toLowerCase();
  
  // Extract document name - look for common patterns
  let documentName = fileName.replace(/\.[^/.]+$/, "");
  
  // Try to find product names or document titles in OCR text
  const titleMatches = ocrText.match(/(?:warranty|insurance|certificate)\s+(?:for\s+)?([^\n\r]{1,50})/i);
  if (titleMatches && titleMatches[1]) {
    documentName = titleMatches[1].trim();
  }
  
  // Determine document type based on OCR content
  let type: "warranty" | "insurance" | "certificate" = "warranty";
  if (text.includes('insurance') || text.includes('policy')) {
    type = "insurance";
  } else if (text.includes('certificate') || text.includes('certification')) {
    type = "certificate";
  }
  
  // Extract expiration date - look for date patterns
  let expirationDate = "2025-12-31"; // default
  const datePatterns = [
    /(?:exp(?:iry|iration)?|valid\s+until|expires?)[\s:]*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i,
    /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/g
  ];
  
  for (const pattern of datePatterns) {
    const matches = ocrText.match(pattern);
    if (matches && matches[1]) {
      const dateStr = matches[1];
      const parsedDate = parseDate(dateStr);
      if (parsedDate) {
        expirationDate = parsedDate;
        break;
      }
    }
  }
  
  // Determine category based on content
  let category = "General";
  if (text.includes('appliance') || text.includes('refrigerator') || text.includes('dishwasher')) {
    category = "Appliances";
  } else if (text.includes('electronic') || text.includes('tv') || text.includes('computer')) {
    category = "Electronics";
  } else if (text.includes('hvac') || text.includes('heating') || text.includes('cooling')) {
    category = "HVAC";
  } else if (text.includes('property') || text.includes('home') || text.includes('house')) {
    category = "Property";
  } else if (text.includes('auto') || text.includes('car') || text.includes('vehicle')) {
    category = "Automotive";
  }
  
  return {
    name: documentName,
    type,
    category,
    expirationDate,
    notes: `Extracted via OCR from ${fileName}`
  };
};

const parseDate = (dateStr: string): string | null => {
  try {
    // Handle various date formats
    const cleaned = dateStr.replace(/[-/]/g, '/');
    const date = new Date(cleaned);
    
    if (isNaN(date.getTime())) {
      return null;
    }
    
    // Convert to YYYY-MM-DD format
    return date.toISOString().split('T')[0];
  } catch {
    return null;
  }
};

const extractFromFilename = (fileName: string): Partial<NewDocumentForm> => {
  const name = fileName.toLowerCase();
  
  if (name.includes('warranty')) {
    return {
      name: "Product Warranty Document",
      type: "warranty",
      category: "Electronics",
      expirationDate: "2025-12-31",
      notes: "Extracted from filename"
    };
  } else if (name.includes('insurance')) {
    return {
      name: "Insurance Policy",
      type: "insurance",
      category: "Property",
      expirationDate: "2024-12-31",
      notes: "Extracted from filename"
    };
  } else if (name.includes('certificate')) {
    return {
      name: "Service Certificate",
      type: "certificate",
      category: "Services",
      expirationDate: "2024-11-30",
      notes: "Extracted from filename"
    };
  } else {
    return {
      name: fileName.replace(/\.[^/.]+$/, ""),
      type: "warranty",
      category: "General",
      expirationDate: "2025-06-30",
      notes: "Document uploaded"
    };
  }
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