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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ai_conversations: {
        Row: {
          context_data: Json | null
          created_at: string
          event_id: string | null
          id: string
          is_active: boolean
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          context_data?: Json | null
          created_at?: string
          event_id?: string | null
          id?: string
          is_active?: boolean
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          context_data?: Json | null
          created_at?: string
          event_id?: string | null
          id?: string
          is_active?: boolean
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          parent_id: string | null
          post_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          parent_id?: string | null
          post_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          parent_id?: string | null
          post_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string
          category_id: string | null
          content: string
          cover_image_path: string | null
          created_at: string
          excerpt: string | null
          featured: boolean
          id: string
          published: boolean
          published_at: string | null
          read_time: number | null
          slug: string
          title: string
          updated_at: string
          views: number | null
        }
        Insert: {
          author_id: string
          category_id?: string | null
          content: string
          cover_image_path?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          id?: string
          published?: boolean
          published_at?: string | null
          read_time?: number | null
          slug: string
          title: string
          updated_at?: string
          views?: number | null
        }
        Update: {
          author_id?: string
          category_id?: string | null
          content?: string
          cover_image_path?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          id?: string
          published?: boolean
          published_at?: string | null
          read_time?: number | null
          slug?: string
          title?: string
          updated_at?: string
          views?: number | null
        }
        Relationships: []
      }
      budget_items: {
        Row: {
          actual_amount: number | null
          category: string
          created_at: string
          description: string | null
          due_date: string | null
          estimated_amount: number
          event_id: string
          id: string
          notes: string | null
          paid_amount: number | null
          priority: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_amount?: number | null
          category: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          estimated_amount?: number
          event_id: string
          id?: string
          notes?: string | null
          paid_amount?: number | null
          priority?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_amount?: number | null
          category?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          estimated_amount?: number
          event_id?: string
          id?: string
          notes?: string | null
          paid_amount?: number | null
          priority?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_items_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          assigned_to: string | null
          category: string
          completed: boolean
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          event_id: string
          id: string
          notes: string | null
          priority: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          category: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          event_id: string
          id?: string
          notes?: string | null
          priority?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          event_id?: string
          id?: string
          notes?: string | null
          priority?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      crew_members: {
        Row: {
          created_at: string
          email: string | null
          event_id: string
          id: string
          name: string
          phone: string | null
          role: string
          tasks: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          event_id: string
          id?: string
          name: string
          phone?: string | null
          role: string
          tasks?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          event_id?: string
          id?: string
          name?: string
          phone?: string | null
          role?: string
          tasks?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crew_members_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      emails: {
        Row: {
          created_at: string
          email: string | null
          id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          user_id?: string | null
        }
        Relationships: []
      }
      event_analytics: {
        Row: {
          created_at: string
          date_recorded: string
          event_id: string
          id: string
          metadata: Json | null
          metric_type: string
          metric_value: number
          user_id: string
        }
        Insert: {
          created_at?: string
          date_recorded?: string
          event_id: string
          id?: string
          metadata?: Json | null
          metric_type: string
          metric_value: number
          user_id: string
        }
        Update: {
          created_at?: string
          date_recorded?: string
          event_id?: string
          id?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_analytics_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_domains: {
        Row: {
          created_at: string
          domain_name: string
          event_id: string
          id: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          domain_name: string
          event_id: string
          id?: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          domain_name?: string
          event_id?: string
          id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_domains_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_settings: {
        Row: {
          colors: Json | null
          created_at: string
          event_id: string
          public: boolean | null
          seo: Json | null
          theme: string | null
          updated_at: string
        }
        Insert: {
          colors?: Json | null
          created_at?: string
          event_id: string
          public?: boolean | null
          seo?: Json | null
          theme?: string | null
          updated_at?: string
        }
        Update: {
          colors?: Json | null
          created_at?: string
          event_id?: string
          public?: boolean | null
          seo?: Json | null
          theme?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_settings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number | null
          category: string | null
          cover_image_path: string | null
          created_at: string
          description: string | null
          id: string
          location: string | null
          owner_user_id: string
          published: boolean | null
          slug: string | null
          starts_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          category?: string | null
          cover_image_path?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          owner_user_id: string
          published?: boolean | null
          slug?: string | null
          starts_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          category?: string | null
          cover_image_path?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          owner_user_id?: string
          published?: boolean | null
          slug?: string | null
          starts_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      gift_items: {
        Row: {
          category: string | null
          created_at: string
          currency: string
          description: string | null
          id: string
          image_path: string | null
          name: string
          price: number
          priority: string
          quantity_purchased: number
          quantity_requested: number
          registry_id: string
          store_url: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          image_path?: string | null
          name: string
          price: number
          priority?: string
          quantity_purchased?: number
          quantity_requested?: number
          registry_id: string
          store_url?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          image_path?: string | null
          name?: string
          price?: number
          priority?: string
          quantity_purchased?: number
          quantity_requested?: number
          registry_id?: string
          store_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gift_purchases: {
        Row: {
          created_at: string
          gift_item_id: string
          id: string
          message: string | null
          purchaser_email: string
          purchaser_id: string | null
          purchaser_name: string
          quantity: number
        }
        Insert: {
          created_at?: string
          gift_item_id: string
          id?: string
          message?: string | null
          purchaser_email: string
          purchaser_id?: string | null
          purchaser_name: string
          quantity?: number
        }
        Update: {
          created_at?: string
          gift_item_id?: string
          id?: string
          message?: string | null
          purchaser_email?: string
          purchaser_id?: string | null
          purchaser_name?: string
          quantity?: number
        }
        Relationships: []
      }
      gift_registries: {
        Row: {
          created_at: string
          description: string | null
          event_id: string
          id: string
          is_public: boolean
          shipping_address: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_id: string
          id?: string
          is_public?: boolean
          shipping_address?: Json | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_id?: string
          id?: string
          is_public?: boolean
          shipping_address?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      guests: {
        Row: {
          created_at: string
          email: string
          event_id: string
          full_name: string
          guest_group: string | null
          id: string
          meal_preference: string | null
          notes: string | null
          phone: string | null
          plus_one: boolean | null
          rsvp_status: string
          table_assignment: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          event_id: string
          full_name: string
          guest_group?: string | null
          id?: string
          meal_preference?: string | null
          notes?: string | null
          phone?: string | null
          plus_one?: boolean | null
          rsvp_status?: string
          table_assignment?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          event_id?: string
          full_name?: string
          guest_group?: string | null
          id?: string
          meal_preference?: string | null
          notes?: string | null
          phone?: string | null
          plus_one?: boolean | null
          rsvp_status?: string
          table_assignment?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guests_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      invitation_templates: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          design_data: Json
          id: string
          is_premium: boolean
          name: string
          preview_image_path: string | null
          price: number | null
          template_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          design_data?: Json
          id?: string
          is_premium?: boolean
          name: string
          preview_image_path?: string | null
          price?: number | null
          template_type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          design_data?: Json
          id?: string
          is_premium?: boolean
          name?: string
          preview_image_path?: string | null
          price?: number | null
          template_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          quantity: number
          ticket_id: string
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          quantity: number
          ticket_id: string
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          quantity?: number
          ticket_id?: string
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          event_id: string
          id: string
          paid_at: string | null
          provider: string | null
          provider_ref: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          event_id: string
          id?: string
          paid_at?: string | null
          provider?: string | null
          provider_ref?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          event_id?: string
          id?: string
          paid_at?: string | null
          provider?: string | null
          provider_ref?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          provider: string | null
          provider_id: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          provider?: string | null
          provider_id?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          provider?: string | null
          provider_id?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number
          user_id: string
          vendor_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          user_id: string
          vendor_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          user_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_vendors: {
        Row: {
          created_at: string
          user_id: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_vendors_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      seating_arrangements: {
        Row: {
          created_at: string
          event_id: string
          fixed_elements: Json
          id: string
          tables: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          fixed_elements?: Json
          id?: string
          tables?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          fixed_elements?: Json
          id?: string
          tables?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seating_arrangements_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      security_logs: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      social_posts: {
        Row: {
          content: string
          created_at: string
          event_id: string | null
          external_id: string | null
          id: string
          image_path: string | null
          is_trending: boolean | null
          likes_count: number | null
          platform: string | null
          shares_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          event_id?: string | null
          external_id?: string | null
          id?: string
          image_path?: string | null
          is_trending?: boolean | null
          likes_count?: number | null
          platform?: string | null
          shares_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          event_id?: string | null
          external_id?: string | null
          id?: string
          image_path?: string | null
          is_trending?: boolean | null
          likes_count?: number | null
          platform?: string | null
          shares_count?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string
          description: string | null
          due_date: string | null
          event_id: string | null
          id: string
          priority: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          event_id?: string | null
          id?: string
          priority?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          event_id?: string | null
          id?: string
          priority?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ticket_issues: {
        Row: {
          checked_in_at: string | null
          code: string
          created_at: string
          id: string
          order_id: string
          qr_svg_path: string | null
          status: string
          ticket_id: string
        }
        Insert: {
          checked_in_at?: string | null
          code: string
          created_at?: string
          id?: string
          order_id: string
          qr_svg_path?: string | null
          status?: string
          ticket_id: string
        }
        Update: {
          checked_in_at?: string | null
          code?: string
          created_at?: string
          id?: string
          order_id?: string
          qr_svg_path?: string | null
          status?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_issues_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_issues_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          active: boolean | null
          created_at: string
          currency: string | null
          event_id: string
          id: string
          price: number
          quantity_sold: number | null
          quantity_total: number
          sales_end_at: string | null
          sales_start_at: string | null
          type: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          currency?: string | null
          event_id: string
          id?: string
          price: number
          quantity_sold?: number | null
          quantity_total: number
          sales_end_at?: string | null
          sales_start_at?: string | null
          type: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          currency?: string | null
          event_id?: string
          id?: string
          price?: number
          quantity_sold?: number | null
          quantity_total?: number
          sales_end_at?: string | null
          sales_start_at?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      trending_items: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_path: string | null
          is_active: boolean
          source_url: string | null
          title: string
          trend_score: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_path?: string | null
          is_active?: boolean
          source_url?: string | null
          title: string
          trend_score?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_path?: string | null
          is_active?: boolean
          source_url?: string | null
          title?: string
          trend_score?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_invitations: {
        Row: {
          created_at: string
          custom_message: string | null
          delivery_status: string | null
          design_data: Json
          event_id: string | null
          id: string
          recipient_data: Json
          sent_at: string | null
          sent_count: number | null
          template_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          custom_message?: string | null
          delivery_status?: string | null
          design_data?: Json
          event_id?: string | null
          id?: string
          recipient_data?: Json
          sent_at?: string | null
          sent_count?: number | null
          template_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          custom_message?: string | null
          delivery_status?: string | null
          design_data?: Json
          event_id?: string | null
          id?: string
          recipient_data?: Json
          sent_at?: string | null
          sent_count?: number | null
          template_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendor_bookings: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          event_id: string
          id: string
          notes: string | null
          package_id: string | null
          status: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          event_id: string
          id?: string
          notes?: string | null
          package_id?: string | null
          status?: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          event_id?: string
          id?: string
          notes?: string | null
          package_id?: string | null
          status?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "vendor_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_bookings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_packages: {
        Row: {
          active: boolean | null
          created_at: string
          currency: string | null
          description: string | null
          id: string
          name: string
          price: number
          vendor_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          name: string
          price: number
          vendor_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          name?: string
          price?: number
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_packages_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          about: string | null
          category: string
          city: string | null
          contact_email: string | null
          contact_phone: string | null
          cover_image_path: string | null
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          location: string | null
          name: string
          owner_user_id: string
          price_max: number | null
          price_min: number | null
          price_range: string | null
          profile_url: string | null
          short_description: string | null
          slug: string | null
          state: string | null
          updated_at: string
          verified: boolean | null
          website: string | null
        }
        Insert: {
          about?: string | null
          category: string
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          cover_image_path?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          location?: string | null
          name: string
          owner_user_id: string
          price_max?: number | null
          price_min?: number | null
          price_range?: string | null
          profile_url?: string | null
          short_description?: string | null
          slug?: string | null
          state?: string | null
          updated_at?: string
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          about?: string | null
          category?: string
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          cover_image_path?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          location?: string | null
          name?: string
          owner_user_id?: string
          price_max?: number | null
          price_min?: number | null
          price_range?: string | null
          profile_url?: string | null
          short_description?: string | null
          slug?: string | null
          state?: string | null
          updated_at?: string
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_public_vendors: {
        Args: Record<PropertyKey, never>
        Returns: {
          about: string
          category: string
          city: string
          cover_image_path: string
          created_at: string
          description: string
          id: string
          images: string[]
          location: string
          name: string
          price_max: number
          price_min: number
          price_range: string
          profile_url: string
          short_description: string
          slug: string
          state: string
          updated_at: string
          verified: boolean
        }[]
      }
      has_any_role: {
        Args: {
          _roles: Database["public"]["Enums"]["app_role"][]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_security_event: {
        Args: { _event_data?: Json; _event_type: string; _user_id?: string }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "organizer" | "vendor" | "user"
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
      app_role: ["admin", "organizer", "vendor", "user"],
    },
  },
} as const
