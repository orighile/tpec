
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

type LogoProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  isFooter?: boolean;
  linkToHome?: boolean;
};

const TPECLogo = ({ className, size = 'md', isFooter = false, linkToHome = true }: LogoProps) => {
  // Size mapping for logo height
  const sizeMap = {
    sm: 'h-10',
    md: 'h-16',
    lg: 'h-20'
  };
  
  const logoContent = (
    <img 
      src="/lovable-uploads/tpec-logo.png" 
      alt="TPEC Events Consulting - Celebrating Africa" 
      className={cn("object-contain", sizeMap[size], className)}
    />
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
