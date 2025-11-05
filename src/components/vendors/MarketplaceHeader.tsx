
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

const MarketplaceHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Vendor Marketplace</h1>
        <p className="text-muted-foreground">Find and connect with the best vendors for your event</p>
      </div>
      
      <Button asChild size="lg">
        <Link to="/vendor-onboarding" className="whitespace-nowrap">
          <UserPlus className="mr-2 h-4 w-4" />
          Register as Vendor
        </Link>
      </Button>
    </div>
  );
};

export default MarketplaceHeader;
