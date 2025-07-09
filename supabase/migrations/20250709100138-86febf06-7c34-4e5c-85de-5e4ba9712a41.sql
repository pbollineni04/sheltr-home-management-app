-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents', 
  'documents', 
  false, 
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
);

-- Enhanced documents table structure
ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS file_size BIGINT,
ADD COLUMN IF NOT EXISTS mime_type TEXT,
ADD COLUMN IF NOT EXISTS original_filename TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS access_level TEXT DEFAULT 'private' CHECK (access_level IN ('private', 'shared')),
ADD COLUMN IF NOT EXISTS folder_path TEXT DEFAULT '/';

-- Update the type column to be more flexible for document vault
ALTER TABLE public.documents 
ALTER COLUMN type TYPE TEXT;

-- Create document_categories enum for better organization
CREATE TYPE public.document_category AS ENUM (
  'personal', 'financial', 'legal', 'medical', 'insurance', 
  'warranty', 'tax', 'property', 'education', 'employment', 
  'travel', 'automotive', 'other'
);

-- Add category_enum column
ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS category_enum public.document_category;

-- Create storage policies for documents bucket
CREATE POLICY "Users can view their own documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload their own documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own documents" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own documents" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_category_enum ON public.documents(category_enum);
CREATE INDEX IF NOT EXISTS idx_documents_tags_gin ON public.documents USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_documents_folder_path ON public.documents(folder_path);
CREATE INDEX IF NOT EXISTS idx_documents_is_favorite ON public.documents(is_favorite);
CREATE INDEX IF NOT EXISTS idx_documents_mime_type ON public.documents(mime_type);