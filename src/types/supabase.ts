
// Re-export all types from the main Supabase types file
export * from "@/integrations/supabase/types";

// Additional type definitions for the application
export interface EventWithDetails extends Event {
  event_settings?: EventSettings | null;
  tickets?: { count: number }[] | null;
  vendor_bookings?: { count: number }[] | null;
  _count?: {
    tickets: number;
    vendor_bookings: number;
  };
}

export interface VendorWithDetails extends Vendor {
  vendor_packages?: VendorPackage[] | null;
  reviews?: { rating: number }[] | null;
  _avg?: {
    rating: number;
  };
  _count?: {
    reviews: number;
  };
}

export interface OrderWithDetails extends Order {
  order_items?: (OrderItem & {
    ticket?: Ticket;
  })[];
  event?: Event;
}

export interface TicketIssueWithDetails extends TicketIssue {
  ticket?: Ticket;
  order?: Order & {
    event?: Event;
  };
}

// Payment provider types
export type PaymentProvider = "paystack" | "flutterwave";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type BookingStatus = "pending" | "confirmed" | "canceled";
export type TicketStatus = "valid" | "checked_in" | "refunded";

// Form types for creating/updating records
export interface CreateEventForm {
  title: string;
  description?: string;
  starts_at?: string;
  location?: string;
  capacity?: number;
  category?: string;
  cover_image?: File;
}

export interface CreateVendorForm {
  name: string;
  category: string;
  description?: string;
  location?: string;
  price_range?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  about?: string;
  cover_image?: File;
}

export interface CreateTicketForm {
  type: string;
  price: number;
  quantity_total: number;
  sales_start_at?: string;
  sales_end_at?: string;
}

export interface CreateVendorPackageForm {
  name: string;
  description?: string;
  price: number;
  currency?: string;
}

export interface CreateOrderForm {
  event_id: string;
  items: {
    ticket_id: string;
    quantity: number;
  }[];
}

// Placeholder types for tables that don't exist yet in the current database schema
// These will be replaced once the production schema is properly applied

export interface Event {
  id: string;
  title: string;
  description?: string;
  starts_at?: string;
  location?: string;
  capacity?: number;
  category?: string;
  cover_image_path?: string;
  slug?: string;
  published?: boolean;
  owner_user_id: string;
  created_at: string;
  updated_at: string;
}

export interface EventInsert extends Omit<Event, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EventUpdate extends Partial<EventInsert> {}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  description?: string;
  location?: string;
  price_range?: string;
  verified?: boolean;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  about?: string;
  cover_image_path?: string;
  owner_user_id: string;
  created_at: string;
  updated_at: string;
}

export interface VendorInsert extends Omit<Vendor, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VendorUpdate extends Partial<VendorInsert> {}

export interface VendorPackage {
  id: string;
  vendor_id: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  active?: boolean;
  created_at: string;
}

export interface VendorPackageInsert extends Omit<VendorPackage, 'id' | 'created_at'> {
  id?: string;
  created_at?: string;
}

export interface VendorPackageUpdate extends Partial<VendorPackageInsert> {}

export interface VendorBooking {
  id: string;
  event_id: string;
  vendor_id: string;
  package_id?: string;
  status: string;
  amount?: number;
  currency?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface VendorBookingInsert extends Omit<VendorBooking, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VendorBookingUpdate extends Partial<VendorBookingInsert> {}

export interface Ticket {
  id: string;
  event_id: string;
  type: string;
  price: number;
  currency?: string;
  quantity_total: number;
  quantity_sold?: number;
  sales_start_at?: string;
  sales_end_at?: string;
  active?: boolean;
  created_at: string;
}

export interface TicketInsert extends Omit<Ticket, 'id' | 'created_at'> {
  id?: string;
  created_at?: string;
}

export interface TicketUpdate extends Partial<TicketInsert> {}

export interface Order {
  id: string;
  user_id: string;
  event_id: string;
  amount: number;
  currency?: string;
  status: string;
  provider?: string;
  provider_ref?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderInsert extends Omit<Order, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderUpdate extends Partial<OrderInsert> {}

export interface OrderItem {
  id: string;
  order_id: string;
  ticket_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface OrderItemInsert extends Omit<OrderItem, 'id' | 'created_at'> {
  id?: string;
  created_at?: string;
}

export interface OrderItemUpdate extends Partial<OrderItemInsert> {}

export interface TicketIssue {
  id: string;
  order_id: string;
  ticket_id: string;
  code: string;
  qr_svg_path?: string;
  status: string;
  created_at: string;
  checked_in_at?: string;
}

export interface TicketIssueInsert extends Omit<TicketIssue, 'id' | 'created_at'> {
  id?: string;
  created_at?: string;
}

export interface TicketIssueUpdate extends Partial<TicketIssueInsert> {}

export interface Review {
  id: string;
  vendor_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface ReviewInsert extends Omit<Review, 'id' | 'created_at'> {
  id?: string;
  created_at?: string;
}

export interface ReviewUpdate extends Partial<ReviewInsert> {}

export interface SavedVendor {
  user_id: string;
  vendor_id: string;
  created_at: string;
}

export interface SavedVendorInsert extends Omit<SavedVendor, 'created_at'> {
  created_at?: string;
}

export interface SavedVendorUpdate extends Partial<SavedVendorInsert> {}

export interface EventDomain {
  id: string;
  event_id: string;
  domain_name: string;
  verified_at?: string;
  created_at: string;
}

export interface EventDomainInsert extends Omit<EventDomain, 'id' | 'created_at'> {
  id?: string;
  created_at?: string;
}

export interface EventDomainUpdate extends Partial<EventDomainInsert> {}

export interface EventSettings {
  event_id: string;
  theme?: string;
  colors?: any;
  seo?: any;
  public?: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventSettingsInsert extends Omit<EventSettings, 'created_at' | 'updated_at'> {
  created_at?: string;
  updated_at?: string;
}

export interface EventSettingsUpdate extends Partial<EventSettingsInsert> {}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Task = Database['public']['Tables']['tasks']['Row'];
export type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
export type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

// Database type from generated types
export type Database = import("@/integrations/supabase/types").Database;
