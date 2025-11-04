import Hero from "../components/Hero";
import BrowseCategories from "../components/BrowseCategories";
import VendorHighlights from "../components/VendorHighlights";
import { Button } from "@/components/ui/button";
import JaraBot from "../components/jarabot";
import FeaturedEvents from "../components/FeaturedEvents";
import CTA from "../components/CTA";
import { SEO } from "@/components/SEO";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  }, [navigate]);

  return (
    <>
      <SEO 
        title="TPEC Events - Premier Event Planning Services in Lagos, Nigeria | Wedding & Corporate Events"
        description="TPEC Events is Nigeria's leading event planning platform. Find verified vendors, plan weddings, corporate events & celebrations in Lagos, Abuja, Ibeju-Lekki. Book consultation today!"
        keywords="event planning Nigeria, wedding planners Lagos, corporate events Abuja, Ibeju-Lekki events, Nigerian wedding vendors, event management Lagos, party planners Nigeria"
      />
      
      <Hero />
      
      {/* Inspiring Caption Section */}
      <section className="py-16 bg-gradient-to-br from-background via-muted/10 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Your Dream Event Starts Here
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover the perfect venues, vendors, and planners to bring your vision to life. 
            Let us help you create unforgettable moments that celebrate African excellence.
          </p>
        </div>
      </section>

      <BrowseCategories />
      
      {/* Book a Consultation Section */}
      <section className="py-20 bg-gradient-to-br from-primary/8 via-background to-secondary/8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h3 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Ready to Plan Something Amazing?
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book a free consultation with our expert event planners and let's bring your vision to life
          </p>
          <Button 
            variant="premium"
            size="lg"
            className="text-lg px-10 py-6 h-auto"
            onClick={() => window.open("https://calendly.com/ladyadeolaighile/meet-and-greet", "_blank")}
          >
            Book Your Free Consultation
          </Button>
        </div>
      </section>
      
      <FeaturedEvents />
      <VendorHighlights />
      <CTA />
      <JaraBot />
    </>
  );
};

export default Index;
