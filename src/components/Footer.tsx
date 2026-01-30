
import { FacebookLogo, InstagramLogo, Envelope, MapPin, Phone } from "phosphor-react";
import { Button } from "@/components/ui/button";
import TPECLogo from "./TPECLogo";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { subscribeToNewsletter } from "@/utils/emailIntegration";

const Footer = () => {
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
      const result = await subscribeToNewsletter(email);
      
      if (result.success) {
        toast({
          title: "Successfully Subscribed!",
          description: "You'll receive our latest event tips and updates at " + email,
        });
        setEmail("");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-foreground text-background/80 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <TPECLogo isFooter size="lg" className="mb-4" linkToHome={false} />
            <p className="mb-4">
              Nigeria's premier event planning platform, helping you create memorable experiences.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/tpeceventsconsulting/" target="_blank" rel="noopener noreferrer" className="text-background/60 hover:text-background transition-colors">
                <FacebookLogo className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/tpec.eventsconsulting/" target="_blank" rel="noopener noreferrer" className="text-background/60 hover:text-background transition-colors">
                <InstagramLogo className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-background font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/planning-tools" className="hover:text-background transition-colors">Planning Tools</Link></li>
              <li><Link to="/planners" className="hover:text-background transition-colors">Planners</Link></li>
              <li><Link to="/vendors/marketplace" className="hover:text-background transition-colors">Vendors</Link></li>
              <li><Link to="/venues" className="hover:text-background transition-colors">Venues</Link></li>
              <li><Link to="/chief" className="hover:text-background transition-colors">Chief AI</Link></li>
              <li><Link to="/blog" className="hover:text-background transition-colors">Blog</Link></li>
              <li><Link to="/community" className="hover:text-background transition-colors">Community</Link></li>
              <li><Link to="/faq" className="hover:text-background transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-background font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Envelope className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="mailto:info@tpecevents.com" className="hover:text-background transition-colors">info@tpecevents.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span>+2349053065636</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <address className="not-italic">
                  Ibeju-Lekki Lagos,<br />
                  Nigeria
                </address>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-background font-bold text-lg mb-4">Subscribe to Our Newsletter</h3>
            <p className="mb-4">Stay updated with the latest events and planning tips</p>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-background/10 text-background px-4 py-2 rounded border border-background/20 focus:outline-none focus:border-primary placeholder:text-background/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-background/20 pt-8 mt-8 text-sm text-center text-background/60">
          <p>&copy; {new Date().getFullYear()} TPEC. All rights reserved.</p>
            <div className="mt-2 space-x-4">
            <Link to="/privacy" className="hover:text-background transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-background transition-colors">Terms of Service</Link>
            <Link to="/disclaimer" className="hover:text-background transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
