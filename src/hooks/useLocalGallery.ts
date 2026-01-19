import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface LocalGalleryItem {
  id: string;
  image: string; // base64 data URL
  title: string;
  eventType: string;
  likes: number;
  comments: number;
  tags: string[];
  uploadedAt: string;
  isUserUpload: true;
}

const STORAGE_KEY = "tpec_gallery_uploads";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB for localStorage limits

export const useLocalGallery = () => {
  const [userUploads, setUserUploads] = useState<LocalGalleryItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Load uploads from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUserUploads(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load gallery uploads:", error);
    }
  }, []);

  // Save to localStorage whenever uploads change
  const saveToStorage = (items: LocalGalleryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save gallery uploads:", error);
      toast.error("Storage limit reached. Try removing some uploads.");
    }
  };

  const uploadPhoto = async (
    file: File,
    title: string,
    eventType: string,
    tags: string[]
  ): Promise<boolean> => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large. Maximum size is 5MB for local storage.");
      return false;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, WEBP).");
      return false;
    }

    setIsUploading(true);

    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const base64 = e.target?.result as string;
          
          const newItem: LocalGalleryItem = {
            id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            image: base64,
            title: title || "My Event",
            eventType: eventType || "Other",
            likes: 0,
            comments: 0,
            tags: tags.length > 0 ? tags : ["@MyEvent"],
            uploadedAt: new Date().toISOString(),
            isUserUpload: true,
          };

          const updatedUploads = [newItem, ...userUploads];
          setUserUploads(updatedUploads);
          saveToStorage(updatedUploads);
          
          toast.success("Photo uploaded successfully! (Saved locally)");
          setIsUploading(false);
          resolve(true);
        } catch (error) {
          console.error("Upload failed:", error);
          toast.error("Failed to upload photo. Please try again.");
          setIsUploading(false);
          resolve(false);
        }
      };

      reader.onerror = () => {
        toast.error("Failed to read file. Please try again.");
        setIsUploading(false);
        resolve(false);
      };

      reader.readAsDataURL(file);
    });
  };

  const deleteUpload = (id: string) => {
    const updatedUploads = userUploads.filter((item) => item.id !== id);
    setUserUploads(updatedUploads);
    saveToStorage(updatedUploads);
    toast.success("Photo removed from your uploads.");
  };

  const clearAllUploads = () => {
    setUserUploads([]);
    localStorage.removeItem(STORAGE_KEY);
    toast.success("All your uploads have been cleared.");
  };

  return {
    userUploads,
    uploadPhoto,
    deleteUpload,
    clearAllUploads,
    isUploading,
  };
};
