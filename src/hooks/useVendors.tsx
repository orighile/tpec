import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Vendor } from "@/types/vendor";
import { supabase } from "@/integrations/supabase/client";

export interface VendorFilters {
  category?: string;
  location?: string;
  priceRange?: string;
  availability?: string[];
  verified?: boolean;
}

// In-memory storage for saved vendors
const savedVendorsStorage: Record<string, string[]> = {};

export const useVendors = () => {
  const { toast } = useToast();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<VendorFilters>({});

  // Fetch vendors from Supabase
  const fetchVendors = async () => {
    setLoading(true);
    try {
      // Fetch vendors directly from the vendors table
      let query = (supabase as any)
        .from('vendors')
        .select('*')
        .eq('verified', true);

      const { data, error } = await query;

      if (error) throw error;

      // Apply filters
      let filteredData = data || [];

      if (filters.category) {
        filteredData = filteredData.filter(vendor => vendor.category === filters.category);
      }

      if (filters.location) {
        filteredData = filteredData.filter(vendor => 
          vendor.location?.toLowerCase().includes(filters.location?.toLowerCase() || '')
        );
      }

      if (filters.priceRange) {
        filteredData = filteredData.filter(vendor => vendor.price_range === filters.priceRange);
      }

      // Transform the data to match the frontend Vendor type
      const transformedVendors: Vendor[] = filteredData.map(vendor => ({
        id: vendor.id,
        name: vendor.name,
        category: vendor.category || 'Other',
        description: vendor.description || '',
        imageUrl: vendor.image_url || '/placeholder.svg',
        location: vendor.location || '',
        priceRange: vendor.price_range || '$$',
        rating: vendor.rating || 4.5,
        reviewCount: vendor.review_count || 0,
        verified: vendor.is_verified || false,
        availability: ['Weekdays', 'Weekends'],
        specialties: [],
        contactInfo: {
          email: '', // Hidden from public for security
          phone: '', // Hidden from public for security
          website: vendor.website || ''
        },
        established: '2020',
        about: vendor.description || '',
        state: vendor.location,
        city: vendor.location,
        price_min: undefined,
        price_max: undefined,
        short_description: vendor.description,
        profile_url: vendor.website,
        images: vendor.image_url ? [vendor.image_url] : [],
        slug: vendor.id
      }));

      setVendors(transformedVendors);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({
        title: "Error",
        description: "Failed to load vendors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new vendor
  const createVendor = async (vendorData: {
    name: string;
    category: string;
    description?: string;
    location?: string;
    price_range?: string;
    contact_email?: string;
    contact_phone?: string;
    website?: string;
    about?: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User must be authenticated to create a vendor');
      }

      const { data, error } = await supabase
        .from('vendors')
        .insert([{ ...vendorData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Vendor registered successfully. Awaiting verification.",
      });

      return data;
    } catch (error) {
      console.error('Error creating vendor:', error);
      toast({
        title: "Error",
        description: "Failed to register vendor",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update vendor
  const updateVendor = async (id: string, updates: Partial<{
    name: string;
    category: string;
    description: string;
    location: string;
    price_range: string;
    contact_email: string;
    contact_phone: string;
    website: string;
    about: string;
  }>) => {
    try {
      const { error } = await supabase
        .from('vendors')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Vendor updated successfully",
      });

      // Refresh vendors list
      fetchVendors();
    } catch (error) {
      console.error('Error updating vendor:', error);
      toast({
        title: "Error",
        description: "Failed to update vendor",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Save/unsave vendor (in-memory)
  const toggleSaveVendor = async (vendorId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to save vendors",
          variant: "destructive",
        });
        return;
      }

      if (!savedVendorsStorage[user.id]) {
        savedVendorsStorage[user.id] = [];
      }

      const savedVendors = savedVendorsStorage[user.id];
      const index = savedVendors.indexOf(vendorId);

      if (index > -1) {
        // Remove from saved
        savedVendors.splice(index, 1);
        toast({
          title: "Removed",
          description: "Vendor removed from saved list",
        });
      } else {
        // Add to saved
        savedVendors.push(vendorId);
        toast({
          title: "Saved",
          description: "Vendor added to saved list",
        });
      }
    } catch (error) {
      console.error('Error toggling save vendor:', error);
      toast({
        title: "Error",
        description: "Failed to update saved vendors",
        variant: "destructive",
      });
    }
  };

  // Get saved vendors for current user (in-memory)
  const getSavedVendors = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      return savedVendorsStorage[user.id] || [];
    } catch (error) {
      console.error('Error getting saved vendors:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [filters]);

  return {
    vendors,
    loading,
    filters,
    setFilters,
    createVendor,
    updateVendor,
    toggleSaveVendor,
    getSavedVendors,
    refetch: fetchVendors,
  };
};
