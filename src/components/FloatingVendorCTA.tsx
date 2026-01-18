import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Sparkle, X } from "phosphor-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FloatingVendorCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [vendorHidden, setVendorHidden] = useState(false);
  const [planningHidden, setPlanningHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 400;
      setIsVisible(shouldShow);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Become a Vendor - Left Side */}
      {!vendorHidden && (
        <div
          className={cn(
            "fixed bottom-6 left-6 z-40 transition-all duration-300 transform",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
          )}
        >
          <div className="relative">
            <button
              onClick={() => setVendorHidden(true)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-gray-800 text-white rounded-full text-xs hover:bg-gray-700 transition-colors flex items-center justify-center shadow-md z-10"
              aria-label="Close"
            >
              <X size={12} weight="bold" />
            </button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-jara-gold via-amber-500 to-jara-gold text-white font-bold shadow-2xl hover:shadow-amber-500/30 hover:scale-105 transition-all py-5 px-6 rounded-full"
              asChild
            >
              <Link to="/vendor-onboarding">
                <UserPlus className="mr-2 h-5 w-5" weight="bold" />
                Become a Vendor
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Start Planning - Bottom Center */}
      {!planningHidden && (
        <div
          className={cn(
            "fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 transform",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
          )}
        >
          <div className="relative">
            <button
              onClick={() => setPlanningHidden(true)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-gray-800 text-white rounded-full text-xs hover:bg-gray-700 transition-colors flex items-center justify-center shadow-md z-10"
              aria-label="Close"
            >
              <X size={12} weight="bold" />
            </button>
            <Button
              size="lg"
              className="bg-jara-purple text-white font-bold shadow-2xl hover:bg-jara-purple/90 hover:scale-105 transition-all py-5 px-6 rounded-full"
              asChild
            >
              <Link to="/planning-tools">
                <Sparkle className="mr-2 h-5 w-5" weight="bold" />
                Start Planning
              </Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingVendorCTA;