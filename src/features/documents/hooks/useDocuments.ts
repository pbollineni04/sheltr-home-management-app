import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Document, DocumentFilter, DocumentStats, NewDocumentForm } from "../types";
import { useToast } from '@/hooks/use-toast';

export const useDocuments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async (filter?: DocumentFilter) => {
    if (!user) return;

    try {
      setLoading(true);
      let query = supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (filter) {
        if (filter.category) {
          query = query.eq('category_enum', filter.category);
        }
        if (filter.type) {
          query = query.eq('type', filter.type);
        }
        if (filter.folder) {
          query = query.eq('folder_path', filter.folder);
        }
        if (filter.isArchived !== undefined) {
          query = query.eq('archived', filter.isArchived);
        }
        if (filter.isFavorite !== undefined) {
          query = query.eq('is_favorite', filter.isFavorite);
        }
        if (filter.tags && filter.tags.length > 0) {
          query = query.overlaps('tags', filter.tags);
        }
        if (filter.fileType) {
          query = query.like('mime_type', `${filter.fileType}%`);
        }
        if (filter.dateRange) {
          query = query
            .gte('created_at', filter.dateRange.start)
            .lte('created_at', filter.dateRange.end);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setDocuments((data || []) as Document[]);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (file: File, formData: NewDocumentForm): Promise<Document | null> => {
    if (!user) return null;

    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Insert document record
      const documentData = {
        ...formData,
        user_id: user.id,
        file_url: publicUrl,
        file_size: file.size,
        mime_type: file.type,
        original_filename: file.name,
        upload_date: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('documents')
        .insert([documentData])
        .select()
        .single();

      if (error) throw error;

      await fetchDocuments();

      toast({
        title: "Document uploaded successfully",
        description: `${file.name} has been uploaded to your vault.`
      });

      return data as Document;
    } catch (err) {
      console.error('Error uploading document:', err);
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : 'Failed to upload document',
        variant: "destructive"
      });
      return null;
    }
  };

  const updateDocument = async (id: string, updates: Partial<Document>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user!.id);

      if (error) throw error;

      await fetchDocuments();

      toast({
        title: "Document updated",
        description: "Document has been updated successfully."
      });
    } catch (err) {
      console.error('Error updating document:', err);
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : 'Failed to update document',
        variant: "destructive"
      });
    }
  };

  const deleteDocument = async (id: string, fileUrl?: string): Promise<void> => {
    try {
      // Delete from storage if file exists
      if (fileUrl) {
        const filePath = fileUrl.split('/').pop();
        if (filePath) {
          await supabase.storage
            .from('documents')
            .remove([`${user?.id}/${filePath}`]);
        }
      }

      // Delete from database
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)
        .eq('user_id', user!.id);

      if (error) throw error;

      await fetchDocuments();

      toast({
        title: "Document deleted",
        description: "Document has been permanently deleted."
      });
    } catch (err) {
      console.error('Error deleting document:', err);
      toast({
        title: "Delete failed",
        description: err instanceof Error ? err.message : 'Failed to delete document',
        variant: "destructive"
      });
    }
  };

  const downloadDocument = async (document: Document): Promise<void> => {
    try {
      if (!document.file_url) return;

      const filePath = document.file_url.split('/').slice(-2).join('/');

      const { data, error } = await supabase.storage
        .from('documents')
        .download(filePath);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.original_filename || document.name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: `Downloading ${document.name}...`
      });
    } catch (err) {
      console.error('Error downloading document:', err);
      toast({
        title: "Download failed",
        description: err instanceof Error ? err.message : 'Failed to download document',
        variant: "destructive"
      });
    }
  };

  const getDocumentStats = (): DocumentStats => {
    const total = documents.length;
    const byCategory = documents.reduce((acc, doc) => {
      const cat = doc.category_enum || 'other';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byType = documents.reduce((acc, doc) => {
      acc[doc.type] = (acc[doc.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalSize = documents.reduce((sum, doc) => sum + (doc.file_size || 0), 0);

    const recentUploads = documents.filter(doc => {
      const uploadDate = new Date(doc.upload_date);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return uploadDate > sevenDaysAgo;
    }).length;

    const now = new Date();
    const expiringCount = documents.filter(doc => {
      if (!doc.expiration_date || !doc.reminder_days) return false;
      const expiry = new Date(doc.expiration_date);
      const reminderDate = new Date(expiry);
      reminderDate.setDate(reminderDate.getDate() - doc.reminder_days);
      return now >= reminderDate && now < expiry;
    }).length;

    const expiredCount = documents.filter(doc => {
      if (!doc.expiration_date) return false;
      const expiry = new Date(doc.expiration_date);
      return now > expiry;
    }).length;

    return {
      total,
      byCategory,
      byType,
      totalSize,
      recentUploads,
      expiringCount,
      expiredCount
    };
  };

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    uploadDocument,
    updateDocument,
    deleteDocument,
    downloadDocument,
    getDocumentStats
  };
};