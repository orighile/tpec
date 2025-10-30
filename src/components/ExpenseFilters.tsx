
import { useState } from "react";
import { Funnel, MagnifyingGlass, Sliders } from "phosphor-react";
import { ExpenseFilter } from "@/types/budget";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMobileQuery } from "@/hooks/use-mobile";

interface ExpenseFiltersProps {
  filters: ExpenseFilter;
  onFilterChange: (filters: ExpenseFilter) => void;
  categories: string[];
}

const ExpenseFilters = ({ filters, onFilterChange, categories }: ExpenseFiltersProps) => {
  const isMobile = useMobileQuery();
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<ExpenseFilter>(filters);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    onFilterChange({ ...filters, category: value });
  };

  const handlePaidStatusChange = (value: "all" | "paid" | "unpaid") => {
    onFilterChange({ ...filters, paidStatus: value });
  };

  const handleApplyFilters = () => {
    onFilterChange(tempFilters);
    setIsAdvancedFilterOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters: ExpenseFilter = {
      category: "all",
      paidStatus: "all",
      search: "",
    };
    setTempFilters(resetFilters);
    onFilterChange(resetFilters);
    setIsAdvancedFilterOpen(false);
  };

  const FilterControls = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Search</label>
        <Input
          placeholder="Search expenses..."
          value={tempFilters.search}
          onChange={(e) => setTempFilters({ ...tempFilters, search: e.target.value })}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select 
          value={tempFilters.category} 
          onValueChange={(value) => setTempFilters({ ...tempFilters, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select 
          value={tempFilters.paidStatus} 
          onValueChange={(value: "all" | "paid" | "unpaid") => 
            setTempFilters({ ...tempFilters, paidStatus: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Items" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="paid">Paid Only</SelectItem>
            <SelectItem value="unpaid">Unpaid Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  // For mobile, use a drawer
  if (isMobile) {
    return (
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-8 pr-4 w-full"
          />
        </div>
        
        <Drawer open={isAdvancedFilterOpen} onOpenChange={setIsAdvancedFilterOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" size="icon">
              <Sliders className="h-4 w-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Filters</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 py-2">
              <FilterControls />
            </div>
            <DrawerFooter className="flex flex-row justify-between">
              <Button variant="outline" onClick={handleResetFilters}>
                Reset
              </Button>
              <DrawerClose asChild>
                <Button onClick={handleApplyFilters}>Apply Filters</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  // For desktop, use a popover
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-64">
        <MagnifyingGlass className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search expenses..."
          value={filters.search}
          onChange={handleSearchChange}
          className="pl-8 pr-4"
        />
      </div>
      
      <Select value={filters.category} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select 
        value={filters.paidStatus} 
        onValueChange={handlePaidStatusChange as (value: string) => void}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Items</SelectItem>
          <SelectItem value="paid">Paid Only</SelectItem>
          <SelectItem value="unpaid">Unpaid Only</SelectItem>
        </SelectContent>
      </Select>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <Funnel className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-4">
            <h4 className="font-medium">Advanced Filters</h4>
            <FilterControls />
            <div className="flex justify-between pt-2">
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Reset
              </Button>
              <Button size="sm" onClick={handleApplyFilters}>
                Apply Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ExpenseFilters;
