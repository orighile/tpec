
import { JaraBotIntent, PageContext } from "../types";
import { handleLocationMention, isLocationMention } from "./locationUtils";
import { handleEventTypeQuestion } from "./eventUtils";

// Nigerian locations for search suggestions - comprehensive list
export const nigerianLocations = [
  "lagos", "abuja", "port harcourt", "benin city", "kano", "enugu", "ibadan", 
  "kaduna", "calabar", "akure", "ilorin", "abeokuta", "owerri", "maiduguri",
  "sokoto", "onitsha", "warri", "uyo", "lokoja", "asaba", "jos", "yola",
  "makurdi", "bauchi", "aba", "zaria", "ife", "osogbo", "ekiti", "delta",
  "victoria island", "lekki", "ikeja", "surulere", "yaba", "ikoyi", "ajah",
  "festac", "apapa", "gbagada", "magodo", "ikorodu", "epe", "badagry",
  "garki", "wuse", "maitama", "asokoro", "gwarinpa", "jabi", "utako",
  "gra", "trans amadi", "d-line", "old gra", "new gra", "rumuokwurusi"
];

// Nigerian vendor categories
export const nigerianVendorCategories = [
  "caterers", "dj", "mc", "decorators", "photographers", "videographers",
  "makeup artists", "event planners", "aso-ebi vendors", "cake bakers",
  "small chops vendors", "traditional drummers", "live bands", "bouncers",
  "ushers", "valet parking", "rental services", "lighting", "sound engineers",
  "florists", "invitation designers", "souvenirs", "cocktail service",
  "generator rental", "tents and canopies", "chairs and tables"
];

// Nigerian event types
export const nigerianEventTypes = [
  "owambe", "traditional wedding", "white wedding", "church wedding",
  "naming ceremony", "birthday party", "burial ceremony", "house warming",
  "graduation party", "engagement party", "bridal shower", "bachelor party",
  "baby shower", "anniversary celebration", "corporate event", "product launch",
  "conference", "seminar", "gala dinner", "award ceremony", "fundraiser",
  "christmas party", "new year party", "easter celebration", "eid celebration",
  "igba nkwu", "nikkai", "fatiha", "introduction ceremony"
];

// Short message handler with more cultural responses
export function handleShortMessage(message: string): string {
  if (message === 'yes' || message === 'yeah' || message === 'yep' || message === 'sure') {
    return "Ehen! Na so we like am! 💪 Wetin kind event you wan plan? Wedding, owambe, corporate gig, or birthday party?";
  } else if (message === 'no' || message === 'nope') {
    return "No wahala at all! Anytime you ready to plan your next event, Chief dey here for you. Just holla!";
  } else if (message === 'great' || message === 'good' || message === 'nice' || message === 'awesome') {
    return "E dey sweet me say you happy! 🎉 Wetin else I fit help you with for your event planning?";
  } else if (message === 'what' || message === 'how' || message === 'why') {
    return "I fit help you with plenty things o! Venue recommendations across Nigeria, vendor connections (caterers, DJs, decorators), budget planning, cultural protocols for traditional ceremonies, and more. Just tell me wetin you need!";
  } else if (message === 'hello' || message === 'hi' || message === 'hey') {
    return "How far! Chief dey here for you! 🎊 Ready to plan the next owambe wey go shock Lagos? Or maybe you wan find caterer for your daughter naming ceremony? Wetin you need?";
  } else if (message === 'thanks' || message === 'thank you' || message === 'thank') {
    return "Na you be oga! 🙏 Anytime you need help with your Nigerian event, just remember say Chief dey your side!";
  } else {
    return "Abeg share more details with me! I fit help with venue selection (Lagos, Abuja, PH, anywhere!), vendor recommendations, budget planning, traditional ceremony protocols, and plenty more. Wetin exactly you dey look for?";
  }
}

// Enhanced intent detection with Nigerian event focus
export function detectIntent(message: string): JaraBotIntent {
  const lowerMessage = message.toLowerCase();
  
  // Vendor-related intents
  if (lowerMessage.includes('vendor') || lowerMessage.includes('caterer') || lowerMessage.includes('dj') || 
      lowerMessage.includes('mc') || lowerMessage.includes('decorator') || lowerMessage.includes('photographer') ||
      lowerMessage.includes('makeup') || lowerMessage.includes('aso ebi') || lowerMessage.includes('aso-ebi')) {
    return 'vendor-search';
  } 
  // Budget-related intents
  else if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('price') ||
           lowerMessage.includes('how much') || lowerMessage.includes('naira') || lowerMessage.includes('₦') ||
           lowerMessage.includes('expensive') || lowerMessage.includes('cheap') || lowerMessage.includes('affordable')) {
    return 'budget-advice';
  } 
  // Venue-related intents
  else if (lowerMessage.includes('venue') || lowerMessage.includes('location') || lowerMessage.includes('hall') ||
           lowerMessage.includes('event center') || lowerMessage.includes('event centre') || lowerMessage.includes('place')) {
    return 'venue-selection';
  } 
  // Guest management intents
  else if (lowerMessage.includes('guest') || lowerMessage.includes('attendee') || lowerMessage.includes('rsvp') ||
           lowerMessage.includes('invitation') || lowerMessage.includes('invite')) {
    return 'guest-management';
  }
  // Traditional/cultural intents
  else if (lowerMessage.includes('tradition') || lowerMessage.includes('cultural') || lowerMessage.includes('customs') ||
           lowerMessage.includes('yoruba') || lowerMessage.includes('igbo') || lowerMessage.includes('hausa') ||
           lowerMessage.includes('owambe') || lowerMessage.includes('igba nkwu') || lowerMessage.includes('nikkai') ||
           lowerMessage.includes('fatiha')) {
    return 'cultural-advice';
  }
  // Help intents
  else if (lowerMessage.includes('help') || lowerMessage.includes('assist') || lowerMessage.includes('support')) {
    return 'general-help';
  } 
  else {
    return 'unknown';
  }
}

