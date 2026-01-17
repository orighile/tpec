import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

type LogoProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  isFooter?: boolean;
  linkToHome?: boolean;
};

const TPECLogo = ({ className, size = 'md', isFooter = false, linkToHome = true }: LogoProps) => {
  // Size mapping for text
  const sizeMap = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl'
  };
  
  const logoContent = (
    <div className={cn("flex items-baseline gap-1 tracking-wide", sizeMap[size], className)}>
      <span className={cn("font-bold", isFooter ? "text-white" : "text-foreground")}>TPEC</span>
      <span className={cn("font-normal", isFooter ? "text-white/80" : "text-foreground/80")}>Events</span>
    </div>
  );

  return linkToHome ? (
    <Link to="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
      {logoContent}
    </Link>
  ) : (
    logoContent
  );
};

export default TPECLogo;
