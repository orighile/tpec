
import { Vendor } from "@/types/vendor";
import { vendorReviews } from "@/data/vendors";
import VendorProfile from "../VendorProfile";
import VendorGrid from "./VendorGrid";

interface MarketplaceContentProps {
  isMobile: boolean;
  selectedVendor: Vendor | null;
  filteredVendors: Vendor[];
  savedVendors: string[];
  onSelectVendor: (vendor: Vendor) => void;
  onToggleSave: (vendorId: string) => void;
  onContactVendor: (vendor: Vendor) => void;
  onResetFilters: () => void;
}

const MarketplaceContent = ({
  isMobile,
  selectedVendor,
  filteredVendors,
  savedVendors,
  onSelectVendor,
  onToggleSave,
  onContactVendor,
  onResetFilters
}: MarketplaceContentProps) => {
  return (
    <>
      {!isMobile && selectedVendor && (
        <VendorProfile 
          vendor={selectedVendor}
          reviews={vendorReviews[selectedVendor.id] || []}
          isSaved={savedVendors.includes(selectedVendor.id)}
          onToggleSave={onToggleSave}
          onContact={onContactVendor}
        />
      )}
      
      {(!selectedVendor || isMobile) && (
        <VendorGrid 
          vendors={filteredVendors}
          selectedVendor={selectedVendor}
          savedVendors={savedVendors}
          onSelectVendor={onSelectVendor}
          onToggleSave={onToggleSave}
          onContactVendor={onContactVendor}
          onResetFilters={onResetFilters}
        />
      )}
      
      {isMobile && selectedVendor && (
        <VendorProfile 
          vendor={selectedVendor}
          reviews={vendorReviews[selectedVendor.id] || []}
          isSaved={savedVendors.includes(selectedVendor.id)}
          onToggleSave={onToggleSave}
          onContact={onContactVendor}
        />
      )}
    </>
  );
};

export default MarketplaceContent;