// Page-specific response generators
export function generateSeatingChartResponse(userMessage: string, intent: JaraBotIntent): string {
  return "Seating arrangement na serious matter for Nigerian events o! 😄 The high table for the couple and important guests, family tables separate from friends, and make sure you arrange the older folks for front. You wan make I help you plan table groupings?";
}

export function generateMarketplaceResponse(userMessage: string, intent: JaraBotIntent): string {
  return "Our vendor marketplace get over 500+ verified Nigerian vendors! From caterers wey sabi cook proper jollof to DJs wey go hold ground. Just tell me your location, budget range, and wetin you need - I go recommend the best for you! 🎯";
}

export function generateBudgetResponse(userMessage: string, intent: JaraBotIntent): string {
  return "Budget planning for Nigerian events require wisdom o! 💰 For Lagos wedding, budget from ₦3-10 million for 300+ guests. Corporate events run ₦2-15 million depending on scale. Birthday owambe? ₦500k-3 million fit work. Tell me your event type and guest count, make I break am down properly!";
}

export function generateGuestManagementResponse(userMessage: string, intent: JaraBotIntent): string {
  return "Guest management for Nigerian events require special handling! 😅 You know say people go bring extra guests, so plan for 20-30% more than your invitation list. Use color-coded invitation cards for different guest tiers, and assign family members to coordinate. How many guests you dey expect?";
}

export function generateRoadmapResponse(intent: JaraBotIntent): string {
  return "We dey build plenty exciting features for Nigerian event planners! Guest management, budget tools, and vendor integration dey active. More AI features and collaboration tools dey come soon. Wetin you wan see us add next?";
}

export function generateGeneralResponse(userMessage: string, intent: JaraBotIntent): string {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('venue') || lowerMessage.includes('location') || lowerMessage.includes('place')) {
    return "I sabi venues well well across Nigeria! 🏛️ Lagos get Landmark Centre, Eko Hotel, Harbour Point. Abuja get Transcorp Hilton, ICC. Port Harcourt get The Dome. Which city you dey plan your event, and how many guests you expect?";
  } else if (lowerMessage.includes('tradition') || lowerMessage.includes('cultural') || lowerMessage.includes('customs')) {
    return handleEventTypeQuestion(userMessage);
  } else if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('expense')) {
    return "Nigerian event budgets vary well well depending on type and scale. Standard Lagos wedding: ₦3-10 million for 300 guests. Corporate conference: ₦2-15 million. Birthday owambe: ₦500k-5 million. Tell me your event type and I go give you proper breakdown! 📊";
  } else if (lowerMessage.includes('caterer') || lowerMessage.includes('food') || lowerMessage.includes('catering')) {
    return "Food na the heartbeat of any Nigerian event! 🍲 You go need jollof rice, fried rice, pounded yam with egusi or efo, small chops, and drinks plenty. For 300 guests, budget ₦600k-2 million for catering. You wan make I recommend verified caterers for your area?";
  } else if (lowerMessage.includes('dj') || lowerMessage.includes('music') || lowerMessage.includes('entertainment')) {
    return "Entertainment make or break any owambe! 🎵 Good DJ for Lagos dey charge ₦150k-500k. Live band? ₦300k-1.5 million. MC wey sabi hold ground? ₦100k-500k. Traditional drummers? ₦50k-200k. Which city you dey plan your event?";
  } else if (lowerMessage.includes('wedding')) {
    return "Wedding planning na serious business! 👰🤵 You wan plan traditional wedding (Igba Nkwu, Nikkai, Fatiha) or white wedding? Both get different requirements. Traditional wedding need aso-ebi, bride price items, and cultural musicians. White wedding need church booking, reception venue, and all the works. Which one you wan start with?";
  } else {
    return "I be Chief, your Nigerian event planning expert! 🎉 I fit help with:\n\n• Venue recommendations across Nigeria\n• Vendor connections (caterers, DJs, decorators, photographers)\n• Budget planning and cost breakdown\n• Traditional ceremony protocols (Yoruba, Igbo, Hausa)\n• Guest management tips\n\nJust tell me wetin you wan plan and where!";
  }
}
