
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

type LogoProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  isFooter?: boolean;
  linkToHome?: boolean;
};

const TPECLogo = ({ className, size = 'md', isFooter = false, linkToHome = true }: LogoProps) => {
  // Size mapping for text sizes
  const sizeMap = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl'
  };

  const underlineSize = {
    sm: 'h-0.5 w-24',
    md: 'h-0.5 w-32',
    lg: 'h-1 w-40'
  };
  
  const logoContent = (
    <div className={cn("flex flex-col items-start", className)}>
      <span 
        className={cn(
          "font-bold tracking-wide",
          sizeMap[size],
          isFooter ? "text-white" : "text-purple-800"
        )}
        style={{ fontFamily: "'Anton', sans-serif" }}
      >
        TPEC EVENTS
      </span>
      <div 
        className={cn(
          "bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 rounded-full mt-1",
          underlineSize[size]
        )}
      />
    </div>
  );

  return linkToHome ? (
    <Link to="/" className="flex-shrink-0">
      {logoContent}
    </Link>
  ) : (
    logoContent
  );
};

export default TPECLogo;
