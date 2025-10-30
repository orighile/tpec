
// Vendor categories with label/value structure for form components
export const categories = [
  { label: "All Categories", value: "All Categories" },
  { label: "Catering", value: "Catering" },
  { label: "Venue", value: "Venue" },
  { label: "Decoration", value: "Decoration" },
  { label: "Entertainment", value: "Entertainment" },
  { label: "Photography", value: "Photography" },
  { label: "Cakes & Desserts", value: "Cakes & Desserts" }
];

// For backward compatibility with parts of the app still using string arrays
export const categoryStrings = categories.map(cat => cat.value);

export default categories;
