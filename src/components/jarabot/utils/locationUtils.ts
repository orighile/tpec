
// List of Nigerian cities and locations
export const nigerianLocations = [
  'lagos', 'abuja', 'port harcourt', 'kano', 'ibadan', 'benin', 'enugu', 'calabar', 'warri',
  'kaduna', 'owerri', 'uyo', 'asaba', 'onitsha', 'abeokuta', 'ilorin', 'jos', 'maiduguri'
];

// Checks if a message contains a reference to a Nigerian location
export function isLocationMention(message: string): boolean {
  return nigerianLocations.some(location => message.includes(location));
}

// Generates a response based on location mentioned in the message
export function handleLocationMention(message: string, generateVenueResponse: (city: string) => string): string {
  if (message.includes('lagos')) {
    return generateVenueResponse('lagos');
  } else if (message.includes('abuja')) {
    return generateVenueResponse('abuja');
  } else if (message.includes('port harcourt')) {
    return generateVenueResponse('portHarcourt');
  } else if (message.includes('benin')) {
    return generateVenueResponse('benin');
  } else {
    // Extract the location from the message
    const mentionedLocation = nigerianLocations.find(location => 
      message.includes(location) && 
      !['lagos', 'abuja', 'port harcourt', 'benin'].includes(location)
    );
    
    if (mentionedLocation) {
      return `I'm currently building my knowledge about venues in ${mentionedLocation}. Would you like me to help you with venues in Lagos, Abuja, or Port Harcourt instead? These are areas I have detailed information about.`;
    } else {
      return "I can provide venue recommendations for several Nigerian cities including Lagos, Abuja, Port Harcourt, and Benin City. Which city are you interested in hosting your event?";
    }
  }
}
