import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Vendor, VendorFilterOptions } from "@/types/vendor";
import { supabase } from "@/integrations/supabase/client";

export const useVendorMarketplace = () => {
  const { toast } = useToast();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState<VendorFilterOptions>({
    searchTerm: "",
    category: "All Categories",
    priceRange: "any",
    location: "",
    verifiedOnly: false,
    availability: [],
    rating: null
  });
  
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [savedVendors, setSavedVendors] = useState<string[]>([]);
  const [contactDialog, setContactDialog] = useState<{
    open: boolean;
    vendor: Vendor | null;
  }>({
    open: false,
    vendor: null
  });

  // Fetch vendors from Supabase
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await (supabase as any)
          .from('vendors')
          .select('*')
          .eq('verified', true);

        if (error) throw error;

        const formattedVendors: Vendor[] = (data || []).map((v: any) => ({
          id: v.id,
          name: v.name,
          category: v.category || 'Other',
          description: v.description || '',
          imageUrl: v.cover_image_path || v.image_url || '/placeholder.svg',
          location: v.location || 'Nigeria',
          priceRange: v.price_range || '$$',
          rating: v.rating || 4.5,
          reviewCount: v.review_count || 0,
          verified: v.verified || v.is_verified || false,
          availability: ['Weekdays', 'Weekends'],
          specialties: [],
          contactInfo: {
            phone: v.contact_phone || '',
            email: v.contact_email || '',
            website: v.website || ''
          },
          about: v.description || '',
          state: v.location,
          city: v.location,
          price_min: undefined,
          price_max: undefined,
          short_description: v.description,
          profile_url: v.website,
          images: v.cover_image_path ? [v.cover_image_path] : (v.image_url ? [v.image_url] : []),
          slug: v.id
        }));

        setVendors(formattedVendors);
      } catch (error) {
        console.error('Error fetching vendors:', error);
        toast({
          title: "Error loading vendors",
          description: "Failed to load vendors from database",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, [toast]);

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = filterOptions.searchTerm ? 
      (vendor.name.toLowerCase().includes(filterOptions.searchTerm.toLowerCase()) ||
      vendor.description.toLowerCase().includes(filterOptions.searchTerm.toLowerCase())) : true;
    
    const matchesCategory = filterOptions.category === "All Categories" || 
      vendor.category === filterOptions.category;
    
    const matchesPrice = filterOptions.priceRange === "any" || 
      vendor.priceRange.includes(filterOptions.priceRange);
    
    const matchesLocation = !filterOptions.location || 
      vendor.location.toLowerCase().includes(filterOptions.location.toLowerCase());
    
    const matchesVerified = !filterOptions.verifiedOnly || vendor.verified;
    
    const matchesAvailability = filterOptions.availability.length === 0 || 
      filterOptions.availability.some(avail => vendor.availability.includes(avail));
    
    const matchesRating = filterOptions.rating === null || 
      vendor.rating >= filterOptions.rating;
    
    if (activeTab === "saved") {
      return savedVendors.includes(vendor.id) && 
             matchesSearch && matchesCategory && matchesPrice && 
             matchesLocation && matchesVerified && matchesAvailability && 
             matchesRating;
    }
    
    return matchesSearch && matchesCategory && matchesPrice && 
           matchesLocation && matchesVerified && matchesAvailability && 
           matchesRating;
  });

  const resetFilters = () => {
    setFilterOptions({
      searchTerm: "",
      category: "All Categories",
      priceRange: "any",
      location: "",
      verifiedOnly: false,
      availability: [],
      rating: null
    });
  };

  const toggleSaveVendor = (vendorId: string) => {
    if (savedVendors.includes(vendorId)) {
      setSavedVendors(savedVendors.filter(id => id !== vendorId));
      toast({
        title: "Vendor removed",
        description: "Vendor has been removed from your saved list.",
      });
    } else {
      setSavedVendors([...savedVendors, vendorId]);
      toast({
        title: "Vendor saved",
        description: "Vendor has been added to your saved list.",
      });
    }
  };

  const handleContactVendor = (vendor: Vendor) => {
    setContactDialog({
      open: true,
      vendor
    });
  };

  const confirmContactVendor = () => {
    if (contactDialog.vendor) {
      toast({
        title: "Contact initiated",
        description: `A message has been sent to ${contactDialog.vendor.name}. They will contact you shortly.`,
      });
      setContactDialog({ open: false, vendor: null });
    }
  };

  return {
    filterOptions,
    setFilterOptions,
    selectedVendor,
    setSelectedVendor,
    activeTab,
    setActiveTab,
    savedVendors,
    filteredVendors,
    contactDialog,
    setContactDialog,
    resetFilters,
    toggleSaveVendor,
    handleContactVendor,
    confirmContactVendor,
    isLoading
  };
};
