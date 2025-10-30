
// Availability options with label/value structure
export const availabilityOptions = [
  { label: "Weekdays", value: "Weekdays" },
  { label: "Weekends", value: "Weekends" },
  { label: "Public Holidays", value: "Public Holidays" }
];

// For backward compatibility with parts of the app still using string arrays
export const availabilityStrings = availabilityOptions.map(option => option.value);

export default availabilityOptions;
