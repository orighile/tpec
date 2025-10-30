
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import BrowseCategories from "../components/BrowseCategories";
import VendorHighlights from "../components/VendorHighlights";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import JaraBot from "../components/jarabot";
import FeaturedEvents from "../components/FeaturedEvents";
import CTA from "../components/CTA";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if there's a search query in the URL
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    
    if (query) {
      // Redirect to search page if query exists on homepage
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        
        {/* Inspiring Caption Section */}
        <section className="py-8 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Your Dream Event Starts Here
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the perfect venues, vendors, and planners to bring your vision to life. 
              Let us help you create unforgettable moments.
            </p>
          </div>
        </section>

        <BrowseCategories />
        
        {/* Book a Consultation Section */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <Button 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
              onClick={() => window.open("https://calendly.com/ladyadeolaighile/meet-and-greet", "_blank")}
            >
              Book a Consultation
            </Button>
          </div>
        </section>
        
        <FeaturedEvents />
        <VendorHighlights />
        <CTA />
      </main>
      <Footer />
      <JaraBot />
    </div>
  );
};

export default Index;
