
import { categories } from "@/data/vendors";
import { cn } from "@/lib/utils";

type SidebarCategoriesProps = {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
};

const SidebarCategories = ({ 
  selectedCategory, 
  onCategoryChange 
}: SidebarCategoriesProps) => {
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <h3 className="font-medium mb-3">Categories</h3>
      <div className="space-y-1">
        {categories.map((category) => (
          <button
            key={category.value}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
              selectedCategory === category.value
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
            onClick={() => onCategoryChange(category.value)}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SidebarCategories;
