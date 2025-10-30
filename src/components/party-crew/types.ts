
import { PartyCrewMember } from "@/components/jarabot";

// Constants
export const CREW_ROLES = [
  "Event Coordinator",
  "Venue Liaison",
  "Catering Manager",
  "Entertainment Coordinator",
  "Guest Relations",
  "Transportation Manager",
  "Setup Crew",
  "Cleanup Crew",
  "Photographer/Videographer",
  "Social Media Manager"
];

// Form data type
export interface MemberFormData {
  name: string;
  role: string;
  contact: string;
  tasks: string[];
}

export const DEFAULT_MEMBER_FORM: MemberFormData = {
  name: "",
  role: "",
  contact: "",
  tasks: [""]
};

// Sample data is now replaced with actual data management
// This file now contains only type definitions and constants
