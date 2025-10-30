
export type GuestRsvpStatus = 'pending' | 'confirmed' | 'declined';

export interface Guest {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  rsvp_status: string; // Changed to string to match database
  meal_preference: string;
  guest_group: string;
  table_assignment: string;
  plus_one: boolean;
  notes: string;
  event_id: string;
  created_at: string;
  updated_at: string;
}

export interface NewGuestForm {
  full_name: string;
  email: string;
  phone: string;
  rsvp_status: GuestRsvpStatus;
  meal_preference: string;
  guest_group: string;
  table_assignment: string;
  plus_one: boolean;
  notes: string;
}

export interface UpdateGuestForm {
  full_name: string;
  email: string;
  phone: string;
  rsvp_status: GuestRsvpStatus;
  meal_preference: string;
  guest_group: string;
  table_assignment: string;
  plus_one: boolean;
  notes: string;
}

export interface CreateGuestForm extends NewGuestForm {
  event_id: string;
}

export interface GuestStats {
  pending: number;
  confirmed: number;
  declined: number;
  total: number;
  plusOnes: number;
}

// Add missing RsvpStats type
export interface RsvpStats {
  pending: number;
  confirmed: number;
  declined: number;
  total: number;
  plusOnes: number;
}

// Add missing constants
export const guestGroups = [
  'Family',
  'Friends',
  'Work Colleagues',
  'School Friends',
  'Wedding Party',
  'Plus Ones',
  'Other'
];

export const mealPreferences = [
  'No Preference',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Kosher',
  'Halal',
  'Pescatarian',
  'Other Dietary Restrictions'
];
