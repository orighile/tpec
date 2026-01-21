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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_conversations: {
        Row: {
          context_data: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          context_data?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          context_data?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
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
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      blocked_dates: {
        Row: {
          blocked_date: string
          created_at: string
          id: string
          reason: string | null
        }
        Insert: {
          blocked_date: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Update: {
          blocked_date?: string
          created_at?: string
          id?: string
          reason?: string | null
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
          post_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          category_id: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          slug: string
          status: string | null
          title: string
          updated_at: string
          views: number | null
        }
        Insert: {
          author_id: string
          category_id?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string
          views?: number | null
        }
        Update: {
          author_id?: string
          category_id?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string
          views?: number | null
        }
        Relationships: []
      }
      booking_availability: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean
          slot_duration_minutes: number
          start_time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time?: string
          id?: string
          is_available?: boolean
          slot_duration_minutes?: number
          start_time?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean
          slot_duration_minutes?: number
          start_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      budget_items: {
        Row: {
          actual_cost: number | null
          budget_id: string
          category: string
          created_at: string
          description: string | null
          estimated_cost: number | null
          id: string
          is_paid: boolean | null
          updated_at: string
        }
        Insert: {
          actual_cost?: number | null
          budget_id: string
          category: string
          created_at?: string
          description?: string | null
          estimated_cost?: number | null
          id?: string
          is_paid?: boolean | null
          updated_at?: string
        }
        Update: {
          actual_cost?: number | null
          budget_id?: string
          category?: string
          created_at?: string
          description?: string | null
          estimated_cost?: number | null
          id?: string
          is_paid?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_items_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          name: string
          spent_amount: number | null
          total_budget: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          name: string
          spent_amount?: number | null
          total_budget?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          name?: string
          spent_amount?: number | null
          total_budget?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_event_id_fkey"
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
          category: string | null
          checklist_id: string | null
          completed: boolean | null
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          event_id: string | null
          id: string
          is_completed: boolean | null
          notes: string | null
          priority: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          checklist_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          event_id?: string | null
          id?: string
          is_completed?: boolean | null
          notes?: string | null
          priority?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          checklist_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          event_id?: string | null
          id?: string
          is_completed?: boolean | null
          notes?: string | null
          priority?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "checklists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_items_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      checklists: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklists_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_bookings: {
        Row: {
          booking_date: string
          booking_time: string
          consultation_type: string
          created_at: string
          email: string
          event_type: string | null
          id: string
          message: string | null
          name: string
          phone: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          booking_date: string
          booking_time: string
          consultation_type?: string
          created_at?: string
          email: string
          event_type?: string | null
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          booking_date?: string
          booking_time?: string
          consultation_type?: string
          created_at?: string
          email?: string
          event_type?: string | null
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultation_bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      crew_members: {
        Row: {
          created_at: string
          email: string | null
          event_id: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          event_id?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          event_id?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          role?: string | null
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
      events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string | null
          event_type: string | null
          id: string
          image_url: string | null
          is_public: boolean | null
          location: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
          venue: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_type?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          location?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
          venue?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_type?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          location?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          venue?: string | null
        }
        Relationships: []
      }
      guests: {
        Row: {
          created_at: string
          dietary_requirements: string | null
          email: string | null
          event_id: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          plus_one: boolean | null
          rsvp_status: string | null
          table_number: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dietary_requirements?: string | null
          email?: string | null
          event_id?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          plus_one?: boolean | null
          rsvp_status?: string | null
          table_number?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dietary_requirements?: string | null
          email?: string | null
          event_id?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          plus_one?: boolean | null
          rsvp_status?: string | null
          table_number?: number | null
          updated_at?: string
          user_id?: string
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
          description: string | null
          design_data: Json | null
          id: string
          is_premium: boolean | null
          name: string
          price: number | null
          template_type: string
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          design_data?: Json | null
          id?: string
          is_premium?: boolean | null
          name: string
          price?: number | null
          template_type: string
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          design_data?: Json | null
          id?: string
          is_premium?: boolean | null
          name?: string
          price?: number | null
          template_type?: string
          thumbnail_url?: string | null
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
          ticket_id: string | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          quantity?: number
          ticket_id?: string | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          quantity?: number
          ticket_id?: string | null
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
        ]
      }
      orders: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          payment_provider: string | null
          payment_reference: string | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          payment_provider?: string | null
          payment_reference?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          payment_provider?: string | null
          payment_reference?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prime_gallery: {
        Row: {
          caption: string | null
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string
          prime_member_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          prime_member_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          prime_member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prime_gallery_prime_member_id_fkey"
            columns: ["prime_member_id"]
            isOneToOne: false
            referencedRelation: "prime_members"
            referencedColumns: ["id"]
          },
        ]
      }
      prime_members: {
        Row: {
          business_description: string | null
          business_name: string
          category: string | null
          contact_email: string | null
          contact_phone: string | null
          cover_image_url: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          location: string | null
          logo_url: string | null
          membership_type: Database["public"]["Enums"]["prime_membership_type"]
          payment_provider: string | null
          payment_reference: string | null
          payment_status: string | null
          price_range: string | null
          services: string[] | null
          subscription_end_date: string | null
          subscription_start_date: string | null
          subscription_tier: string | null
          updated_at: string | null
          user_id: string
          video_url: string | null
          website: string | null
        }
        Insert: {
          business_description?: string | null
          business_name: string
          category?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          location?: string | null
          logo_url?: string | null
          membership_type: Database["public"]["Enums"]["prime_membership_type"]
          payment_provider?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          price_range?: string | null
          services?: string[] | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          user_id: string
          video_url?: string | null
          website?: string | null
        }
        Update: {
          business_description?: string | null
          business_name?: string
          category?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          location?: string | null
          logo_url?: string | null
          membership_type?: Database["public"]["Enums"]["prime_membership_type"]
          payment_provider?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          price_range?: string | null
          services?: string[] | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          user_id?: string
          video_url?: string | null
          website?: string | null
        }
        Relationships: []
      }
      prime_payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          metadata: Json | null
          payment_provider: string
          payment_reference: string | null
          prime_member_id: string | null
          status: string | null
          subscription_tier: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          payment_provider: string
          payment_reference?: string | null
          prime_member_id?: string | null
          status?: string | null
          subscription_tier: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          payment_provider?: string
          payment_reference?: string | null
          prime_member_id?: string | null
          status?: string | null
          subscription_tier?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prime_payments_prime_member_id_fkey"
            columns: ["prime_member_id"]
            isOneToOne: false
            referencedRelation: "prime_members"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          event_id: string | null
          id: string
          rating: number
          updated_at: string
          user_id: string
          vendor_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          rating: number
          updated_at?: string
          user_id: string
          vendor_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          rating?: number
          updated_at?: string
          user_id?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_reviews_vendor"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
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
      user_invitations: {
        Row: {
          created_at: string
          customizations: Json | null
          delivery_status: string | null
          event_id: string | null
          id: string
          sent_count: number | null
          template_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          customizations?: Json | null
          delivery_status?: string | null
          event_id?: string | null
          id?: string
          sent_count?: number | null
          template_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          customizations?: Json | null
          delivery_status?: string | null
          event_id?: string | null
          id?: string
          sent_count?: number | null
          template_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_invitations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_invitations_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "invitation_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendor_bookings: {
        Row: {
          created_at: string
          event_date: string
          event_type: string | null
          id: string
          notes: string | null
          status: string | null
          total_amount: number | null
          updated_at: string
          user_id: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          event_date: string
          event_type?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string
          user_id: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          event_date?: string
          event_type?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string
          user_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_bookings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          category: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_verified: boolean | null
          location: string | null
          name: string
          price_range: string | null
          rating: number | null
          review_count: number | null
          updated_at: string
          user_id: string | null
          website: string | null
        }
        Insert: {
          category?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_verified?: boolean | null
          location?: string | null
          name: string
          price_range?: string | null
          rating?: number | null
          review_count?: number | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
        }
        Update: {
          category?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_verified?: boolean | null
          location?: string | null
          name?: string
          price_range?: string | null
          rating?: number | null
          review_count?: number | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
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
      log_security_event: {
        Args: { event_details?: Json; event_type: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      prime_membership_type: "vendor" | "planner"
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
      app_role: ["admin", "moderator", "user"],
      prime_membership_type: ["vendor", "planner"],
    },
  },
} as const
