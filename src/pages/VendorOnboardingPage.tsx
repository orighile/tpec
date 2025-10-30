
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VendorRegistrationForm from "@/components/vendors/VendorRegistrationForm";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const VendorOnboardingPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect to auth if not logged in
  React.useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to register as a vendor",
        variant: "destructive",
      });
      navigate("/auth", { state: { redirect: "/vendor-onboarding" } });
    }
  }, [user, isLoading, navigate, toast]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Join Our Vendor Marketplace</h1>
              <p className="text-muted-foreground">
                Register your business and connect with potential clients planning their events
              </p>
            </div>
            
            {user ? (
              <VendorRegistrationForm />
            ) : (
              <div className="text-center p-12">
                <p className="mb-4">Please sign in to register as a vendor</p>
                <Button onClick={() => navigate("/auth", { state: { redirect: "/vendor-onboarding" } })}>
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VendorOnboardingPage;
