import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserPlus } from "phosphor-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FloatingVendorCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 400px
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
        "fixed bottom-6 right-6 z-50 transition-all duration-300 transform",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
      )}
    >
      <div className="relative">
        {/* Close button */}
        <button
          onClick={() => setIsHidden(true)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white rounded-full text-xs hover:bg-gray-700 transition-colors flex items-center justify-center shadow-md"
          aria-label="Close"
        >
          ×
        </button>
        
        <Button
          size="lg"
          className="bg-gradient-to-r from-jara-gold via-amber-500 to-jara-gold text-white font-bold shadow-2xl hover:shadow-amber-500/30 hover:scale-105 transition-all py-5 px-6 rounded-full animate-pulse hover:animate-none"
          asChild
        >
          <Link to="/vendor-onboarding">
            <UserPlus className="mr-2 h-5 w-5" weight="bold" />
            Become a Vendor
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default FloatingVendorCTA;
