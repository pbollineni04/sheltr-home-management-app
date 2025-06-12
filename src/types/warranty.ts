export interface Document {
  id: number;
  name: string;
  type: 'warranty' | 'insurance' | 'certificate';
  category: string;
  expirationDate: string;
  uploadDate: string;
  fileUrl?: string;
  reminderDays: number;
  notes?: string;
  archived?: boolean;
}

export type DocumentType = 'warranty' | 'insurance' | 'certificate';

export type ExpirationStatus = 'expired' | 'warning' | 'active';

export interface NewDocumentForm {
  name: string;
  type: DocumentType;
  category: string;
  expirationDate: string;
  reminderDays: number;
  notes: string;
}
