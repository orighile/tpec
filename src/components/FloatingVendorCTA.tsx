import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Sparkle, X } from "phosphor-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FloatingVendorCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 400;
      setIsVisible(shouldShow);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isHidden) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 left-6 z-40 transition-all duration-300 transform",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
      )}
    >
      <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 border border-gray-200">
        {/* Close button */}
        <button
          onClick={() => setIsHidden(true)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white rounded-full text-xs hover:bg-gray-700 transition-colors flex items-center justify-center shadow-md"
          aria-label="Close"
        >
          <X size={14} weight="bold" />
        </button>
        
        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            className="bg-gradient-to-r from-jara-gold via-amber-500 to-jara-gold text-white font-bold shadow-lg hover:shadow-amber-500/30 hover:scale-105 transition-all rounded-full"
            asChild
          >
            <Link to="/vendor-onboarding">
              <UserPlus className="mr-2 h-4 w-4" weight="bold" />
              Become a Vendor
            </Link>
          </Button>
          
          <Button
            size="sm"
            className="bg-jara-purple text-white font-bold shadow-lg hover:bg-jara-purple/90 hover:scale-105 transition-all rounded-full"
            asChild
          >
            <Link to="/planning-tools">
              <Sparkle className="mr-2 h-4 w-4" weight="bold" />
              Start Planning
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FloatingVendorCTA;