import { useState } from "react";
import { cn } from "@/lib/utils";
import TPECLogo from "@/components/TPECLogo";

interface FallbackImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  showFallbackText?: boolean;
}

const FallbackImage = ({ 
  src, 
  alt, 
  className, 
  fallbackClassName,
  showFallbackText = true 
}: FallbackImageProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center bg-muted/30 border border-border",
        className,
        fallbackClassName
      )}>
        <TPECLogo size="sm" linkToHome={false} />
        {showFallbackText && (
          <p className="text-xs text-muted-foreground mt-2 text-center px-2">
            {alt}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center bg-muted/30 animate-pulse",
          className
        )}>
          <TPECLogo size="sm" linkToHome={false} />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={cn("w-full h-full object-cover", className)}
        onError={handleError}
        onLoad={handleLoad}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </div>
  );
};

export default FallbackImage;