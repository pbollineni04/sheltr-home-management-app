export interface Document {
  id: string;
  user_id: string;
  name: string;
  type: string;
  category?: string;
  category_enum?: DocumentCategory;
  expiration_date?: string;
  upload_date: string;
  file_url?: string;
  file_size?: number;
  mime_type?: string;
  original_filename?: string;
  reminder_days?: number;
  notes?: string;
  description?: string;
  archived?: boolean;
  tags?: string[];
  is_favorite?: boolean;
  access_level?: 'private' | 'shared';
  folder_path?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export type DocumentCategory = 
  | 'personal' 
  | 'financial' 
  | 'legal' 
  | 'medical' 
  | 'insurance' 
  | 'warranty' 
  | 'tax' 
  | 'property' 
  | 'education' 
  | 'employment' 
  | 'travel' 
  | 'automotive' 
  | 'other';

export interface NewDocumentForm {
  name: string;
  type: string;
  category?: string;
  category_enum?: DocumentCategory;
  expiration_date?: string;
  reminder_days?: number;
  notes?: string;
  description?: string;
  tags?: string[];
  folder_path?: string;
  access_level?: 'private' | 'shared';
}

export interface DocumentUpload {
  file: File;
  formData: NewDocumentForm;
}

export interface FolderStructure {
  path: string;
  name: string;
  children: FolderStructure[];
  documentCount: number;
}

export type ExpirationStatus = 'expired' | 'warning' | 'active';

export interface DocumentFilter {
  category?: DocumentCategory;
  type?: string;
  tags?: string[];
  folder?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  fileType?: string;
  isArchived?: boolean;
  isFavorite?: boolean;
}

export interface DocumentStats {
  total: number;
  byCategory: Record<DocumentCategory, number>;
  byType: Record<string, number>;
  totalSize: number;
  recentUploads: number;
  expiringCount: number;
  expiredCount: number;
}
