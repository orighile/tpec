
import React from "react";
import { VendorFilterOptions } from "@/types/vendor";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterControlsProps {
  tempFilters: VendorFilterOptions;
  setTempFilters: React.Dispatch<React.SetStateAction<VendorFilterOptions>>;
  categories: { label: string; value: string; }[];
  priceRanges: { label: string; value: string; }[];
  availabilityOptions: { label: string; value: string; }[];
}

const FilterControls = ({
  tempFilters,
  setTempFilters,
  categories,
  priceRanges,
  availabilityOptions,
}: FilterControlsProps) => {
  const toggleAvailability = (option: string) => {
    if (tempFilters.availability.includes(option)) {
      setTempFilters({
        ...tempFilters,
        availability: tempFilters.availability.filter(item => item !== option)
      });
    } else {
      setTempFilters({
        ...tempFilters,
        availability: [...tempFilters.availability, option]
      });
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select 
          value={tempFilters.category} 
          onValueChange={(value) => setTempFilters({ ...tempFilters, category: value })}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="priceRange">Price Range</Label>
        <Select 
          value={tempFilters.priceRange} 
          onValueChange={(value) => setTempFilters({ ...tempFilters, priceRange: value })}
        >
          <SelectTrigger id="priceRange">
            <SelectValue placeholder="Select price range" />
          </SelectTrigger>
          <SelectContent>
            {priceRanges.map(range => (
              <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="City or state"
          value={tempFilters.location}
          onChange={(e) => setTempFilters({ ...tempFilters, location: e.target.value })}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Availability</Label>
        <div className="flex flex-wrap gap-2 pt-1">
          {availabilityOptions.map(option => (
            <Badge 
              key={option.value}
              variant={tempFilters.availability.includes(option.value) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleAvailability(option.value)}
            >
              {option.label}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="rating">Minimum Rating</Label>
        <Select 
          value={tempFilters.rating?.toString() || ""} 
          onValueChange={(value) => setTempFilters({ 
            ...tempFilters, 
            rating: value ? parseInt(value, 10) : null 
          })}
        >
          <SelectTrigger id="rating">
            <SelectValue placeholder="Any rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any rating</SelectItem>
            <SelectItem value="3">3+ stars</SelectItem>
            <SelectItem value="4">4+ stars</SelectItem>
            <SelectItem value="5">5 stars only</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2 pt-2">
        <Checkbox
          id="verified"
          checked={tempFilters.verifiedOnly}
          onCheckedChange={(checked) => 
            setTempFilters({ ...tempFilters, verifiedOnly: checked === true })
          }
        />
        <Label htmlFor="verified" className="text-sm font-normal cursor-pointer">
          Verified vendors only
        </Label>
      </div>
    </div>
  );
};

export default FilterControls;
