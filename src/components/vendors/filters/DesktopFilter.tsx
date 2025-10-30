
import React, { useState } from "react";
import { VendorFilterOptions } from "@/types/vendor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import FilterControls from "./FilterControls";
import ActiveFilters from "./ActiveFilters";
import { countActiveFilters } from "./utils";

interface DesktopFilterProps {
  filters: VendorFilterOptions;
  onFilterChange: (filters: VendorFilterOptions) => void;
  categories: { label: string; value: string; }[];
  priceRanges: { label: string; value: string; }[];
  availabilityOptions: { label: string; value: string; }[];
  onReset: () => void;
}

const DesktopFilter = ({
  filters,
  onFilterChange,
  categories,
  priceRanges,
  availabilityOptions,
  onReset,
}: DesktopFilterProps) => {
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4 justify-between items-end">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input 
            type="text" 
            placeholder="Search vendors by name or description..." 
            value={filters.searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4"
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <Select 
            value={filters.category} 
            onValueChange={(value) => onFilterChange({ ...filters, category: value })}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={filters.priceRange} 
            onValueChange={(value) => onFilterChange({ ...filters, priceRange: value })}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              {priceRanges.map(range => (
                <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-1 items-center">
                <Filter className="h-4 w-4" />
                More Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1 rounded-full h-5 min-w-5 p-0 flex items-center justify-center">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-6" align="end">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-base">Advanced Filters</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleResetTempFilters} 
                    className="h-7 px-2 text-xs"
                  >
                    Reset
                  </Button>
                </div>
                <FilterControls
                  tempFilters={tempFilters}
                  setTempFilters={setTempFilters}
                  categories={categories}
                  priceRanges={priceRanges}
                  availabilityOptions={availabilityOptions}
                />
                <div className="flex justify-end pt-2">
                  <Button size="sm" onClick={handleApplyFilters}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onReset} className="flex gap-1 items-center">
              <X className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>
      
      <ActiveFilters 
        filters={filters} 
        onFilterChange={onFilterChange} 
        priceRanges={priceRanges} 
      />
    </div>
  );
};

export default DesktopFilter;
