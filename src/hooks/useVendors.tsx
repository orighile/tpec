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

export const useVendors = () => {
  const { toast } = useToast();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<VendorFilters>({});

  // Fetch vendors from Supabase (secure version that hides contact info from public)
  const fetchVendors = async () => {
    setLoading(true);
    try {
      // Use the secure function to get public vendor data without contact info
      let { data, error } = await supabase.rpc('get_public_vendors');

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
        category: vendor.category,
        description: vendor.description || vendor.short_description || '',
        imageUrl: vendor.cover_image_path || (vendor.images && vendor.images[0]) || '/placeholder.svg',
        location: vendor.location || (vendor.city && vendor.state ? `${vendor.city}, ${vendor.state}` : vendor.city || vendor.state || ''),
        priceRange: vendor.price_range || (vendor.price_min && vendor.price_max ? `₦${vendor.price_min?.toLocaleString()}–₦${vendor.price_max?.toLocaleString()}` : ''),
        rating: 4.5, // Default rating - would come from reviews aggregation
        reviewCount: 0, // Default - would come from reviews count
        verified: vendor.verified || false,
        availability: ['Weekdays', 'Weekends'], // Default - would be stored separately
        specialties: [], // Default - would be stored separately
        contactInfo: {
          email: '', // Hidden from public for security
          phone: '', // Hidden from public for security
          website: vendor.profile_url || '' // Use profile_url as website
        },
        established: '2020', // Default - would be stored separately
        about: vendor.about || vendor.short_description || '',
        // New CSV fields
        state: vendor.state,
        city: vendor.city,
        price_min: vendor.price_min,
        price_max: vendor.price_max,
        short_description: vendor.short_description,
        profile_url: vendor.profile_url,
        images: vendor.images,
        slug: vendor.slug
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
        .insert([{ ...vendorData, owner_user_id: user.id }])
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

  // Save/unsave vendor
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

      // Check if vendor is already saved
      const { data: existing } = await supabase
        .from('saved_vendors')
        .select('*')
        .eq('vendor_id', vendorId)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        // Remove from saved
        const { error } = await supabase
          .from('saved_vendors')
          .delete()
          .eq('vendor_id', vendorId)
          .eq('user_id', user.id);

        if (error) throw error;

        toast({
          title: "Removed",
          description: "Vendor removed from saved list",
        });
      } else {
        // Add to saved
        const { error } = await supabase
          .from('saved_vendors')
          .insert([{
            vendor_id: vendorId,
            user_id: user.id
          }]);

        if (error) throw error;

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

  // Get saved vendors for current user
  const getSavedVendors = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('saved_vendors')
        .select('vendor_id')
        .eq('user_id', user.id);

      if (error) throw error;

      return (data || []).map(item => item.vendor_id);
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