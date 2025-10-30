
export interface Vendor {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  location: string;
  priceRange: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  availability: string[];
  specialties: string[];
  contactInfo: {
    email: string;
    phone: string;
    website?: string;
  };
  established?: string;
  about?: string;
  // New CSV fields
  state?: string;
  city?: string;
  price_min?: number;
  price_max?: number;
  short_description?: string;
  profile_url?: string;
  images?: string[];
  slug?: string;
}

export interface VendorRating {
  id: string;
  vendorId: string;
  userId: string;
  rating: number;
  review: string;
  createdAt: Date;
}

export interface VendorFilterOptions {
  searchTerm: string;
  category: string;
  priceRange: string;
  location: string;
  verifiedOnly: boolean;
  availability: string[];
  rating: number | null;
}
