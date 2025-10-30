
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
    <Tabs 
      value={activeTab}
      onValueChange={onTabChange}
      defaultValue="all"
    >
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
        <TabsList className="grid grid-cols-2 w-full sm:w-auto">
          <TabsTrigger value="all">All Vendors</TabsTrigger>
          <TabsTrigger value="saved">Saved ({savedVendorsCount})</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="all" className="mt-4">
        <VendorFilter 
          filters={filters}
          onFilterChange={onFilterChange}
          categories={categories}
          priceRanges={priceRanges}
          availabilityOptions={availabilityOptions}
          onReset={onReset}
        />
      </TabsContent>
      
      <TabsContent value="saved" className="mt-4">
        <VendorFilter 
          filters={filters}
          onFilterChange={onFilterChange}
          categories={categories}
          priceRanges={priceRanges}
          availabilityOptions={availabilityOptions}
          onReset={onReset}
        />
      </TabsContent>
    </Tabs>
  );
};

export default MarketplaceTabs;
