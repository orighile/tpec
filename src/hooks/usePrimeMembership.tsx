import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export type PrimeMembershipType = "vendor" | "planner";

export interface PrimeMember {
  id: string;
  user_id: string;
  membership_type: PrimeMembershipType;
  business_name: string;
  business_description: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  video_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  location: string | null;
  category: string | null;
  services: string[] | null;
  price_range: string | null;
  is_active: boolean;
  is_featured: boolean;
  payment_status: string | null;
  payment_reference: string | null;
  payment_provider: string | null;
  subscription_tier: string | null;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface PrimeGalleryImage {
  id: string;
  prime_member_id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
  created_at: string;
}

export interface CreatePrimeMemberData {
  membership_type: PrimeMembershipType;
  business_name: string;
  business_description?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  location?: string;
  category?: string;
  services?: string[];
  price_range?: string;
}

export interface UpdatePrimeMemberData {
  business_name?: string;
  business_description?: string;
  logo_url?: string;
  cover_image_url?: string;
  video_url?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  location?: string;
  category?: string;
  services?: string[];
  price_range?: string;
}

// File size limits
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export const usePrimeMembership = (membershipType: PrimeMembershipType) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [membership, setMembership] = useState<PrimeMember | null>(null);
  const [galleryImages, setGalleryImages] = useState<PrimeGalleryImage[]>([]);
  const [allMembers, setAllMembers] = useState<PrimeMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch user's own membership
  const fetchMyMembership = async () => {
    if (!user?.id) {
      setMembership(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await (supabase as any)
        .from("prime_members")
        .select("*")
        .eq("user_id", user.id)
        .eq("membership_type", membershipType)
        .maybeSingle();

      if (error) throw error;
      
      // Type assertion since DB returns enum as string
      setMembership(data as PrimeMember | null);

      if (data) {
        await fetchGalleryImages(data.id);
      }
    } catch (error) {
      console.error("Error fetching membership:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all active members (for public listing)
  const fetchAllMembers = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("prime_members")
        .select("*")
        .eq("membership_type", membershipType)
        .eq("is_active", true)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAllMembers((data as PrimeMember[]) || []);
    } catch (error) {
      console.error("Error fetching all members:", error);
    }
  };

  // Fetch gallery images for a member
  const fetchGalleryImages = async (memberId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from("prime_gallery")
        .select("*")
        .eq("prime_member_id", memberId)
        .order("display_order", { ascending: true });

      if (error) throw error;
      setGalleryImages((data as PrimeGalleryImage[]) || []);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    }
  };

  // Create new membership
  const createMembership = async (data: CreatePrimeMemberData): Promise<PrimeMember | null> => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a Prime membership.",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data: newMember, error } = await (supabase as any)
        .from("prime_members")
        .insert({
          ...data,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const typedMember = newMember as PrimeMember;
      setMembership(typedMember);
      toast({
        title: "Welcome to Prime!",
        description: "Your Prime membership has been created successfully.",
      });
      return typedMember;
    } catch (error: any) {
      console.error("Error creating membership:", error);
      if (error.code === "23505") {
        toast({
          title: "Already registered",
          description: `You already have a Prime ${membershipType} membership.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create membership. Please try again.",
          variant: "destructive",
        });
      }
      return null;
    }
  };

  // Update membership
  const updateMembership = async (data: UpdatePrimeMemberData): Promise<boolean> => {
    if (!membership?.id) return false;

    try {
      const { error } = await (supabase as any)
        .from("prime_members")
        .update(data)
        .eq("id", membership.id);

      if (error) throw error;

      setMembership(prev => prev ? { ...prev, ...data } : null);
      toast({
        title: "Profile updated",
        description: "Your Prime profile has been updated successfully.",
      });
      return true;
    } catch (error) {
      console.error("Error updating membership:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Upload file to storage
  const uploadFile = async (
    file: File,
    type: "logo" | "cover" | "gallery" | "video"
  ): Promise<string | null> => {
    if (!user?.id || !membership?.id) {
      toast({
        title: "Error",
        description: "Please create a membership first.",
        variant: "destructive",
      });
      return null;
    }

    // Validate file size
    const maxSize = type === "video" ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${type === "video" ? "50MB" : "5MB"}.`,
        variant: "destructive",
      });
      return null;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${membership.id}/${type}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("prime-uploads")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("prime-uploads")
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Upload and update logo
  const uploadLogo = async (file: File): Promise<boolean> => {
    const url = await uploadFile(file, "logo");
    if (!url) return false;
    return updateMembership({ logo_url: url });
  };

  // Upload and update cover image
  const uploadCoverImage = async (file: File): Promise<boolean> => {
    const url = await uploadFile(file, "cover");
    if (!url) return false;
    return updateMembership({ cover_image_url: url });
  };

  // Upload and update video
  const uploadVideo = async (file: File): Promise<boolean> => {
    const url = await uploadFile(file, "video");
    if (!url) return false;
    return updateMembership({ video_url: url });
  };

  // Add gallery image
  const addGalleryImage = async (file: File, caption?: string): Promise<boolean> => {
    if (!membership?.id) return false;

    const url = await uploadFile(file, "gallery");
    if (!url) return false;

    try {
      const { data, error } = await (supabase as any)
        .from("prime_gallery")
        .insert({
          prime_member_id: membership.id,
          image_url: url,
          caption,
          display_order: galleryImages.length,
        })
        .select()
        .single();

      if (error) throw error;

      setGalleryImages(prev => [...prev, data as PrimeGalleryImage]);
      toast({
        title: "Image added",
        description: "Gallery image uploaded successfully.",
      });
      return true;
    } catch (error) {
      console.error("Error adding gallery image:", error);
      toast({
        title: "Error",
        description: "Failed to add gallery image.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Delete gallery image
  const deleteGalleryImage = async (imageId: string): Promise<boolean> => {
    try {
      const { error } = await (supabase as any)
        .from("prime_gallery")
        .delete()
        .eq("id", imageId);

      if (error) throw error;

      setGalleryImages(prev => prev.filter(img => img.id !== imageId));
      toast({
        title: "Image deleted",
        description: "Gallery image removed successfully.",
      });
      return true;
    } catch (error) {
      console.error("Error deleting gallery image:", error);
      toast({
        title: "Error",
        description: "Failed to delete gallery image.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchMyMembership();
    fetchAllMembers();
  }, [user?.id, membershipType]);

  return {
    membership,
    galleryImages,
    allMembers,
    isLoading,
    isUploading,
    createMembership,
    updateMembership,
    uploadLogo,
    uploadCoverImage,
    uploadVideo,
    addGalleryImage,
    deleteGalleryImage,
    refetchMembers: fetchAllMembers,
    refetchMembership: fetchMyMembership,
  };
};
