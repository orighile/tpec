
import React from "react";
import { VendorFilterOptions } from "@/types/vendor";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ActiveFiltersProps {
  filters: VendorFilterOptions;
  onFilterChange: (filters: VendorFilterOptions) => void;
  priceRanges: { label: string; value: string; }[];
}

const ActiveFilters = ({ filters, onFilterChange, priceRanges }: ActiveFiltersProps) => {
  if (!hasActiveFilters(filters)) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm text-muted-foreground">Active filters:</span>
      {filters.category !== "All Categories" && (
        <Badge variant="secondary" className="flex gap-1 items-center">
          {filters.category}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onFilterChange({ ...filters, category: "All Categories" })}
          />
        </Badge>
      )}
      {filters.priceRange !== "any" && (
        <Badge variant="secondary" className="flex gap-1 items-center">
          {filters.priceRange}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onFilterChange({ ...filters, priceRange: "any" })}
          />
        </Badge>
      )}
      {filters.verifiedOnly && (
        <Badge variant="secondary" className="flex gap-1 items-center">
          Verified Only
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onFilterChange({ ...filters, verifiedOnly: false })}
          />
        </Badge>
      )}
      {filters.location && (
        <Badge variant="secondary" className="flex gap-1 items-center">
          Location: {filters.location}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onFilterChange({ ...filters, location: "" })}
          />
        </Badge>
      )}
      {filters.rating !== null && (
        <Badge variant="secondary" className="flex gap-1 items-center">
          {filters.rating}+ Stars
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onFilterChange({ ...filters, rating: null })}
          />
        </Badge>
      )}
      {filters.availability.map(avail => (
        <Badge key={avail} variant="secondary" className="flex gap-1 items-center">
          {avail}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onFilterChange({ 
              ...filters, 
              availability: filters.availability.filter(a => a !== avail) 
            })}
          />
        </Badge>
      ))}
    </div>
  );
};

function hasActiveFilters(filters: VendorFilterOptions): boolean {
  return (
    filters.category !== "All Categories" ||
    filters.priceRange !== "any" ||
    filters.verifiedOnly ||
    !!filters.location ||
    filters.rating !== null ||
    filters.availability.length > 0
  );
}

export default ActiveFilters;
