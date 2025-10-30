
import { useState } from "react";
import { VendorFilterOptions } from "@/types/vendor";
import { useMobileQuery } from "@/hooks/use-mobile";
import { MobileFilter, DesktopFilter } from "./vendors/filters";

interface VendorFilterProps {
  filters: VendorFilterOptions;
  onFilterChange: (filters: VendorFilterOptions) => void;
  categories: { label: string; value: string; }[];
  priceRanges: { label: string; value: string; }[];
  availabilityOptions: { label: string; value: string; }[];
  onReset: () => void;
}

const VendorFilter = ({
  filters,
  onFilterChange,
  categories,
  priceRanges,
  availabilityOptions,
  onReset,
}: VendorFilterProps) => {
  const isMobile = useMobileQuery();
  
  // For mobile devices, use a drawer
  if (isMobile) {
    return (
      <MobileFilter 
        filters={filters}
        onFilterChange={onFilterChange}
        categories={categories}
        priceRanges={priceRanges}
        availabilityOptions={availabilityOptions}
        onReset={onReset}
      />
    );
  }
  
  // For desktop, use a popover
  return (
    <DesktopFilter
      filters={filters}
      onFilterChange={onFilterChange}
      categories={categories}
      priceRanges={priceRanges}
      availabilityOptions={availabilityOptions}
      onReset={onReset}
    />
  );
};

export default VendorFilter;
