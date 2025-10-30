
import { JaraBotIntent, PageContext } from "../types";
import { handleLocationMention, isLocationMention } from "./locationUtils";
import { handleEventTypeQuestion } from "./eventUtils";

// Nigerian locations for search suggestions
export const nigerianLocations = [
  "lagos", "abuja", "port harcourt", "benin city", "kano", "enugu", "ibadan", 
  "kaduna", "calabar", "akure", "ilorin", "abeokuta", "owerri", "maiduguri",
  "sokoto", "onitsha", "warri", "uyo", "lokoja", "asaba", "jos"
];

// Short message handler
export function handleShortMessage(message: string): string {
  if (message === 'yes' || message === 'yeah' || message === 'yep' || message === 'sure') {
    return "Great! To help you better, could you tell me more about what type of event you're planning? Is it a wedding, birthday, corporate event, or something else?";
  } else if (message === 'no' || message === 'nope') {
    return "No wahala! If you need any assistance with event planning later, just let me know what you're looking for.";
  } else if (message === 'great' || message === 'good' || message === 'nice' || message === 'awesome') {
    return "I'm glad to hear that! What aspect of event planning would you like me to assist you with today?";
  } else if (message === 'what' || message === 'how' || message === 'why') {
    return "I can help with various aspects of Nigerian event planning. For example, I can suggest venues, recommend vendors, help with budget management, or offer cultural insights for traditional ceremonies. What are you interested in?";
  } else {
    return "Could you please share more details about what you're looking for? I can help with venue selection, catering recommendations, budget planning, guest management, and more for your Nigerian event.";
  }
}

// Intent detection
export function detectIntent(message: string): JaraBotIntent {
  // This is a placeholder that would be implemented with a more sophisticated
  // intent detection algorithm, possibly using NLP techniques
  if (message.includes('roadmap') || message.includes('project status')) {
    return 'roadmap-info';
  } else if (message.includes('feature') && (message.includes('request') || message.includes('suggest'))) {
    return 'feature-request';
  } else if (message.includes('budget') || message.includes('cost')) {
    return 'budget-advice';
  } else if (message.includes('guest') || message.includes('attendee')) {
    return 'guest-management';
  } else if (message.includes('venue') || message.includes('location')) {
    return 'venue-selection';
  } else if (message.includes('vendor') || message.includes('supplier')) {
    return 'vendor-search';
  } else if (message.includes('help') || message.includes('assist')) {
    return 'general-help';
  } else {
    return 'unknown';
  }
}

// Page-specific response generators
export function generateSeatingChartResponse(userMessage: string, intent: JaraBotIntent): string {
  // Seating chart specific responses
  return "I can help with your seating chart arrangement. Would you like tips on table layouts, guest groupings, or how to handle special seating requests?";
}

export function generateMarketplaceResponse(userMessage: string, intent: JaraBotIntent): string {
  // Marketplace specific responses
  return "Looking for vendors? I can help you find reliable vendors for your event, compare pricing, or suggest questions to ask before booking.";
}

export function generateBudgetResponse(userMessage: string, intent: JaraBotIntent): string {
  // Budget specific responses
  return "Managing your event budget is crucial. I can provide typical cost breakdowns for Nigerian events, suggest areas where you can save, or help you allocate your budget effectively.";
}

export function generateGuestManagementResponse(userMessage: string, intent: JaraBotIntent): string {
  // Guest management specific responses
  return "Guest management for Nigerian events can be complex. I can help with RSVP tracking, suggest how to handle unexpected guests, or advise on seating arrangements based on Nigerian cultural protocols.";
}

export function generateRoadmapResponse(intent: JaraBotIntent): string {
  // Roadmap specific responses
  return "Our project roadmap shows our progress and upcoming features. We're currently focusing on enhancing guest management and budget planning tools, with vendor marketplace improvements coming soon.";
}

export function generateGeneralResponse(userMessage: string, intent: JaraBotIntent): string {
  // General fallback responses
  if (userMessage.includes('venue') || userMessage.includes('location') || userMessage.includes('place')) {
    return "I can recommend event venues across Nigerian cities based on your guest count, budget, and event type. Would you like suggestions for a specific city like Lagos, Abuja, or Port Harcourt?";
  } else if (userMessage.includes('tradition') || userMessage.includes('cultural') || userMessage.includes('customs')) {
    return handleEventTypeQuestion(userMessage);
  } else if (userMessage.includes('budget') || userMessage.includes('cost') || userMessage.includes('expense')) {
    return "Nigerian event budgets vary widely depending on the type and scale. For example, a standard wedding in Lagos might cost between ₦3-7 million, while a corporate conference could range from ₦2-15 million. Would you like a detailed breakdown for a specific event type?";
  } else {
    return "I'm here to help with all aspects of Nigerian event planning - from venue selection and vendor recommendations to budget management and cultural protocols. What specific area do you need assistance with?";
  }
}
