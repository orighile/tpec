
// Re-export all utility functions and data from their respective modules
export * from './core';
export * from './venueData';
export * from './culturalData';
export * from './planningData';
export { isLocationMention, handleLocationMention } from './locationUtils';
export * from './conversationUtils';
export * from './eventUtils';

import { PageContext, JaraBotIntent } from "../types";
import { generateVenueResponse, handleEventTypeQuestion } from "./eventUtils";
import { 
  handleShortMessage, 
  detectIntent,
  generateSeatingChartResponse,
  generateMarketplaceResponse,
  generateBudgetResponse,
  generateGuestManagementResponse,
  generateRoadmapResponse,
  generateGeneralResponse,
  nigerianLocations
} from "./conversationUtils";
import { isLocationMention, handleLocationMention } from "./locationUtils";

// Main response generator
export function generateAIResponse(userMessage: string, pageContext: PageContext): string {
  const { page } = pageContext;
  const intent = detectIntent(userMessage.toLowerCase());
  
  // Short messages likely need contextual conversation handling
  if (userMessage.length < 5) {
    return handleShortMessage(userMessage.toLowerCase());
  }
  
  // Location-specific responses (e.g., "lagos")
  if (isLocationMention(userMessage.toLowerCase())) {
    return handleLocationMention(userMessage.toLowerCase(), generateVenueResponse);
  }
  
  // Handle roadmap-specific intents first
  if (intent === 'roadmap-info' || intent === 'project-status') {
    return generateRoadmapResponse(intent);
  }
  
  // Context-aware responses based on current page
  switch (page) {
    case 'seating-chart':
      return generateSeatingChartResponse(userMessage, intent);
    case 'marketplace':
      return generateMarketplaceResponse(userMessage, intent);
    case 'budget':
      return generateBudgetResponse(userMessage, intent);
    case 'guest-management':
      return generateGuestManagementResponse(userMessage, intent);
    case 'roadmap':
      return generateRoadmapResponse(intent);
    default:
      return generateGeneralResponse(userMessage, intent);
  }
}
