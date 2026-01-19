import { useState } from "react";
import { Envelope, PaperPlaneTilt } from "phosphor-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NewsletterSubscriptionProps {
  className?: string;
  variant?: "default" | "footer" | "blog";
}

const NewsletterSubscription = ({ className = "", variant = "default" }: NewsletterSubscriptionProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // For now, just show success message without database integration
      toast({
        title: "Subscription Successful!",
        description: "Thank you for subscribing to our newsletter. You'll receive updates about the latest event planning tips and trends.",
      });
      
      setEmail("");
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Subscription Failed",
        description: "There was a problem subscribing you to our newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (variant === "footer") {
    return (
      <div className={className}>
        <h3 className="text-white font-bold text-lg mb-4">Subscribe to Our Newsletter</h3>
        <p className="mb-4">Stay updated with the latest events and planning tips</p>
        <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="bg-muted text-foreground px-4 py-2 rounded border border-border focus:outline-none focus:border-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary/90 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </div>
    );
  }

  if (variant === "blog") {
    return (
      <div className={`py-16 bg-primary/10 ${className}`}>
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="flex items-center justify-center mb-6">
            <Envelope className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-muted-foreground mb-8">
            Stay updated with the latest event planning tips, trends, and resources from TPEC
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="px-6 py-3 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary flex-grow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 whitespace-nowrap"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <PaperPlaneTilt className="h-4 w-4 mr-2 animate-pulse" />
                  Subscribing...
                </>
              ) : (
                <>
                  <PaperPlaneTilt className="h-4 w-4 mr-2" />
                  Subscribe
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-background rounded-lg p-6 shadow-sm ${className}`}>
      <div className="flex items-center mb-4">
        <Envelope className="h-6 w-6 text-primary mr-2" />
        <h3 className="text-lg font-semibold">Newsletter</h3>
      </div>
      <p className="text-muted-foreground mb-4 text-sm">
        Get the latest event planning tips and updates delivered to your inbox.
      </p>
      <form onSubmit={handleSubscribe} className="space-y-3">
        <input 
          type="email" 
          placeholder="Enter your email" 
          className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
    </div>
  );
};

export default NewsletterSubscription;