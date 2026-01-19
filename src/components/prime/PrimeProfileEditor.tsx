import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Camera,
  Image as ImageIcon,
  Video,
  Plus,
  Trash2,
  Loader2,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Crown,
  Save,
} from "lucide-react";
import {
  PrimeMember,
  PrimeGalleryImage,
  UpdatePrimeMemberData,
} from "@/hooks/usePrimeMembership";

interface PrimeProfileEditorProps {
  membership: PrimeMember;
  galleryImages: PrimeGalleryImage[];
  isUploading: boolean;
  onUpdate: (data: UpdatePrimeMemberData) => Promise<boolean>;
  onUploadLogo: (file: File) => Promise<boolean>;
  onUploadCover: (file: File) => Promise<boolean>;
  onUploadVideo: (file: File) => Promise<boolean>;
  onAddGalleryImage: (file: File, caption?: string) => Promise<boolean>;
  onDeleteGalleryImage: (id: string) => Promise<boolean>;
}

export const PrimeProfileEditor = ({
  membership,
  galleryImages,
  isUploading,
  onUpdate,
  onUploadLogo,
  onUploadCover,
  onUploadVideo,
  onAddGalleryImage,
  onDeleteGalleryImage,
}: PrimeProfileEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdatePrimeMemberData>({
    business_name: membership.business_name,
    business_description: membership.business_description || "",
    contact_email: membership.contact_email || "",
    contact_phone: membership.contact_phone || "",
    website: membership.website || "",
    location: membership.location || "",
    category: membership.category || "",
    price_range: membership.price_range || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setIsSaving(true);
    const success = await onUpdate(formData);
    if (success) {
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    handler: (file: File) => Promise<boolean>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      await handler(file);
    }
    e.target.value = "";
  };

  const typeLabel = membership.membership_type === "vendor" ? "Vendor" : "Planner";

  return (
    <div className="space-y-8">
      {/* Header with Cover Image */}
      <Card className="overflow-hidden">
        <div className="relative h-48 md:h-64 bg-gradient-to-br from-primary/20 to-accent/20">
          {membership.cover_image_url ? (
            <img
              src={membership.cover_image_url}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}
          <Button
            size="sm"
            variant="secondary"
            className="absolute bottom-4 right-4"
            onClick={() => coverInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4 mr-2" />}
            Change Cover
          </Button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e, onUploadCover)}
          />
        </div>

        {/* Profile Info */}
        <CardContent className="relative pt-16 pb-6">
          {/* Logo */}
          <div className="absolute -top-12 left-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-xl bg-background border-4 border-background shadow-lg overflow-hidden">
                {membership.logo_url ? (
                  <img
                    src={membership.logo_url}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Crown className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
              </div>
              <Button
                size="icon"
                variant="secondary"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                onClick={() => logoInputRef.current?.click()}
                disabled={isUploading}
              >
                <Camera className="h-4 w-4" />
              </Button>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, onUploadLogo)}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold">{membership.business_name}</h1>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Prime {typeLabel}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {membership.category && (
                  <Badge variant="outline">{membership.category}</Badge>
                )}
                {membership.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {membership.location}
                  </span>
                )}
                {membership.price_range && (
                  <span>{membership.price_range}</span>
                )}
              </div>
            </div>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              ) : (
                "Edit Profile"
              )}
            </Button>
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap gap-4 mt-4">
            {membership.contact_email && (
              <a
                href={`mailto:${membership.contact_email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                {membership.contact_email}
              </a>
            )}
            {membership.contact_phone && (
              <a
                href={`tel:${membership.contact_phone}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                {membership.contact_phone}
              </a>
            )}
            {membership.website && (
              <a
                href={membership.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Website
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your business information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Business Name</Label>
              <Input
                value={formData.business_name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, business_name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.business_description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, business_description: e.target.value }))
                }
                rows={4}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, contact_email: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, contact_phone: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                type="url"
                value={formData.website}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, website: e.target.value }))
                }
              />
            </div>
            <Button onClick={handleSave} disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          {membership.business_description ? (
            <p className="text-muted-foreground whitespace-pre-wrap">
              {membership.business_description}
            </p>
          ) : (
            <p className="text-muted-foreground italic">
              No description added yet. Click "Edit Profile" to add one.
            </p>
          )}
          {membership.services && membership.services.length > 0 && (
            <>
              <Separator className="my-4" />
              <div>
                <h4 className="font-medium mb-2">Services</h4>
                <div className="flex flex-wrap gap-2">
                  {membership.services.map((service, idx) => (
                    <Badge key={idx} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Video Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Video</CardTitle>
            <CardDescription>Showcase your work with a video (max 50MB)</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => videoInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4 mr-2" />}
            {membership.video_url ? "Replace Video" : "Add Video"}
          </Button>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e, onUploadVideo)}
          />
        </CardHeader>
        {membership.video_url && (
          <CardContent>
            <video
              src={membership.video_url}
              controls
              className="w-full max-h-96 rounded-lg"
            />
          </CardContent>
        )}
      </Card>

      {/* Gallery Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gallery</CardTitle>
            <CardDescription>Showcase your best work (max 5MB per image)</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => galleryInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
            Add Image
          </Button>
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e, (file) => onAddGalleryImage(file))}
          />
        </CardHeader>
        <CardContent>
          {galleryImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((image) => (
                <div key={image.id} className="relative group aspect-square rounded-lg overflow-hidden">
                  <img
                    src={image.image_url}
                    alt={image.caption || "Gallery image"}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onDeleteGalleryImage(image.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No gallery images yet</p>
              <p className="text-sm">Add photos to showcase your work</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
