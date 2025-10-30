
import React, { useState } from "react";
import { VendorFilterOptions } from "@/types/vendor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import FilterControls from "./FilterControls";
import { countActiveFilters } from "./utils";

interface MobileFilterProps {
  filters: VendorFilterOptions;
  onFilterChange: (filters: VendorFilterOptions) => void;
  categories: { label: string; value: string; }[];
  priceRanges: { label: string; value: string; }[];
  availabilityOptions: { label: string; value: string; }[];
  onReset: () => void;
}

const MobileFilter = ({
  filters,
  onFilterChange,
  categories,
  priceRanges,
  availabilityOptions,
  onReset,
}: MobileFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<VendorFilterOptions>(filters);
  const activeFilterCount = countActiveFilters(filters);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchTerm: e.target.value });
  };

  const handleApplyFilters = () => {
    onFilterChange(tempFilters);
    setIsOpen(false);
  };

  const handleResetTempFilters = () => {
    setTempFilters({
      searchTerm: "",
      category: "All Categories",
      priceRange: "any",
      location: "",
      verifiedOnly: false,
      availability: [],
      rating: null,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search vendors..."
          value={filters.searchTerm}
          onChange={handleSearchChange}
          className="pl-10 pr-4"
        />
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="rounded-full">
              {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onReset} className="h-8">
              <X className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          )}
          
          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1 h-8">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filters
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Filter Vendors</DrawerTitle>
              </DrawerHeader>
              <div className="px-4 pb-4">
                <FilterControls
                  tempFilters={tempFilters}
                  setTempFilters={setTempFilters}
                  categories={categories}
                  priceRanges={priceRanges}
                  availabilityOptions={availabilityOptions}
                />
              </div>
              <DrawerFooter className="flex flex-row justify-between">
                <Button variant="outline" onClick={handleResetTempFilters}>
                  Reset
                </Button>
                <DrawerClose asChild>
                  <Button onClick={handleApplyFilters}>
                    Apply Filters
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
};

export default MobileFilter;
