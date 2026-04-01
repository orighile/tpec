
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Envelope, Calendar, PencilSimple, FloppyDisk, X, ArrowLeft } from "phosphor-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { MyEventsSection } from "@/components/profile/MyEventsSection";

const AccountStats = ({ userId }: { userId?: string }) => {
  const [stats, setStats] = useState({ events: 0, vendors: 0, reviews: 0 });

  useEffect(() => {
    if (!userId) return;
    const fetchStats = async () => {
      const [eventsRes, vendorsRes, reviewsRes] = await Promise.all([
        supabase.from("events").select("id", { count: "exact", head: true }).eq("owner_user_id", userId),
        supabase.from("saved_vendors").select("vendor_id", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("reviews").select("id", { count: "exact", head: true }).eq("user_id", userId),
      ]);
      setStats({
        events: eventsRes.count ?? 0,
        vendors: vendorsRes.count ?? 0,
        reviews: reviewsRes.count ?? 0,
      });
    };
    fetchStats();
  }, [userId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
      <div className="p-4 bg-muted rounded-lg">
        <div className="text-2xl font-bold text-primary">{stats.events}</div>
        <div className="text-sm text-muted-foreground">Events Created</div>
      </div>
      <div className="p-4 bg-muted rounded-lg">
        <div className="text-2xl font-bold text-primary">{stats.vendors}</div>
        <div className="text-sm text-muted-foreground">Vendors Saved</div>
      </div>
      <div className="p-4 bg-muted rounded-lg">
        <div className="text-2xl font-bold text-primary">{stats.reviews}</div>
        <div className="text-sm text-muted-foreground">Reviews Written</div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { user } = useAuth();
  const { profile, isLoading, updateProfile, refetchProfile } = useProfile();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    phone: "",
  });

  // Update form data when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || "",
        username: profile.username || "",
        phone: (profile as any).phone || "",
      });
    }
  }, [profile]);

  const userInitials = profile?.full_name 
    ? profile.full_name.charAt(0).toUpperCase() 
    : user?.email?.charAt(0).toUpperCase() || "U";
  
  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown";

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        full_name: formData.fullName,
        username: formData.username,
        phone: formData.phone,
      } as any);
      setIsEditing(false);
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: profile?.full_name || "",
      username: profile?.username || "",
      phone: (profile as any)?.phone || "",
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <AvatarUpload
                  avatarUrl={profile?.avatar_url}
                  userInitials={userInitials}
                  onUpload={(url) => {
                    refetchProfile();
                  }}
                />
                <CardTitle>{profile?.full_name || "User"}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Envelope className="h-4 w-4" />
                    <span>Email verified</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Member since {memberSince}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and information
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                >
                  {isEditing ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <PencilSimple className="h-4 w-4 mr-2" />
                      Edit
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Enter your username"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                </div>

                {isEditing && (
                  <>
                    <Separator />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={isSaving}>
                        <FloppyDisk className="h-4 w-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Account Statistics */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Account Activity</CardTitle>
                <CardDescription>Your event planning activity overview</CardDescription>
              </CardHeader>
              <CardContent>
                <AccountStats userId={user?.id} />
              </CardContent>
            </Card>

            {/* My Events */}
            <MyEventsSection />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
