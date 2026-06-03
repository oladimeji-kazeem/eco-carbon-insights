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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      content_audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          id: string
          item_id: string | null
          meta: Json
          version_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          id?: string
          item_id?: string | null
          meta?: Json
          version_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          item_id?: string | null
          meta?: Json
          version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_audit_log_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_audit_log_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "content_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      content_items: {
        Row: {
          created_at: string
          created_by: string | null
          current_version_id: string | null
          id: string
          published_version_id: string | null
          slug: string
          title: string
          type: Database["public"]["Enums"]["content_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          current_version_id?: string | null
          id?: string
          published_version_id?: string | null
          slug: string
          title?: string
          type: Database["public"]["Enums"]["content_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          current_version_id?: string | null
          id?: string
          published_version_id?: string | null
          slug?: string
          title?: string
          type?: Database["public"]["Enums"]["content_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_items_current_version_fk"
            columns: ["current_version_id"]
            isOneToOne: false
            referencedRelation: "content_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_published_version_fk"
            columns: ["published_version_id"]
            isOneToOne: false
            referencedRelation: "content_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      content_reviews: {
        Row: {
          comment: string | null
          created_at: string
          decision: string
          id: string
          reviewer_id: string | null
          version_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          decision: string
          id?: string
          reviewer_id?: string | null
          version_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          decision?: string
          id?: string
          reviewer_id?: string | null
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_reviews_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "content_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      content_versions: {
        Row: {
          author_id: string | null
          created_at: string
          id: string
          item_id: string
          note: string | null
          published_at: string | null
          scheduled_for: string | null
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
          value: Json
          version_number: number
        }
        Insert: {
          author_id?: string | null
          created_at?: string
          id?: string
          item_id: string
          note?: string | null
          published_at?: string | null
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          value?: Json
          version_number?: number
        }
        Update: {
          author_id?: string | null
          created_at?: string
          id?: string
          item_id?: string
          note?: string | null
          published_at?: string | null
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          value?: Json
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_versions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          kind: string
          link: string | null
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          kind: string
          link?: string | null
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          link?: string | null
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      programmes: {
        Row: {
          created_at: string
          cta_href: string | null
          cta_label: string | null
          description: string
          external_url: string | null
          focus_areas: Json
          highlights: Json
          icon: string
          id: string
          mission: string
          pillars: Json
          published: boolean
          slug: string
          sort_order: number
          tagline: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          description?: string
          external_url?: string | null
          focus_areas?: Json
          highlights?: Json
          icon?: string
          id?: string
          mission?: string
          pillars?: Json
          published?: boolean
          slug: string
          sort_order?: number
          tagline: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          description?: string
          external_url?: string | null
          focus_areas?: Json
          highlights?: Json
          icon?: string
          id?: string
          mission?: string
          pillars?: Json
          published?: boolean
          slug?: string
          sort_order?: number
          tagline?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          id: string
          key: string
          section: string
          updated_at: string
          value: Json
        }
        Insert: {
          id?: string
          key: string
          section: string
          updated_at?: string
          value: Json
        }
        Update: {
          id?: string
          key?: string
          section?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          description: string | null
          id: string
          logo_url: string | null
          og_image_url: string | null
          seo_description: string | null
          seo_title: string | null
          site_name: string
          social_links: Json
          tagline: string | null
          updated_at: string
        }
        Insert: {
          description?: string | null
          id?: string
          logo_url?: string | null
          og_image_url?: string | null
          seo_description?: string | null
          seo_title?: string | null
          site_name?: string
          social_links?: Json
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          description?: string | null
          id?: string
          logo_url?: string | null
          og_image_url?: string | null
          seo_description?: string | null
          seo_title?: string | null
          site_name?: string
          social_links?: Json
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      publish_content_version: {
        Args: { _version_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "viewer" | "reviewer" | "contributor"
      content_status:
        | "draft"
        | "in_review"
        | "changes_requested"
        | "approved"
        | "scheduled"
        | "published"
        | "archived"
      content_type: "site_content" | "programme" | "page"
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
      app_role: ["admin", "editor", "viewer", "reviewer", "contributor"],
      content_status: [
        "draft",
        "in_review",
        "changes_requested",
        "approved",
        "scheduled",
        "published",
        "archived",
      ],
      content_type: ["site_content", "programme", "page"],
    },
  },
} as const
