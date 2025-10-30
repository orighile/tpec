import * as React from "react";
import { cn } from "@/lib/utils";

export interface SecureInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  sanitize?: boolean;
  maxLength?: number;
  allowedChars?: RegExp;
}

const SecureInput = React.forwardRef<HTMLInputElement, SecureInputProps>(
  ({ className, type, sanitize = true, maxLength, allowedChars, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      
      // Apply character restrictions
      if (allowedChars && value) {
        value = value.replace(allowedChars, '');
      }
      
      // Apply length restrictions
      if (maxLength && value.length > maxLength) {
        value = value.substring(0, maxLength);
      }
      
      // Basic XSS sanitization
      if (sanitize && value) {
        value = value
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;');
      }
      
      // Create a new event with sanitized value
      const sanitizedEvent = {
        ...e,
        target: {
          ...e.target,
          value: value,
        },
      };
      
      onChange?.(sanitizedEvent as React.ChangeEvent<HTMLInputElement>);
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onChange={handleChange}
        maxLength={maxLength}
        {...props}
      />
    );
  }
);
SecureInput.displayName = "SecureInput";

export { SecureInput };