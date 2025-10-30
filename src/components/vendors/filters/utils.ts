
import { VendorFilterOptions } from "@/types/vendor";

export const countActiveFilters = (filters: VendorFilterOptions): number => {
  return Object.entries(filters).reduce((count, [key, value]) => {
    if (key === 'searchTerm' && value) return count + 1;
    if (key === 'category' && value !== 'All Categories') return count + 1;
    if (key === 'priceRange' && value !== 'any') return count + 1;
    if (key === 'location' && value) return count + 1;
    if (key === 'verifiedOnly' && value) return count + 1;
    if (key === 'availability' && value.length > 0) return count + 1;
    if (key === 'rating' && value !== null) return count + 1;
    return count;
  }, 0);
};
