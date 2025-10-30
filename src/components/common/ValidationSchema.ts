import { z } from 'zod';

// Enhanced base validation schemas with security
export const emailSchema = z.string()
  .email('Please enter a valid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(254, 'Email too long')
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format');

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number');

export const phoneSchema = z.string()
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number too long')
  .regex(/^(\+234|0)[789][01]\d{8}$/, 'Please enter a valid Nigerian phone number');

export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name contains invalid characters');

export const urlSchema = z.string()
  .url('Please enter a valid URL')
  .max(2048, 'URL too long');

// Sanitized text schema for user content
export const sanitizedTextSchema = z.string()
  .max(1000, 'Text too long')
  .transform(val => 
    val
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  );

// Authentication schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  fullName: nameSchema,
  role: z.enum(['regular', 'organizer', 'vendor']).default('regular'),
  businessName: z.string().optional(),
  phone: phoneSchema.optional(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Enhanced event schemas with security
export const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters').regex(/^[a-zA-Z0-9\s\-'\.]+$/, 'Title contains invalid characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description must be less than 2000 characters').transform(val => 
    val
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  ),
  category: z.enum(['conference', 'workshop', 'seminar', 'networking', 'entertainment', 'sports', 'other']),
  startDate: z.string().refine(date => new Date(date) > new Date(), 'Start date must be in the future'),
  endDate: z.string().optional(),
  location: z.string().min(3, 'Location must be at least 3 characters').max(200, 'Location must be less than 200 characters').regex(/^[a-zA-Z0-9\s\-,\.]+$/, 'Invalid location format'),
  isPublic: z.boolean().default(true),
  maxAttendees: z.number().min(1, 'Must allow at least 1 attendee').max(100000, 'Maximum 100,000 attendees').optional(),
  bannerImage: urlSchema.optional(),
  registrationDeadline: z.string().optional(),
  customFields: z.record(z.any()).optional(),
}).refine(data => {
  if (data.endDate && data.startDate) {
    return new Date(data.endDate) > new Date(data.startDate);
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

// Enhanced vendor schemas with security
export const vendorSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters').max(100, 'Business name must be less than 100 characters').regex(/^[a-zA-Z0-9\s\-'\.]+$/, 'Name contains invalid characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000, 'Description must be less than 1000 characters').transform(val => 
    val
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  ),
  category: z.enum(['catering', 'photography', 'decoration', 'entertainment', 'venue', 'planning', 'security', 'transportation', 'other']),
  location: z.string().min(3, 'Location must be at least 3 characters').max(200, 'Location must be less than 200 characters').regex(/^[a-zA-Z0-9\s\-,\.]+$/, 'Invalid location format'),
  contactInfo: z.object({
    email: emailSchema,
    phone: phoneSchema,
    website: urlSchema.optional(),
    socialMedia: z.record(z.string().max(200, 'Social media link too long')).optional(),
  }),
  portfolioImages: z.array(urlSchema).max(10, 'Maximum 10 portfolio images'),
  businessHours: z.record(z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    closed: z.boolean().default(false),
  })).optional(),
});

export const vendorPackageSchema = z.object({
  name: z.string().min(2, 'Package name must be at least 2 characters').max(100, 'Package name must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  price: z.number().min(100, 'Minimum price is ₦100').max(10000000, 'Maximum price is ₦10,000,000'),
  currency: z.enum(['NGN']).default('NGN'),
  features: z.array(z.string()).min(1, 'At least one feature is required').max(20, 'Maximum 20 features'),
  duration: z.string().optional(),
  availability: z.enum(['available', 'limited', 'unavailable']).default('available'),
});

// Ticket schemas
export const ticketSchema = z.object({
  type: z.string().min(2, 'Ticket type must be at least 2 characters').max(50, 'Ticket type must be less than 50 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters').max(300, 'Description must be less than 300 characters'),
  price: z.number().min(0, 'Price cannot be negative').max(1000000, 'Maximum price is ₦1,000,000'),
  currency: z.enum(['NGN']).default('NGN'),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(10000, 'Maximum quantity is 10,000'),
  saleStartDate: z.string().optional(),
  saleEndDate: z.string().optional(),
  features: z.array(z.string()).optional(),
});

// Booking schemas
export const bookingSchema = z.object({
  eventId: z.string().uuid('Invalid event ID'),
  items: z.array(z.object({
    ticketId: z.string().uuid('Invalid ticket ID'),
    quantity: z.number().min(1, 'Quantity must be at least 1').max(100, 'Maximum 100 tickets per type'),
    price: z.number().min(0, 'Price cannot be negative'),
  })).optional(),
  vendorBookings: z.array(z.object({
    vendorId: z.string().uuid('Invalid vendor ID'),
    packageId: z.string().uuid('Invalid package ID'),
    bookingDate: z.string(),
    notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
  })).optional(),
  totalAmount: z.number().min(0, 'Total amount cannot be negative'),
  currency: z.enum(['NGN']).default('NGN'),
}).refine(data => (data.items && data.items.length > 0) || (data.vendorBookings && data.vendorBookings.length > 0), {
  message: "At least one ticket or vendor booking is required",
});

// Review schemas
export const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(1000, 'Comment must be less than 1000 characters'),
});

// Profile schemas
export const profileUpdateSchema = z.object({
  fullName: nameSchema,
  businessName: z.string().max(100, 'Business name must be less than 100 characters').optional(),
  phone: phoneSchema.optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  website: urlSchema.optional(),
  socialMedia: z.record(z.string()).optional(),
  preferences: z.object({
    emailNotifications: z.boolean().default(true),
    smsNotifications: z.boolean().default(false),
    marketingEmails: z.boolean().default(false),
    eventReminders: z.boolean().default(true),
    paymentNotifications: z.boolean().default(true),
  }).optional(),
});

// Contact form schema
export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(100, 'Subject must be less than 100 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message must be less than 2000 characters'),
  category: z.enum(['general', 'support', 'billing', 'feedback', 'partnership']).default('general'),
});

// Payment schemas
export const paymentSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  provider: z.enum(['paystack', 'flutterwave']),
  amount: z.number().min(100, 'Minimum payment amount is ₦100'),
  currency: z.enum(['NGN']).default('NGN'),
  callbackUrl: urlSchema.optional(),
});

// Search schemas
export const searchSchema = z.object({
  query: z.string().max(100, 'Search query must be less than 100 characters').optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  minRating: z.number().min(1).max(5).optional(),
  verified: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// Export all types
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type VendorInput = z.infer<typeof vendorSchema>;
export type VendorPackageInput = z.infer<typeof vendorPackageSchema>;
export type TicketInput = z.infer<typeof ticketSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
