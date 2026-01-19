import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File, title: string, eventType: string, tags: string[]) => Promise<boolean>;
  isUploading: boolean;
}

const eventTypes = [
  "Weddings",
  "Birthdays",
  "Corporate",
  "Traditional",
  "Outdoor",
  "Other",
];

export const UploadDialog = ({
  open,
  onOpenChange,
  onUpload,
  isUploading,
}: UploadDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 3) {
      const formattedTag = tagInput.startsWith("@") ? tagInput : `@${tagInput}`;
      if (!tags.includes(formattedTag)) {
        setTags([...tags, formattedTag]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    const success = await onUpload(
      selectedFile,
      title || "My Event",
      eventType || "Other",
      tags
    );

    if (success) {
      resetForm();
      onOpenChange(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreview(null);
    setTitle("");
    setEventType("");
    setTags([]);
    setTagInput("");
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Your Event Photos</DialogTitle>
          <DialogDescription>
            Share your amazing event with the TPEC community. Photos are stored locally in your browser.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File Drop Zone */}
          {!preview ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your photo here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supported formats: JPG, PNG, WEBP (Max 5MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={() => {
                  setSelectedFile(null);
                  setPreview(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              placeholder="e.g., My Wedding Reception"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Event Type Select */}
          <div className="space-y-2">
            <Label>Event Type</Label>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags Input */}
          <div className="space-y-2">
            <Label>Tags (max 3)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add vendor tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                disabled={tags.length >= 3}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                disabled={tags.length >= 3 || !tagInput.trim()}
              >
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Local Storage Notice */}
          <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
            <ImageIcon className="h-4 w-4 inline mr-2" />
            Photos are saved locally in your browser. They'll appear in your gallery but won't be visible to other users.
          </div>

          {/* Submit Button */}
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload Photo"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
