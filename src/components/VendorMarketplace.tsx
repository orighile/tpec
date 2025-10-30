
import { useState, useEffect } from "react";
import { categories } from "@/data/vendors";
import { useVendorMarketplace } from "@/hooks/useVendorMarketplace";
import SidebarCategories from "./vendors/SidebarCategories";
import SidebarVendorInfo from "./vendors/SidebarVendorInfo";
import MarketplaceHeader from "./vendors/MarketplaceHeader";
import MarketplaceTabs from "./vendors/MarketplaceTabs";
import MarketplaceContent from "./vendors/MarketplaceContent";
import { CircleNotch } from "phosphor-react";

const VendorMarketplace = () => {
  const {
    filterOptions,
    setFilterOptions,
    selectedVendor,
    setSelectedVendor,
    activeTab,
    setActiveTab,
    savedVendors,
    filteredVendors,
    resetFilters,
    toggleSaveVendor,
    handleContactVendor,
    isLoading
  } = useVendorMarketplace();
  
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  return (
    <div className="space-y-6">
      <MarketplaceHeader />
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <CircleNotch className="animate-spin h-8 w-8 text-primary" />
          <span className="ml-3 text-lg">Loading vendors...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        {!isMobile && (
          <div className="space-y-6">
            <SidebarCategories 
              selectedCategory={filterOptions.category}
              onCategoryChange={(category) => setFilterOptions({...filterOptions, category})}
            />
            
            {selectedVendor && (
              <SidebarVendorInfo 
                vendor={selectedVendor}
                isSaved={savedVendors.includes(selectedVendor.id)}
                onToggleSave={toggleSaveVendor}
                onContact={handleContactVendor}
              />
            )}
          </div>
        )}
        
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <MarketplaceTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              filters={filterOptions}
              onFilterChange={setFilterOptions}
              onReset={resetFilters}
              savedVendorsCount={savedVendors.length}
            />
          </div>
          
          <MarketplaceContent
            isMobile={isMobile}
            selectedVendor={selectedVendor}
            filteredVendors={filteredVendors}
            savedVendors={savedVendors}
            onSelectVendor={setSelectedVendor}
            onToggleSave={toggleSaveVendor}
            onContactVendor={handleContactVendor}
            onResetFilters={resetFilters}
          />
        </div>
      </div>
      )}
    </div>
  );
};

export default VendorMarketplace;
