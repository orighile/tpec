import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type AvatarUploadProps = {
  avatarUrl: string | null | undefined;
  userInitials: string;
  onUpload: (url: string) => void;
};

export function AvatarUpload({ avatarUrl, userInitials, onUpload }: AvatarUploadProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image file.", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please select an image under 5MB.", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      onUpload(publicUrl);
      toast({ title: "Avatar updated", description: "Your profile picture has been updated." });
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative group">
      <Avatar className="h-24 w-24 mx-auto mb-4">
        <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="Profile" />
        <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
          {userInitials}
        </AvatarFallback>
      </Avatar>
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="absolute bottom-3 right-1/2 translate-x-1/2 translate-y-1/2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        <Camera className="h-4 w-4" />
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
      {isUploading && (
        <p className="text-xs text-center text-muted-foreground">Uploading...</p>
      )}
    </div>
  );
}
