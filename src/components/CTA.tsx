import { Sparkle, UserPlus } from "phosphor-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-jara-purple via-jara-purple to-purple-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-jara-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-jara-gold/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Create an Unforgettable Event?
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Whether you're planning an event or offering services, TPEC is your home for Nigerian celebrations.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* For Event Planners */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full mb-4">
              <Sparkle className="h-4 w-4 text-jara-gold" />
              <span className="text-white text-sm font-medium">For Planners</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Plan Your Perfect Event</h3>
            <p className="text-white/80 text-sm mb-5">
              Access planning tools, find vendors, and make your celebration truly Nigerian.
            </p>
            <Button className="bg-white text-jara-purple hover:bg-white/90 font-bold w-full" asChild>
              <Link to="/planner-benefits">
                <Sparkle className="mr-2 h-4 w-4" />
                Start Planning Now
              </Link>
            </Button>
            <Link to="/planner-benefits" className="block mt-2 text-white/80 text-xs hover:text-white transition-colors">
              Learn more →
            </Link>
          </div>
          
          {/* For Vendors */}
          <div className="bg-gradient-to-br from-jara-gold/20 to-amber-500/20 backdrop-blur-sm rounded-2xl p-6 border border-jara-gold/30 text-center">
            <div className="inline-flex items-center gap-2 bg-jara-gold/30 px-3 py-1 rounded-full mb-4">
              <UserPlus className="h-4 w-4 text-white" weight="bold" />
              <span className="text-white text-sm font-medium">For Vendors</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Grow Your Business</h3>
            <p className="text-white/80 text-sm mb-5">
              Join Nigeria's premier marketplace and get more bookings. It's free!
            </p>
            <Button className="bg-jara-gold hover:bg-amber-500 text-white font-bold w-full" asChild>
              <Link to="/vendor-benefits">
                <UserPlus className="mr-2 h-4 w-4" weight="bold" />
                Register as a Vendor
              </Link>
            </Button>
            <Link to="/vendor-benefits" className="text-white/80 text-xs hover:text-white transition-colors">
              Learn more →
            </Link>
          </div>
        </div>
        
        <p className="text-white/60 text-xs text-center mt-6">
          ✓ Free listing  ✓ Direct bookings  ✓ Verified badge  ✓ Analytics dashboard
        </p>
      </div>
    </section>
  );
};

export default CTA;
