
// Price range options with label/value structure
export const priceRanges = [
  { label: "any", value: "any" },
  { label: "₦", value: "₦" },
  { label: "₦₦", value: "₦₦" },
  { label: "₦₦₦", value: "₦₦₦" },
  { label: "₦₦₦₦", value: "₦₦₦₦" }
];

// For backward compatibility with parts of the app still using string arrays
export const priceRangeStrings = priceRanges.map(range => range.value);

export default priceRanges;
