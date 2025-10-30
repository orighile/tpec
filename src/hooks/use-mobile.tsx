
import { useState, useEffect } from "react";

// Default breakpoint for mobile screens
const MOBILE_BREAKPOINT = 768;

export function useMobileQuery(breakpoint: number = MOBILE_BREAKPOINT): boolean {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Run on initial mount
    checkMobile();

    // Set up event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Clean up event listener
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  return isMobile;
}

// Alias function that returns the same value as useMobileQuery
export const useIsMobile = useMobileQuery;
