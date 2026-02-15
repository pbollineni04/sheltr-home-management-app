export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          alert_type: string
          alert_type_enum: Database["public"]["Enums"]["alert_type"] | null
          auto_task_created: boolean
          deleted_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          resolved: boolean
          resolved_at: string | null
          sensor_id: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
          timestamp: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_type: string
          alert_type_enum?: Database["public"]["Enums"]["alert_type"] | null
          auto_task_created?: boolean
          deleted_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          resolved?: boolean
          resolved_at?: string | null
          sensor_id?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          timestamp?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_type?: string
          alert_type_enum?: Database["public"]["Enums"]["alert_type"] | null
          auto_task_created?: boolean
          deleted_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          resolved?: boolean
          resolved_at?: string | null
          sensor_id?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          timestamp?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_sensor_id_fkey"
            columns: ["sensor_id"]
            isOneToOne: false
            referencedRelation: "sensors"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          access_level: string | null
          archived: boolean
          category: string | null
          category_enum: Database["public"]["Enums"]["document_category"] | null
          created_at: string
          description: string | null
          document_type: Database["public"]["Enums"]["document_type"] | null
          expiration_date: string | null
          file_size: number | null
          file_url: string | null
          folder_path: string | null
          id: string
          is_favorite: boolean | null
          metadata: Json | null
          mime_type: string | null
          name: string
          notes: string | null
          original_filename: string | null
          reminder_days: number | null
          tags: string[] | null
          type: string
          updated_at: string
          upload_date: string
          user_id: string
        }
        Insert: {
          access_level?: string | null
          archived?: boolean
          category?: string | null
          category_enum?:
            | Database["public"]["Enums"]["document_category"]
            | null
          created_at?: string
          description?: string | null
          document_type?: Database["public"]["Enums"]["document_type"] | null
          expiration_date?: string | null
          file_size?: number | null
          file_url?: string | null
          folder_path?: string | null
          id?: string
          is_favorite?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          name: string
          notes?: string | null
          original_filename?: string | null
          reminder_days?: number | null
          tags?: string[] | null
          type: string
          updated_at?: string
          upload_date?: string
          user_id: string
        }
        Update: {
          access_level?: string | null
          archived?: boolean
          category?: string | null
          category_enum?:
            | Database["public"]["Enums"]["document_category"]
            | null
          created_at?: string
          description?: string | null
          document_type?: Database["public"]["Enums"]["document_type"] | null
          expiration_date?: string | null
          file_size?: number | null
          file_url?: string | null
          folder_path?: string | null
          id?: string
          is_favorite?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          name?: string
          notes?: string | null
          original_filename?: string | null
          reminder_days?: number | null
          tags?: string[] | null
          type?: string
          updated_at?: string
          upload_date?: string
          user_id?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          auto_imported: boolean | null
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string
          date: string
          deleted_at: string | null
          description: string
          id: string
          metadata: Json | null
          needs_review: boolean | null
          plaid_transaction_id: string | null
          receipt_url: string | null
          room: string | null
          room_id: string | null
          updated_at: string
          user_id: string
          vendor: string | null
        }
        Insert: {
          amount: number
          auto_imported?: boolean | null
          category: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          date: string
          deleted_at?: string | null
          description: string
          id?: string
          metadata?: Json | null
          needs_review?: boolean | null
          plaid_transaction_id?: string | null
          receipt_url?: string | null
          room?: string | null
          room_id?: string | null
          updated_at?: string
          user_id: string
          vendor?: string | null
        }
        Update: {
          amount?: number
          auto_imported?: boolean | null
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          date?: string
          deleted_at?: string | null
          description?: string
          id?: string
          metadata?: Json | null
          needs_review?: boolean | null
          plaid_transaction_id?: string | null
          receipt_url?: string | null
          room?: string | null
          room_id?: string | null
          updated_at?: string
          user_id?: string
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      plaid_accounts: {
        Row: {
          account_id: string
          created_at: string
          id: string
          item_id: string
          mask: string | null
          name: string | null
          subtype: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          account_id: string
          created_at?: string
          id?: string
          item_id: string
          mask?: string | null
          name?: string | null
          subtype?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          account_id?: string
          created_at?: string
          id?: string
          item_id?: string
          mask?: string | null
          name?: string | null
          subtype?: string | null
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plaid_accounts_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "plaid_items"
            referencedColumns: ["item_id"]
          },
        ]
      }
      plaid_items: {
        Row: {
          access_token: string
          created_at: string
          id: string
          institution_name: string | null
          item_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          id?: string
          institution_name?: string | null
          item_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          id?: string
          institution_name?: string | null
          item_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      plaid_sync_state: {
        Row: {
          cursor: string | null
          item_id: string
          last_synced_at: string | null
          user_id: string
        }
        Insert: {
          cursor?: string | null
          item_id: string
          last_synced_at?: string | null
          user_id: string
        }
        Update: {
          cursor?: string | null
          item_id?: string
          last_synced_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      plaid_transactions_raw: {
        Row: {
          account_id: string
          amount: number
          categories: string[] | null
          created_at: string
          id: string
          iso_date: string
          item_id: string
          json_raw: Json | null
          merchant_name: string | null
          name: string | null
          pending: boolean | null
          transaction_id: string
          user_id: string
        }
        Insert: {
          account_id: string
          amount: number
          categories?: string[] | null
          created_at?: string
          id?: string
          iso_date: string
          item_id: string
          json_raw?: Json | null
          merchant_name?: string | null
          name?: string | null
          pending?: boolean | null
          transaction_id: string
          user_id: string
        }
        Update: {
          account_id?: string
          amount?: number
          categories?: string[] | null
          created_at?: string
          id?: string
          iso_date?: string
          item_id?: string
          json_raw?: Json | null
          merchant_name?: string | null
          name?: string | null
          pending?: boolean | null
          transaction_id?: string
          user_id?: string
        }
        Relationships: []
      }
      predictive_insights: {
        Row: {
          category: string
          confidence_score: number
          created_at: string
          days_until: number | null
          description: string | null
          id: string
          recommendation: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          confidence_score: number
          created_at?: string
          days_until?: number | null
          description?: string | null
          id?: string
          recommendation?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          confidence_score?: number
          created_at?: string
          days_until?: number | null
          description?: string | null
          id?: string
          recommendation?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          home_address: string | null
          home_value: number | null
          id: string
          onboarding_completed: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          home_address?: string | null
          home_value?: number | null
          id: string
          onboarding_completed?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          home_address?: string | null
          home_value?: number | null
          id?: string
          onboarding_completed?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      rooms: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      sensors: {
        Row: {
          battery_level: number | null
          created_at: string
          current_value: number | null
          deleted_at: string | null
          id: string
          last_update: string | null
          location: string
          metadata: Json | null
          name: string
          status: string
          type: Database["public"]["Enums"]["sensor_type"]
          unit: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          battery_level?: number | null
          created_at?: string
          current_value?: number | null
          deleted_at?: string | null
          id?: string
          last_update?: string | null
          location: string
          metadata?: Json | null
          name: string
          status?: string
          type: Database["public"]["Enums"]["sensor_type"]
          unit?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          battery_level?: number | null
          created_at?: string
          current_value?: number | null
          deleted_at?: string | null
          id?: string
          last_update?: string | null
          location?: string
          metadata?: Json | null
          name?: string
          status?: string
          type?: Database["public"]["Enums"]["sensor_type"]
          unit?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      service_providers: {
        Row: {
          category: string
          created_at: string | null
          email: string | null
          id: string
          is_favorite: boolean | null
          metadata: Json | null
          name: string
          notes: string | null
          phone: string | null
          rating: number | null
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          category?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_favorite?: boolean | null
          metadata?: Json | null
          name: string
          notes?: string | null
          phone?: string | null
          rating?: number | null
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_favorite?: boolean | null
          metadata?: Json | null
          name?: string
          notes?: string | null
          phone?: string | null
          rating?: number | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      service_recurrences: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          end_date: string | null
          estimated_cost: number | null
          frequency: string
          id: string
          is_active: boolean | null
          metadata: Json | null
          next_due_date: string
          provider_id: string | null
          room: string | null
          start_date: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          estimated_cost?: number | null
          frequency?: string
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          next_due_date: string
          provider_id?: string | null
          room?: string | null
          start_date: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          estimated_cost?: number | null
          frequency?: string
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          next_due_date?: string
          provider_id?: string | null
          room?: string | null
          start_date?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_recurrences_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          actual_cost: number | null
          attachments: Json | null
          category: string
          completed_date: string | null
          created_at: string | null
          description: string | null
          estimated_cost: number | null
          id: string
          metadata: Json | null
          priority: string
          provider_id: string | null
          recurrence_id: string | null
          room: string | null
          scheduled_date: string
          scheduled_time: string | null
          status: string
          task_id: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          actual_cost?: number | null
          attachments?: Json | null
          category?: string
          completed_date?: string | null
          created_at?: string | null
          description?: string | null
          estimated_cost?: number | null
          id?: string
          metadata?: Json | null
          priority?: string
          provider_id?: string | null
          recurrence_id?: string | null
          room?: string | null
          scheduled_date: string
          scheduled_time?: string | null
          status?: string
          task_id?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          actual_cost?: number | null
          attachments?: Json | null
          category?: string
          completed_date?: string | null
          created_at?: string | null
          description?: string | null
          estimated_cost?: number | null
          id?: string
          metadata?: Json | null
          priority?: string
          provider_id?: string | null
          recurrence_id?: string | null
          room?: string | null
          scheduled_date?: string
          scheduled_time?: string | null
          status?: string
          task_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_recurrence_id_fkey"
            columns: ["recurrence_id"]
            isOneToOne: false
            referencedRelation: "service_recurrences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          completed: boolean
          created_at: string
          deleted_at: string | null
          description: string | null
          due_date: string | null
          id: string
          list_type: Database["public"]["Enums"]["task_list_type"]
          metadata: Json | null
          priority: Database["public"]["Enums"]["task_priority"]
          room: string | null
          room_id: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          list_type?: Database["public"]["Enums"]["task_list_type"]
          metadata?: Json | null
          priority?: Database["public"]["Enums"]["task_priority"]
          room?: string | null
          room_id?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          list_type?: Database["public"]["Enums"]["task_list_type"]
          metadata?: Json | null
          priority?: Database["public"]["Enums"]["task_priority"]
          room?: string | null
          room_id?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_events: {
        Row: {
          category: Database["public"]["Enums"]["timeline_category"]
          cost: number | null
          created_at: string
          date: string
          deleted_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          room: string | null
          room_id: string | null
          service_id: string | null
          tags: string[] | null
          task_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["timeline_category"]
          cost?: number | null
          created_at?: string
          date: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          room?: string | null
          room_id?: string | null
          service_id?: string | null
          tags?: string[] | null
          task_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["timeline_category"]
          cost?: number | null
          created_at?: string
          date?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          room?: string | null
          room_id?: string | null
          service_id?: string | null
          tags?: string[] | null
          task_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_events_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_events_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_events_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      utility_accounts: {
        Row: {
          account_id: string
          connection_id: string
          created_at: string
          id: string
          metadata: Json | null
          service_address: string | null
          updated_at: string
          user_id: string
          utility_type: Database["public"]["Enums"]["utility_type"]
        }
        Insert: {
          account_id: string
          connection_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          service_address?: string | null
          updated_at?: string
          user_id: string
          utility_type: Database["public"]["Enums"]["utility_type"]
        }
        Update: {
          account_id?: string
          connection_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          service_address?: string | null
          updated_at?: string
          user_id?: string
          utility_type?: Database["public"]["Enums"]["utility_type"]
        }
        Relationships: [
          {
            foreignKeyName: "utility_accounts_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "utility_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      utility_bills_raw: {
        Row: {
          account_id: string
          bill_id: string
          connection_id: string
          cost: number | null
          created_at: string
          id: string
          json_raw: Json | null
          statement_date: string
          unit: string
          usage_amount: number
          user_id: string
          utility_type: Database["public"]["Enums"]["utility_type"]
        }
        Insert: {
          account_id: string
          bill_id: string
          connection_id: string
          cost?: number | null
          created_at?: string
          id?: string
          json_raw?: Json | null
          statement_date: string
          unit: string
          usage_amount: number
          user_id: string
          utility_type: Database["public"]["Enums"]["utility_type"]
        }
        Update: {
          account_id?: string
          bill_id?: string
          connection_id?: string
          cost?: number | null
          created_at?: string
          id?: string
          json_raw?: Json | null
          statement_date?: string
          unit?: string
          usage_amount?: number
          user_id?: string
          utility_type?: Database["public"]["Enums"]["utility_type"]
        }
        Relationships: [
          {
            foreignKeyName: "utility_bills_raw_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "utility_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      utility_connections: {
        Row: {
          access_token: string
          account_number: string | null
          connection_id: string
          created_at: string
          id: string
          metadata: Json | null
          provider: string
          status: string
          updated_at: string
          user_id: string
          utility_name: string | null
        }
        Insert: {
          access_token: string
          account_number?: string | null
          connection_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          provider?: string
          status?: string
          updated_at?: string
          user_id: string
          utility_name?: string | null
        }
        Update: {
          access_token?: string
          account_number?: string | null
          connection_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          provider?: string
          status?: string
          updated_at?: string
          user_id?: string
          utility_name?: string | null
        }
        Relationships: []
      }
      utility_readings: {
        Row: {
          auto_imported: boolean | null
          bill_id: string | null
          confidence: string | null
          cost: number | null
          created_at: string
          id: string
          needs_review: boolean | null
          reading_date: string
          trend_direction: string | null
          trend_percent: number | null
          unit: string
          updated_at: string
          usage_amount: number
          user_id: string
          utility_type: Database["public"]["Enums"]["utility_type"]
        }
        Insert: {
          auto_imported?: boolean | null
          bill_id?: string | null
          confidence?: string | null
          cost?: number | null
          created_at?: string
          id?: string
          needs_review?: boolean | null
          reading_date: string
          trend_direction?: string | null
          trend_percent?: number | null
          unit: string
          updated_at?: string
          usage_amount: number
          user_id: string
          utility_type: Database["public"]["Enums"]["utility_type"]
        }
        Update: {
          auto_imported?: boolean | null
          bill_id?: string | null
          confidence?: string | null
          cost?: number | null
          created_at?: string
          id?: string
          needs_review?: boolean | null
          reading_date?: string
          trend_direction?: string | null
          trend_percent?: number | null
          unit?: string
          updated_at?: string
          usage_amount?: number
          user_id?: string
          utility_type?: Database["public"]["Enums"]["utility_type"]
        }
        Relationships: []
      }
      utility_sync_state: {
        Row: {
          connection_id: string
          cursor: string | null
          last_synced_at: string | null
          metadata: Json | null
          user_id: string
        }
        Insert: {
          connection_id: string
          cursor?: string | null
          last_synced_at?: string | null
          metadata?: Json | null
          user_id: string
        }
        Update: {
          connection_id?: string
          cursor?: string | null
          last_synced_at?: string | null
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "utility_sync_state_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: true
            referencedRelation: "utility_connections"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      expenses_with_plaid_details: {
        Row: {
          account_mask: string | null
          account_name: string | null
          amount: number | null
          auto_imported: boolean | null
          category: Database["public"]["Enums"]["expense_category"] | null
          created_at: string | null
          date: string | null
          deleted_at: string | null
          description: string | null
          id: string | null
          institution_name: string | null
          metadata: Json | null
          needs_review: boolean | null
          plaid_categories: string[] | null
          plaid_merchant: string | null
          plaid_pending: boolean | null
          plaid_transaction_id: string | null
          receipt_url: string | null
          room: string | null
          room_id: string | null
          updated_at: string | null
          user_id: string | null
          vendor: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      alert_severity: "low" | "medium" | "high" | "critical"
      alert_type:
        | "sensor_alert"
        | "maintenance_reminder"
        | "warranty_expiration"
        | "utility_anomaly"
        | "security_breach"
      document_category:
        | "personal"
        | "financial"
        | "legal"
        | "medical"
        | "insurance"
        | "warranty"
        | "tax"
        | "property"
        | "education"
        | "employment"
        | "travel"
        | "automotive"
        | "other"
      document_type:
        | "warranty"
        | "insurance"
        | "certificate"
        | "manual"
        | "receipt"
        | "inspection"
      expense_category:
        | "renovation"
        | "maintenance"
        | "appliances"
        | "services"
        | "utilities"
        | "uncategorized"
      sensor_type:
        | "temperature"
        | "humidity"
        | "motion"
        | "door"
        | "window"
        | "smoke"
        | "water_leak"
      task_list_type: "maintenance" | "projects" | "shopping"
      task_priority: "low" | "medium" | "high"
      timeline_category:
        | "renovation"
        | "maintenance"
        | "purchase"
        | "inspection"
        | "utilities"
        | "services"
      utility_type: "electricity" | "gas" | "water" | "internet"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_severity: ["low", "medium", "high", "critical"],
      alert_type: [
        "sensor_alert",
        "maintenance_reminder",
        "warranty_expiration",
        "utility_anomaly",
        "security_breach",
      ],
      document_category: [
        "personal",
        "financial",
        "legal",
        "medical",
        "insurance",
        "warranty",
        "tax",
        "property",
        "education",
        "employment",
        "travel",
        "automotive",
        "other",
      ],
      document_type: [
        "warranty",
        "insurance",
        "certificate",
        "manual",
        "receipt",
        "inspection",
      ],
      expense_category: [
        "renovation",
        "maintenance",
        "appliances",
        "services",
        "utilities",
        "uncategorized",
      ],
      sensor_type: [
        "temperature",
        "humidity",
        "motion",
        "door",
        "window",
        "smoke",
        "water_leak",
      ],
      task_list_type: ["maintenance", "projects", "shopping"],
      task_priority: ["low", "medium", "high"],
      timeline_category: [
        "renovation",
        "maintenance",
        "purchase",
        "inspection",
        "utilities",
        "services",
      ],
      utility_type: ["electricity", "gas", "water", "internet"],
    },
  },
} as const
