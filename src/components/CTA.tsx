
import { Sparkle, UserPlus } from "phosphor-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-12 relative overflow-hidden">
      {/* Vendor Registration - TOP PRIORITY */}
      <div className="bg-gradient-to-r from-jara-gold via-amber-500 to-jara-gold py-10 mb-0">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <UserPlus className="h-5 w-5 text-white" weight="bold" />
              <span className="text-white font-bold text-sm uppercase tracking-wide">For Vendors</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Grow Your Event Business With TPEC
            </h2>
            
            <p className="text-white/95 text-lg mb-6 max-w-2xl mx-auto">
              Join Nigeria's premier event marketplace. Showcase your services to thousands of event planners and get more bookings.
            </p>
            
            <Button 
              size="lg"
              className="bg-white text-jara-gold hover:bg-white/90 text-lg font-bold py-6 px-10 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              asChild
            >
              <Link to="/vendor-onboarding">
                <UserPlus className="mr-2 h-5 w-5" weight="bold" />
                Register as a Vendor — It's Free
              </Link>
            </Button>
            
            <p className="text-white/80 text-sm mt-4">
              ✓ Free listing  ✓ Direct bookings  ✓ Verified badge  ✓ Analytics dashboard
            </p>
          </div>
        </div>
      </div>
      
      {/* Event Planners CTA */}
      <div className="bg-jara-purple py-12">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-jara-purple/30 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkle className="h-4 w-4 text-jara-gold" />
              <span className="text-white font-medium text-sm">Plan Your Next Event with Confidence</span>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Create an Unforgettable Event?
            </h2>
            
            <p className="text-white/90 text-lg mb-8">
              From traditional ceremonies to modern celebrations, our culturally aware planning tools and JaraBot AI assistant make event planning simple, collaborative, and truly Nigerian.
            </p>
            
            <div className="flex justify-center">
              <Button className="bg-white text-jara-purple hover:bg-white/90 text-base py-6 px-8" asChild>
                <Link to="/planning-tools">Start Planning Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
