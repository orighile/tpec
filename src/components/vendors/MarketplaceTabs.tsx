
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VendorFilter from "../VendorFilter";
import { VendorFilterOptions } from "@/types/vendor";
import { categories, priceRanges, availabilityOptions } from "@/data/vendors";

interface MarketplaceTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  filters: VendorFilterOptions;
  onFilterChange: (filters: VendorFilterOptions) => void;
  onReset: () => void;
  savedVendorsCount: number;
}

const MarketplaceTabs = ({ 
  activeTab, 
  onTabChange, 
  filters, 
  onFilterChange, 
  onReset, 
  savedVendorsCount 
}: MarketplaceTabsProps) => {
  return (
    <div className="space-y-4">
      <Tabs 
        value={activeTab}
        onValueChange={onTabChange}
        defaultValue="all"
        className="w-full"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-4">
          <TabsList className="grid grid-cols-2 w-full sm:w-auto">
            <TabsTrigger value="all">All Vendors</TabsTrigger>
            <TabsTrigger value="saved">Saved ({savedVendorsCount})</TabsTrigger>
          </TabsList>
          
          <VendorFilter 
            filters={filters}
            onFilterChange={onFilterChange}
            categories={categories}
            priceRanges={priceRanges}
            availabilityOptions={availabilityOptions}
            onReset={onReset}
          />
        </div>
      </Tabs>
    </div>
  );
};

export default MarketplaceTabs;
