
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VendorDetails from "@/components/VendorDetails";
import { Button } from "@/components/ui/button";
import JaraBot from "@/components/jarabot";

const VendorDetailPage = () => {
  const { id } = useParams();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const similarVendorImages = [
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&h=300&fit=crop",
    "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=600&h=300&fit=crop",
    "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600&h=300&fit=crop"
  ];

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
            
            <VendorDetails />
            
            <div className="mt-8 bg-background p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Similar Vendors</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((item, index) => (
                  <div key={item} className="border rounded-lg overflow-hidden">
                    <div className="aspect-video bg-slate-100">
                      <img 
                        src={similarVendorImages[index]}
                        alt={`Similar vendor ${item}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">Creative Events Nigeria</h3>
                      <p className="text-muted-foreground text-sm mb-3">Event Planning & Decor</p>
                      <Link 
                        to={`/vendors/${item}`}
                        className="text-primary hover:text-primary/90 font-medium flex items-center gap-1 text-sm"
                      >
                        View Details
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Make Your Event Special?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Contact our professional event consultants to help you find the perfect vendors for your event.
              </p>
              <Button className="bg-primary hover:bg-primary/90 px-6 py-6 h-auto text-lg">
                Book a Free Consultation
              </Button>
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
