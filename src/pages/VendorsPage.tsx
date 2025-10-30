
import Navbar from "../components/Navbar";
import VendorHighlights from "../components/VendorHighlights";
import VendorCategories from "../components/VendorCategories";
import Footer from "../components/Footer";
import JaraBot from "../components/jarabot";
import VendorImportManager from "../components/VendorImportManager";
import { Button } from "@/components/ui/button";
import { UserPlus, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const VendorsPage = () => {
  const [showImportManager, setShowImportManager] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-primary/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Vendor Marketplace</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Find the perfect vendors for your event needs
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/vendors/marketplace">Browse all vendors</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/vendor-onboarding">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register as a Vendor
                </Link>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowImportManager(!showImportManager)}
              >
                <Settings className="mr-2 h-4 w-4" />
                Import Manager
              </Button>
            </div>
          </div>
        </div>
        
        {showImportManager && (
          <div className="container mx-auto px-4 py-8">
            <VendorImportManager />
          </div>
        )}
        
        <VendorCategories />
        <VendorHighlights />
      </main>
      <Footer />
      <JaraBot />
    </div>
  );
};

export default VendorsPage;
