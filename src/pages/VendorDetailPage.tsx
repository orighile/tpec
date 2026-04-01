import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VendorDetails from "@/components/VendorDetails";
import { Button } from "@/components/ui/button";

import JaraBot from "@/components/jarabot";
import { supabase } from "@/integrations/supabase/client";
import { vendors as localVendors } from "@/data/vendors/vendorsList";

const VendorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendorData, setVendorData] = useState<any>(null);
  const [_reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    loadVendor();
  }, [id]);

  const loadVendor = async () => {
    setLoading(true);
    
    // Try Supabase first
    const { data: dbVendor } = await supabase
      .from("vendors")
      .select("*")
      .eq("id", id!)
      .maybeSingle();

    // Load reviews from Supabase
    const { data: dbReviews } = await supabase
      .from("reviews")
      .select("*")
      .eq("vendor_id", id!)
      .order("created_at", { ascending: false });

    if (dbVendor) {
      const avgRating = dbReviews && dbReviews.length > 0
        ? dbReviews.reduce((sum, r) => sum + r.rating, 0) / dbReviews.length
        : 0;

      setVendorData({
        id: dbVendor.id,
        name: dbVendor.name,
        category: dbVendor.category,
        rating: avgRating || 4.5,
        reviewCount: dbReviews?.length || 0,
        verified: dbVendor.verified || false,
        description: dbVendor.description || dbVendor.about || "",
        images: dbVendor.images?.length ? dbVendor.images : [dbVendor.cover_image_path || "/placeholder.svg"],
        location: dbVendor.location || `${dbVendor.city || ""}, ${dbVendor.state || ""}`,
        phone: dbVendor.contact_phone || "",
        email: dbVendor.contact_email || "",
        website: dbVendor.website || "",
        packages: [],
        reviews: (dbReviews || []).map(r => ({
          id: r.id,
          author: "User",
          date: new Date(r.created_at).toLocaleDateString(),
          rating: r.rating,
          comment: r.comment || ""
        }))
      });
    } else {
      // Fallback to local data
      const localVendor = localVendors.find(v => v.id === id);
      if (localVendor) {
        setVendorData({
          id: localVendor.id,
          name: localVendor.name,
          category: localVendor.category,
          rating: localVendor.rating,
          reviewCount: localVendor.reviewCount,
          verified: localVendor.verified,
          description: localVendor.description,
          images: [localVendor.imageUrl],
          location: localVendor.location,
          phone: localVendor.contactInfo.phone,
          email: localVendor.contactInfo.email,
          website: localVendor.contactInfo.website || "",
          packages: [
            { id: "p1", name: "Basic Package", price: 250000, description: "Perfect for intimate gatherings", features: ["Consultation", "Basic setup", "Up to 50 guests"] },
            { id: "p2", name: "Premium Package", price: 500000, description: "Most popular", features: ["Full planning", "Custom theme", "Up to 150 guests"], isPopular: true },
            { id: "p3", name: "Luxury Package", price: 1200000, description: "Ultimate experience", features: ["End-to-end management", "Premium materials", "Unlimited guests"] }
          ],
          reviews: (dbReviews || []).map(r => ({
            id: r.id,
            author: "User",
            date: new Date(r.created_at).toLocaleDateString(),
            rating: r.rating,
            comment: r.comment || ""
          }))
        });
      }
    }

    setReviews(dbReviews || []);
    setLoading(false);
  };

  const similarVendors = localVendors.filter(v => v.id !== id).slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12 bg-muted/30">
          <div className="container mx-auto px-4 text-center py-20">
            <p className="text-muted-foreground">Loading vendor details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!vendorData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12 bg-muted/30">
          <div className="container mx-auto px-4 text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Vendor Not Found</h2>
            <p className="text-muted-foreground mb-6">The vendor you're looking for doesn't exist.</p>
            <Button asChild><Link to="/vendors">Browse Vendors</Link></Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/vendors" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                <ChevronLeft className="h-4 w-4" />
                Back to Vendors
              </Link>
            </Button>
            
            <VendorDetails vendor={vendorData} />

            {/* Book Now CTA */}
            <div className="mt-6 text-center">
              <Button 
                size="lg" 
                className="px-8"
                onClick={() => navigate(`/vendors/${id}/book`)}
              >
                Book This Vendor
              </Button>
            </div>
            
            {/* Similar Vendors */}
            <div className="mt-8 bg-background p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Similar Vendors</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {similarVendors.map((vendor) => (
                  <Link key={vendor.id} to={`/vendors/${vendor.id}`} className="block">
                    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-video bg-muted">
                        <img src={vendor.imageUrl} alt={vendor.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1">{vendor.name}</h3>
                        <p className="text-muted-foreground text-sm mb-2">{vendor.category}</p>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-3 w-3 fill-secondary text-secondary" />
                          <span>{vendor.rating}</span>
                          <span className="text-muted-foreground">({vendor.reviewCount})</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <JaraBot />
    </div>
  );
};

export default VendorDetailPage;
