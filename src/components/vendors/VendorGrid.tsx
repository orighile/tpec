
import VendorCard from "./VendorCard";
import EmptyVendorState from "./EmptyVendorState";
import { Vendor } from "@/types/vendor";

interface VendorGridProps {
  vendors: Vendor[];
  selectedVendor: Vendor | null;
  savedVendors: string[];
  onSelectVendor: (vendor: Vendor) => void;
  onToggleSave: (vendorId: string) => void;
  onContactVendor: (vendor: Vendor) => void;
  onResetFilters: () => void;
}

const VendorGrid = ({
  vendors,
  selectedVendor,
  savedVendors,
  onSelectVendor,
  onToggleSave,
  onContactVendor,
  onResetFilters
}: VendorGridProps) => {
  if (vendors.length === 0) {
    return <EmptyVendorState onResetFilters={onResetFilters} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vendors.map((vendor) => (
        <VendorCard 
          key={vendor.id}
          vendor={vendor}
          isSelected={selectedVendor?.id === vendor.id}
          isSaved={savedVendors.includes(vendor.id)}
          onSelect={onSelectVendor}
          onToggleSave={onToggleSave}
          onContact={onContactVendor}
        />
      ))}
    </div>
  );
};

export default VendorGrid;
