
import { nigerianEventVenues } from "./venueData";
import { nigerianEventQA } from "./culturalData";

// Enhanced response generation for venue information
export function generateVenueResponse(city: string): string {
  const cityLower = city.toLowerCase();
  
  if (nigerianEventVenues[cityLower as keyof typeof nigerianEventVenues]) {
    const venues = nigerianEventVenues[cityLower as keyof typeof nigerianEventVenues];
    const venueInfo = venues[0]; // Get the first venue for an example
    
    return `For events in ${city}, I can recommend several venues like ${venues.map(v => v.name).join(", ")}. For example, ${venueInfo.name} in ${venueInfo.location} accommodates ${venueInfo.capacity} and is best for ${venueInfo.bestFor.join(", ")}. It offers amenities like ${venueInfo.amenities.slice(0, 3).join(", ")}. Would you like specific details about any of these venues or information about venues in other cities?`;
  }
  
  return `I don't have specific venue information for ${city} yet, but I can help you with venues in Lagos, Abuja, Port Harcourt, Benin City, Kano, or Enugu. Would you like information about venues in any of those cities?`;
}

// Enhanced function to handle Q&A about Nigerian events
export function handleEventTypeQuestion(userMessage: string): string {
  const lowerMsg = userMessage.toLowerCase();
  
  // Try to match the user query with our Q&A database
  for (const qa of nigerianEventQA) {
    const questionKeywords = qa.question.toLowerCase().split(" ");
    const matchCount = questionKeywords.filter(word => word.length > 4 && lowerMsg.includes(word)).length;
    
    // If we have a good match on keywords, return the answer
    if (matchCount >= 2 || lowerMsg.includes(qa.question.toLowerCase().substring(0, 15))) {
      return qa.answer;
    }
  }
  
  // If no specific match found, detect the general category
  if (lowerMsg.includes("wedding") || lowerMsg.includes("marriage")) {
    return nigerianEventQA[1].answer + "\n\nIs there something specific about Nigerian weddings you'd like to know about?";
  } else if (lowerMsg.includes("budget") || lowerMsg.includes("cost") || lowerMsg.includes("price")) {
    return nigerianEventQA[2].answer;
  } else if (lowerMsg.includes("aso ebi") || lowerMsg.includes("fabric") || lowerMsg.includes("uniform")) {
    return nigerianEventQA[3].answer;
  } else if (lowerMsg.includes("food") || lowerMsg.includes("catering") || lowerMsg.includes("menu")) {
    return nigerianEventQA[4].answer;
  } else if (lowerMsg.includes("guest") || lowerMsg.includes("invite")) {
    return nigerianEventQA[5].answer;
  } else if (lowerMsg.includes("traditional") || lowerMsg.includes("culture") || lowerMsg.includes("custom")) {
    return "Nigerian traditional ceremonies vary by ethnic group. For example, Yoruba engagements (Idana) involve prostration by the groom, letter reading, and bride price presentation. Igbo traditional marriages (Igba Nkwu) feature wine carrying ceremonies where the bride must find her groom. Hausa weddings incorporate Islamic elements with henna ceremonies and dowry presentations. Would you like specific information about a particular tradition?";
  }
  
  return "Nigerian events are rich in cultural traditions and vary significantly by tribe and region. Common events include traditional and white weddings, naming ceremonies, funerals, house warmings, and corporate gatherings. Each has unique protocols and expectations. What specific type of Nigerian event would you like to learn more about?";
}
