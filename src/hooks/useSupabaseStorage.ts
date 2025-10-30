
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useSupabaseStorage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const uploadEventImage = async (file: File, eventId: string): Promise<string | null> => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload images.",
        variant: "destructive",
      });
      return null;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${eventId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("event-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("event-images")
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading event image:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload event image. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadVendorImage = async (file: File, vendorId: string): Promise<string | null> => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload images.",
        variant: "destructive",
      });
      return null;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${vendorId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("vendor-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("vendor-images")
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading vendor image:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload vendor image. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (bucket: string, path: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Delete failed",
        description: "Failed to delete image.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    uploadEventImage,
    uploadVendorImage,
    deleteImage,
    isUploading,
  };
};
