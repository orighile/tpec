import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface LocalGalleryItem {
  id: string;
  image: string; // base64 data URL (compressed)
  title: string;
  eventType: string;
  likes: number;
  comments: number;
  tags: string[];
  uploadedAt: string;
  isUserUpload: true;
}

const STORAGE_KEY = "tpec_gallery_uploads";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB input limit
const MAX_WIDTH = 1200; // Max width for compressed image
const MAX_HEIGHT = 1200; // Max height for compressed image
const COMPRESSION_QUALITY = 0.7; // JPEG quality (0-1)

// Compress image using Canvas API
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Calculate new dimensions maintaining aspect ratio
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to JPEG with compression
        const compressedBase64 = canvas.toDataURL("image/jpeg", COMPRESSION_QUALITY);
        
        // Log compression stats
        const originalSize = (e.target?.result as string).length;
        const compressedSize = compressedBase64.length;
        const savings = Math.round((1 - compressedSize / originalSize) * 100);
        console.log(`Image compressed: ${Math.round(originalSize / 1024)}KB → ${Math.round(compressedSize / 1024)}KB (${savings}% savings)`);
        
        resolve(compressedBase64);
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

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
      toast.error("File too large. Maximum size is 10MB.");
      return false;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, WEBP).");
      return false;
    }

    setIsUploading(true);

    try {
      // Compress the image before storing
      const compressedBase64 = await compressImage(file);
      
      const newItem: LocalGalleryItem = {
        id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        image: compressedBase64,
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
      
      toast.success("Photo uploaded & compressed successfully!");
      setIsUploading(false);
      return true;
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload photo. Please try again.");
      setIsUploading(false);
      return false;
    }
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

  // Get storage usage stats
  const getStorageStats = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || "[]";
      const usedBytes = new Blob([stored]).size;
      const usedMB = (usedBytes / (1024 * 1024)).toFixed(2);
      return {
        usedBytes,
        usedMB,
        itemCount: userUploads.length,
      };
    } catch {
      return { usedBytes: 0, usedMB: "0", itemCount: 0 };
    }
  };

  return {
    userUploads,
    uploadPhoto,
    deleteUpload,
    clearAllUploads,
    isUploading,
    getStorageStats,
  };
};
