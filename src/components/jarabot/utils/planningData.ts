
// Event Budget Guidelines
export const eventBudgetGuidelines = {
  wedding: {
    basic: {
      totalRange: "₦1,500,000 - ₦3,000,000",
      breakdown: {
        venue: "25-30%",
        catering: "30-35%",
        attire: "10-15%",
        decor: "10%",
        photography: "5-8%",
        entertainment: "5%",
        miscellaneous: "5-7%"
      },
      guestCount: "100-150",
      notes: "Focuses on essential elements with modest venue and catering options."
    },
    standard: {
      totalRange: "₦3,000,000 - ₦7,000,000",
      breakdown: {
        venue: "25-30%",
        catering: "25-30%",
        attire: "10-15%",
        decor: "10-15%",
        photography: "8-10%",
        entertainment: "8-10%",
        miscellaneous: "5-7%"
      },
      guestCount: "150-300",
      notes: "Comfortable arrangements with quality service and moderate luxury elements."
    },
    luxury: {
      totalRange: "₦7,000,000 - ₦20,000,000+",
      breakdown: {
        venue: "20-30%",
        catering: "20-25%",
        attire: "10-15%",
        decor: "15-20%",
        photography: "8-10%",
        entertainment: "10-15%",
        miscellaneous: "10-15%"
      },
      guestCount: "300-500+",
      notes: "Premium venues, designer attire, elaborate decor, celebrity entertainers, and high-end production."
    }
  },
  corporate: {
    conference: {
      totalRange: "₦2,000,000 - ₦15,000,000+",
      breakdown: {
        venue: "30-40%",
        catering: "20-25%",
        equipment: "10-15%",
        speakers: "10-20%",
        materials: "5-10%",
        staffing: "5-10%",
        miscellaneous: "5%"
      },
      guestCount: "100-500",
      notes: "Varies widely based on prestige of speakers, venue quality, and technical requirements."
    },
    productLaunch: {
      totalRange: "₦3,000,000 - ₦10,000,000+",
      breakdown: {
        venue: "20-25%",
        production: "25-30%",
        catering: "15-20%",
        marketing: "15-20%",
        "celebrity appearances": "0-20%",
        miscellaneous: "5-10%"
      },
      guestCount: "100-300",
      notes: "Emphasis on production quality, media presence, and brand experience."
    }
  }
};

// Typical Nigerian Event Schedule Templates
export const eventScheduleTemplates = {
  traditionalWedding: [
    {time: "10:00 - 11:00", activity: "Arrival of guests and families"},
    {time: "11:00 - 11:30", activity: "Entry procession of groom's family"},
    {time: "11:30 - 12:00", activity: "Traditional introduction of families"},
    {time: "12:00 - 12:30", activity: "Bride price negotiation/presentation"},
    {time: "12:30 - 13:00", activity: "Cultural rituals (varies by tribe)"},
    {time: "13:00 - 13:30", activity: "Bride's entrance"},
    {time: "13:30 - 14:30", activity: "Main ceremony (specific tribal customs)"},
    {time: "14:30 - 15:30", activity: "Lunch/feast begins"},
    {time: "15:30 - 18:00", activity: "Celebration, dancing, and entertainment"}
  ],
  whiteWedding: [
    {time: "10:00 - 11:30", activity: "Church/religious ceremony"},
    {time: "11:30 - 12:30", activity: "Photo session"},
    {time: "12:30 - 13:30", activity: "Guests arrive at reception"},
    {time: "13:30 - 14:00", activity: "Couple's grand entrance"},
    {time: "14:00 - 14:30", activity: "Opening prayers, welcome address"},
    {time: "14:30 - 15:30", activity: "Lunch service begins"},
    {time: "15:30 - 16:00", activity: "Toasts and speeches"},
    {time: "16:00 - 16:30", activity: "Cake cutting, couple's first dance"},
    {time: "16:30 - 20:00", activity: "General celebration, dancing, money spraying"}
  ],
  corporateConference: [
    {time: "08:30 - 09:00", activity: "Registration and networking breakfast"},
    {time: "09:00 - 09:30", activity: "Welcome address and opening remarks"},
    {time: "09:30 - 10:30", activity: "Keynote presentation"},
    {time: "10:30 - 11:00", activity: "Tea/coffee break"},
    {time: "11:00 - 12:30", activity: "Panel discussion/breakout sessions"},
    {time: "12:30 - 13:30", activity: "Lunch and networking"},
    {time: "13:30 - 15:00", activity: "Presentations/workshops"},
    {time: "15:00 - 15:30", activity: "Afternoon break"},
    {time: "15:30 - 16:30", activity: "Final session/closing remarks"},
    {time: "16:30 - 18:00", activity: "Cocktail reception (optional)"}
  ]
};
