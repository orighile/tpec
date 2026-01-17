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
    sm: 'text-xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-4xl'
  };
  
  const logoContent = (
    <div className={cn("flex items-baseline tracking-widest", sizeMap[size], className)}>
      <span className="font-black text-foreground">TPEC</span>
      <span className="font-light text-foreground">EVENTS</span>
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
