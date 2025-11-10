
import { Sparkle, UserPlus } from "phosphor-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-12 relative overflow-hidden bg-jara-purple">
      {/* Solid dark background for maximum contrast */}
      
      
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
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-jara-purple hover:bg-white/90 text-base py-6 px-8" asChild>
              <Link to="/planning-tools">Start Planning Now</Link>
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 text-base py-6 px-8"
              onClick={() => {
                document.querySelector('[role="button"][aria-label="Open JaraBot"]')?.dispatchEvent(
                  new MouseEvent('click', { bubbles: true })
                );
              }}
            >
              Talk to JaraBot
            </Button>
          </div>
          
          {/* Vendor Registration Call-to-Action */}
          <div className="mt-10 pt-8 border-t border-white/20">
            <p className="text-white/90 text-lg mb-4">
              Are you a vendor? Join our marketplace and showcase your services to event planners across Nigeria.
            </p>
            <Button variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20 text-base" asChild>
              <Link to="/vendor-onboarding">
                <UserPlus className="mr-2 h-4 w-4" />
                Register as a Vendor
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
