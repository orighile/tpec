
import { z } from "zod";

// Form schema with validation
export const vendorFormSchema = z.object({
  name: z.string().min(2, { message: "Business name must be at least 2 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  location: z.string().min(2, { message: "Location is required" }),
  priceRange: z.string().min(1, { message: "Please select a price range" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(5, { message: "Phone number is required" }),
  website: z.string().optional(),
  specialties: z.string().min(2, { message: "Please enter at least one specialty" }),
  about: z.string().min(10, { message: "About section must be at least 10 characters" }),
  established: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export type VendorFormValues = z.infer<typeof vendorFormSchema>;

// Transform function to convert form data to database format
export const transformVendorFormData = (formData: VendorFormValues) => ({
  name: formData.name,
  category: formData.category,
  description: formData.description,
  location: formData.location,
  price_range: formData.priceRange,
  contact_email: formData.email,
  contact_phone: formData.phone,
  website: formData.website,
  about: formData.about,
});
