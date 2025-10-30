
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

const MarketplaceHeader = () => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-bold">Vendor Marketplace</h2>
          <p className="text-muted-foreground">Find and connect with the best vendors for your event</p>
        </div>
        
        <Button asChild>
          <Link to="/vendor-onboarding" className="whitespace-nowrap">
            <UserPlus className="mr-2 h-4 w-4" />
            Register as a Vendor
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default MarketplaceHeader;
