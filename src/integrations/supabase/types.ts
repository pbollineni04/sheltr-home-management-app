export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          archived: boolean
          category: string | null
          created_at: string
          document_type: Database["public"]["Enums"]["document_type"] | null
          expiration_date: string | null
          file_url: string | null
          id: string
          metadata: Json | null
          name: string
          notes: string | null
          reminder_days: number | null
          type: string
          updated_at: string
          upload_date: string
          user_id: string
        }
        Insert: {
          archived?: boolean
          category?: string | null
          created_at?: string
          document_type?: Database["public"]["Enums"]["document_type"] | null
          expiration_date?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          name: string
          notes?: string | null
          reminder_days?: number | null
          type: string
          updated_at?: string
          upload_date?: string
          user_id: string
        }
        Update: {
          archived?: boolean
          category?: string | null
          created_at?: string
          document_type?: Database["public"]["Enums"]["document_type"] | null
          expiration_date?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          notes?: string | null
          reminder_days?: number | null
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
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string
          date: string
          deleted_at: string | null
          description: string
          id: string
          metadata: Json | null
          receipt_url: string | null
          room: string | null
          room_id: string | null
          updated_at: string
          user_id: string
          vendor: string | null
        }
        Insert: {
          amount: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          date: string
          deleted_at?: string | null
          description: string
          id?: string
          metadata?: Json | null
          receipt_url?: string | null
          room?: string | null
          room_id?: string | null
          updated_at?: string
          user_id: string
          vendor?: string | null
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          date?: string
          deleted_at?: string | null
          description?: string
          id?: string
          metadata?: Json | null
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
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
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
            foreignKeyName: "timeline_events_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      utility_readings: {
        Row: {
          cost: number | null
          created_at: string
          id: string
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
          cost?: number | null
          created_at?: string
          id?: string
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
          cost?: number | null
          created_at?: string
          id?: string
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
    }
    Views: {
      [_ in never]: never
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
      utility_type: "electricity" | "gas" | "water" | "internet"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
      ],
      utility_type: ["electricity", "gas", "water", "internet"],
    },
  },
} as const
