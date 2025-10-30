export interface NigerianService {
  category: string;
  name: string;
  description: string;
  specialties: string[];
  established: number | null;
  instagram: string | null;
  instagramUrl: string | null;
  location: string;
  website: string | null;
}

export const nigerianServices: NigerianService[] = [
  // EVENT PLANNERS
  {
    category: "event-planning",
    name: "Zapphaire Event",
    description: "Most sought-after celebrity wedding and planning company known for detail and quality service.",
    specialties: ["Wedding", "Special Events", "Corporate Events"],
    established: 2003,
    instagram: "@zapphaire_events",
    instagramUrl: "https://www.instagram.com/zapphaire_events/",
    location: "Lagos",
    website: null
  },
  {
    category: "event-planning",
    name: "Eventful",
    description: "Major force in the event industry, leader since 2002 specializing in event management for corporate and individual clients.",
    specialties: ["Corporate Events", "Wedding", "Event Management"],
    established: 2002,
    instagram: "@eventfulnigeria",
    instagramUrl: "https://www.instagram.com/eventfulnigeria/",
    location: "Lagos",
    website: "https://www.eventfulnigeria.com/"
  },
  {
    category: "event-planning",
    name: "Elizabeth R Event",
    description: "Veteran event company with 15+ years of experience in exceptional events with state-of-the-art effects.",
    specialties: ["Wedding", "Corporate Events", "Special Effects"],
    established: 2003,
    instagram: "@elizabeth_r_events",
    instagramUrl: "https://www.instagram.com/elizabeth_r_events/",
    location: "Lagos",
    website: "https://elizabethrevents.com.ng/"
  },
  {
    category: "event-planning",
    name: "No Surprises Event",
    description: "Respected event design production and management with mastery of discretion and lavish event creation.",
    specialties: ["Corporate Events", "High-end Events", "Event Design"],
    established: null,
    instagram: "@nosurprisesevents",
    instagramUrl: "https://www.instagram.com/nosurprisesevents/",
    location: "Lagos",
    website: null
  },
  {
    category: "event-planning",
    name: "Gadiel Event Planners",
    description: "Premium event planners in Lekki specializing in corporate events, weddings, seminars, and team bonding.",
    specialties: ["Wedding", "Corporate Events", "Seminars"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos (Lekki)",
    website: "https://gadieleventplanners.com.ng/"
  },
  {
    category: "event-planning",
    name: "Ball Events",
    description: "Leader for 10+ years in luxury wedding and corporate event planning with full-service design.",
    specialties: ["Wedding", "Corporate Events", "Venue Design"],
    established: 2014,
    instagram: "@balleventsconcepts",
    instagramUrl: "https://www.instagram.com/balleventsconcepts",
    location: "Lagos",
    website: null
  },
  
  // CATERING SERVICES
  {
    category: "catering",
    name: "Eliezer Group",
    description: "One of the best catering businesses offering general, onshore and offshore catering with executive dining solutions.",
    specialties: ["General Catering", "Executive Dining", "Corporate Events"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: "https://eliezergroup.com/"
  },
  {
    category: "catering",
    name: "Divine Caterers",
    description: "Passion-driven catering service striving to play a special part in event success with timely delivery.",
    specialties: ["Wedding Catering", "Corporate Catering", "Event Food"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: "https://www.divinecatererng.com/"
  },
  {
    category: "catering",
    name: "Seyikeyz Catering",
    description: "Specializes in Nigerian and continental cuisine with buffet-style service and private chef options.",
    specialties: ["Nigerian Cuisine", "Continental Food", "Private Chef"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  {
    category: "catering",
    name: "Bethel Catering Services",
    description: "Indoor and outdoor catering with Chinese foods, small chops, BBQ, grilled fish, and continental dishes.",
    specialties: ["BBQ & Grilling", "Small Chops", "Chinese Food"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: "https://bethelcatering.sitesng.com/"
  },
  {
    category: "catering",
    name: "Nono's Catering",
    description: "Professional catering service in Lagos with diverse menu options and professional service delivery.",
    specialties: ["Event Catering", "Food Delivery", "Party Catering"],
    established: null,
    instagram: "@nonoscatering",
    instagramUrl: "https://www.instagram.com/nonoscatering/",
    location: "Lagos",
    website: null
  },
  {
    category: "catering",
    name: "Hamptons Catering",
    description: "Lagos-based caterer and home delivery service specializing in event catering and bulk food delivery.",
    specialties: ["Event Catering", "Home Delivery", "Bulk Orders"],
    established: null,
    instagram: "@hamptonscatering",
    instagramUrl: "https://www.instagram.com/hamptonscatering/",
    location: "Lagos",
    website: null
  },
  {
    category: "catering",
    name: "Lagos Cafe",
    description: "Exceptional catering for weddings, birthdays, anniversaries with authentic Nigerian and international menus.",
    specialties: ["Wedding Catering", "Nigerian Cuisine", "Party Catering"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: "https://www.lagoscafe.com/catering"
  },
  
  // VENUES
  {
    category: "venue",
    name: "BMO Event Arena",
    description: "Tailored event venue perfect for weddings, conferences, banquets, meetings, exhibitions, and pageants.",
    specialties: ["Wedding Venue", "Conference Hall", "Banquet Hall"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Abuja (Wuse Zone 4)",
    website: null
  },
  {
    category: "venue",
    name: "Lekki Centre Luxury Halls",
    description: "Luxury event hall on Admiralty Road ideal for birthdays, weddings, masterclasses, movie auditions, and corporate events.",
    specialties: ["Luxury Hall", "Wedding Venue", "Corporate Events"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos (Lekki)",
    website: null
  },
  {
    category: "venue",
    name: "Eventmata Halls And Garden",
    description: "200-capacity furnished hall with excellent lighting, AC, stage, and kitchen facilities.",
    specialties: ["Event Hall", "Garden Venue", "Equipped Hall"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos (Ikeja)",
    website: null
  },
  {
    category: "venue",
    name: "Opebi Estate Event Hall",
    description: "Well-located 200-capacity event hall on tarred road with spacious compound, water, and electricity supply.",
    specialties: ["Event Hall", "200 Capacity", "Well Facilitated"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos (Ikeja)",
    website: null
  },
  {
    category: "venue",
    name: "Jiji Event Centres",
    description: "Multiple event venues across Lagos offering various capacities and facilities for all event types.",
    specialties: ["Multiple Venues", "Various Capacities", "Flexible Booking"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: "https://jiji.ng/lagos/event-centers-and-venues"
  },
  {
    category: "venue",
    name: "Nigeria Property Centre Venues",
    description: "Largest venue rental platform with 50+ event centers across Nigeria with competitive pricing.",
    specialties: ["Venue Marketplace", "Multiple Options", "Best Prices"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Multiple Cities",
    website: "https://nigeriapropertycentre.com/"
  },
  
  // MUSIC & DJ
  {
    category: "music-dj",
    name: "Premium Event DJs",
    description: "Professional DJ services for weddings, corporate events, and celebrations with state-of-the-art equipment.",
    specialties: ["Wedding DJ", "Corporate DJ", "Event Entertainment"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  {
    category: "music-dj",
    name: "Live Band Entertainment",
    description: "Live music and band performance for high-end events, weddings, and corporate functions.",
    specialties: ["Live Band", "Musical Entertainment", "Premium Events"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  {
    category: "music-dj",
    name: "Naija Musicians Network",
    description: "Network of professional musicians and artists available for event performances and entertainment.",
    specialties: ["Musicians", "Artists", "Event Entertainment"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Nigeria",
    website: null
  },
  {
    category: "music-dj",
    name: "High Energy Event DJs",
    description: "Experienced DJs specializing in creating the perfect atmosphere for every type of celebration.",
    specialties: ["Event DJ", "Party Entertainment", "Audio Systems"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  
  // VIDEO & PHOTOGRAPHY
  {
    category: "video-photo",
    name: "DN Works Cinematography",
    description: "Professional wedding cinematographer and videographer capturing moments with artistic cinematography.",
    specialties: ["Wedding Videos", "Cinematography", "Event Recording"],
    established: null,
    instagram: "@dn_works",
    instagramUrl: "https://www.instagram.com/dn_works/",
    location: "Lagos",
    website: null
  },
  {
    category: "video-photo",
    name: "Elite Studio Nigeria",
    description: "Creative experts capturing weddings, events, corporate shoots and portraits in unique timeless manner.",
    specialties: ["Wedding Photography", "Event Photography", "Portrait"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: "https://www.elitestudio.ng/"
  },
  {
    category: "video-photo",
    name: "Bedge Pictures",
    description: "Top wedding photographer featured in insider and brides magazine, proudly Nigerian professional.",
    specialties: ["Wedding Photography", "Professional Photography", "Event Coverage"],
    established: null,
    instagram: "@bedgepictures",
    instagramUrl: "https://www.instagram.com/bedgepictures/",
    location: "Lagos",
    website: null
  },
  {
    category: "video-photo",
    name: "Tonydoo Visuals",
    description: "Creative and professional wedding photographers and videographers with impeccable portfolios.",
    specialties: ["Wedding Photography", "Wedding Videography", "Event Documentation"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: "https://tonydoovisuals.com/"
  },
  {
    category: "video-photo",
    name: "Mobman Studios",
    description: "Passionate event cinematographers documenting beautiful stories with professional quality videos.",
    specialties: ["Wedding Cinematography", "Event Videography", "Professional Recording"],
    established: null,
    instagram: "@mobmanstudios",
    instagramUrl: "https://www.instagram.com/mobmanstudios/",
    location: "Lagos",
    website: null
  },
  {
    category: "video-photo",
    name: "Arshavin John Photography",
    description: "Decade of expertise in wedding and portrait photography with unique creative vision.",
    specialties: ["Wedding Photography", "Portrait Photography", "Event Shoots"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Abuja",
    website: null
  },
  {
    category: "video-photo",
    name: "Drone Photography & Videography",
    description: "Aerial drone photography and videography for stunning overhead event coverage.",
    specialties: ["Aerial Footage", "Drone Videography", "Premium Coverage"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  {
    category: "video-photo",
    name: "Studio Photo & Video Edit",
    description: "Post-production editing, photo enhancement, and video editing for professional event coverage.",
    specialties: ["Video Editing", "Photo Editing", "Production"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  
  // DECORATION
  {
    category: "decoration",
    name: "Alveena Events",
    description: "Unique decor with creative innovation through layering of colours and beautiful floral displays.",
    specialties: ["Floral Design", "Custom Decor", "Event Styling"],
    established: null,
    instagram: "@alveenaevents",
    instagramUrl: "https://www.instagram.com/alveenaevents",
    location: "Lagos",
    website: null
  },
  {
    category: "decoration",
    name: "The Wedding Guru",
    description: "Creative design for corporate and wedding events with floral artistry and gorgeous styling.",
    specialties: ["Wedding Decor", "Floral Artistry", "Event Styling"],
    established: null,
    instagram: "@theweddingguruu",
    instagramUrl: "https://www.instagram.com/theweddingguruu/",
    location: "Lagos",
    website: null
  },
  {
    category: "decoration",
    name: "2706 Events",
    description: "Exceptional decor planning with architectural design and amazing themes for all event types.",
    specialties: ["Event Decor", "Architectural Design", "Theme Planning"],
    established: null,
    instagram: "@2706events",
    instagramUrl: "https://www.instagram.com/2706events/",
    location: "Lagos",
    website: null
  },
  {
    category: "decoration",
    name: "IPC Events",
    description: "Mind-blowing event experiences with well thought-through design reflecting client vision.",
    specialties: ["Custom Design", "Event Styling", "Creative Themes"],
    established: null,
    instagram: "@ipcevents",
    instagramUrl: "https://www.instagram.com/ipcevents",
    location: "Lagos",
    website: null
  },
  {
    category: "decoration",
    name: "Trendy Beevents",
    description: "Showcases creativity through unique themes and layouts with inspiring innovative designs.",
    specialties: ["Creative Themes", "Event Design", "Styling"],
    established: null,
    instagram: "@bisolatrendybee",
    instagramUrl: "https://www.instagram.com/bisolatrendybee/",
    location: "Lagos",
    website: null
  },
  {
    category: "decoration",
    name: "Eloquent Displays and Deco",
    description: "Event decorator for stylish, classic and themed event decoration according to client needs.",
    specialties: ["Themed Decor", "Classic Design", "Event Styling"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: "https://eloquentdisplays.com/"
  },
  {
    category: "decoration",
    name: "Ribbons n Vows Events",
    description: "Exquisite, simple and classic decor with attention to details bringing imagination to life.",
    specialties: ["Classic Decor", "Event Styling", "Detail Work"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  {
    category: "decoration",
    name: "Sanchifloral Decorators",
    description: "Event decorator creating innovative ideas in event decorations and floristry with international standards.",
    specialties: ["Floral Decoration", "Event Design", "Premium Decor"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  {
    category: "decoration",
    name: "Indigocrystal Concept",
    description: "Full event management with decor, styling and event design consultancy services.",
    specialties: ["Event Design", "Decor Styling", "Consultancy"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: "https://indigocrystal.com.ng/"
  },
  
  // ASO EBI
  {
    category: "aso-ebi",
    name: "Premium Aso Ebi Collections",
    description: "High-quality traditional Nigerian fabric and clothing with custom designs for events.",
    specialties: ["Aso Ebi Fabric", "Custom Designs", "Traditional Wear"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  {
    category: "aso-ebi",
    name: "Aso Ebi Fashion House",
    description: "Exclusive designer Aso Ebi collections with premium fabrics and bespoke tailoring services.",
    specialties: ["Designer Aso Ebi", "Custom Tailoring", "Premium Fabrics"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos (Lekki)",
    website: null
  },
  {
    category: "aso-ebi",
    name: "Luxury Fabric Studios",
    description: "Luxury traditional and contemporary fabrics perfect for Aso Ebi with professional styling advice.",
    specialties: ["Luxury Fabrics", "Styling", "Bulk Orders"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  {
    category: "aso-ebi",
    name: "Ankara & Adire Boutique",
    description: "Wide collection of Ankara and Adire fabrics with custom designs and group packages.",
    specialties: ["Ankara Fabrics", "Adire Collections", "Group Packages"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  {
    category: "aso-ebi",
    name: "Event Fabric Coordinator",
    description: "Professional Aso Ebi coordination service handling fabric selection, ordering, and distribution.",
    specialties: ["Fabric Coordination", "Bulk Distribution", "Event Planning"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  
  // MAKEUP & BEAUTY
  {
    category: "makeup-beauty",
    name: "Layefa Beauty",
    description: "Top makeup artist in Lagos specializing in bridal and event makeup with exceptional artistry.",
    specialties: ["Bridal Makeup", "Event Makeup", "Professional Artistry"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  {
    category: "makeup-beauty",
    name: "Kendra's Touch",
    description: "Professional makeovers for any occasion with makeup artist training services.",
    specialties: ["Professional Makeup", "Bridal Makeup", "Makeup Training"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  {
    category: "makeup-beauty",
    name: "Semdots Artistry",
    description: "Focused on redefining beauty with art through makeup and nail care services using quality products.",
    specialties: ["Makeup Artistry", "Nail Care", "Beauty Services"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  {
    category: "makeup-beauty",
    name: "Rain Ushering Agency",
    description: "Event agency offering exquisite services including makeup, hair styling, and ushering.",
    specialties: ["Makeup Services", "Hair Styling", "Event Staffing"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  
  // STAFFING & USHERING
  {
    category: "staffing",
    name: "Rain Ushering Agency",
    description: "Full event staffing with educated hostesses, servers, and professional coordinators.",
    specialties: ["Event Ushers", "Servers", "Professional Staffing"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  {
    category: "staffing",
    name: "Professional Event Staff",
    description: "Trained and professional event staff including coordinators, ushers, and waiters.",
    specialties: ["Event Coordination", "Professional Staff", "Event Support"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  {
    category: "staffing",
    name: "Event Logistics & Coordination",
    description: "Professional event coordination team handling logistics, setup, and event management.",
    specialties: ["Event Logistics", "Setup & Teardown", "Coordination"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  
  // ENTERTAINMENT & HOSTING
  {
    category: "entertainment",
    name: "Professional MC & Hosting",
    description: "Professional master of ceremonies for weddings, corporate events, and celebrations.",
    specialties: ["MC Services", "Event Hosting", "Professional Speaking"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  {
    category: "entertainment",
    name: "Comedy & Entertainment Acts",
    description: "Professional comedians, performers, and entertainment acts for event entertainment.",
    specialties: ["Comedy", "Performance", "Entertainment"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  {
    category: "entertainment",
    name: "Live Band Entertainment",
    description: "Live music and band performance for high-end events, weddings, and corporate functions.",
    specialties: ["Live Band", "Musical Entertainment", "Premium Events"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  
  // RENTAL SERVICES
  {
    category: "rental",
    name: "Event Equipment Rental",
    description: "Tables, chairs, tents, and event equipment rental for all event types.",
    specialties: ["Furniture Rental", "Tent Rental", "Event Equipment"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  {
    category: "rental",
    name: "Sound & Audio Equipment",
    description: "Professional sound systems, microphones, and audio equipment rental for events.",
    specialties: ["Sound Systems", "Audio Equipment", "PA System"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  {
    category: "rental",
    name: "Lighting & Projection Rental",
    description: "Professional lighting, projectors, and stage lighting for event ambiance.",
    specialties: ["Stage Lighting", "Projectors", "Ambiance Lighting"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  {
    category: "rental",
    name: "Party Supplies & Decor Rental",
    description: "Party supplies, balloons, backdrops, and decorative items rental service.",
    specialties: ["Balloons", "Backdrops", "Party Supplies"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  
  // TAILORING & FASHION
  {
    category: "tailoring",
    name: "Event Wear Tailoring",
    description: "Professional tailoring for traditional wear, custom designs, and event clothing.",
    specialties: ["Custom Tailoring", "Traditional Wear", "Event Fashion"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  {
    category: "tailoring",
    name: "Bridal Wear Boutique",
    description: "Wedding dresses, bridal wear, and special occasion outfits with custom tailoring.",
    specialties: ["Bridal Wear", "Wedding Dresses", "Custom Design"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  {
    category: "tailoring",
    name: "Groomsmen & Formal Wear",
    description: "Professional groomsmen suits, formal wear, and custom dress for grooms and wedding party.",
    specialties: ["Formal Wear", "Groomsmen Suits", "Custom Tailoring"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  
  // TRANSPORTATION
  {
    category: "transportation",
    name: "Event Transportation Services",
    description: "Professional car rental and chauffeur services for groom, bride, and VIP guests.",
    specialties: ["Car Rental", "Chauffeur Service", "VIP Transport"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  {
    category: "transportation",
    name: "Luxury Wedding Cars",
    description: "Luxury vehicle hire for weddings including limousines and premium cars.",
    specialties: ["Limousine Hire", "Luxury Cars", "Wedding Transport"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  {
    category: "transportation",
    name: "Guest Transportation",
    description: "Coach hire and shuttle services for event guest transportation.",
    specialties: ["Coach Hire", "Shuttle Service", "Guest Transport"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  
  // INVITATION & PRINTING
  {
    category: "printing",
    name: "Professional Invitation Design",
    description: "Custom invitation design and printing for weddings, corporate events, and celebrations.",
    specialties: ["Invitation Design", "Custom Printing", "Event Stationery"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  {
    category: "printing",
    name: "Event Printing Services",
    description: "Brochures, flyers, banners, and event marketing materials printing.",
    specialties: ["Event Printing", "Banner Design", "Marketing Materials"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  },
  {
    category: "printing",
    name: "Souvenirs & Customization",
    description: "Custom souvenirs, gifts, and branded items for event giveaways.",
    specialties: ["Custom Souvenirs", "Branded Items", "Gift Printing"],
    established: null,
    instagram: null,
    instagramUrl: null,
    location: "Lagos",
    website: null
  }
];

export const categoryLabels: Record<string, string> = {
  'event-planning': '🎯 Event Planning',
  'catering': '🍽️ Catering',
  'venue': '🏢 Venue',
  'music-dj': '🎵 Music & DJ',
  'video-photo': '📸 Video & Photo',
  'decoration': '🎨 Decoration',
  'aso-ebi': '👗 Aso Ebi',
  'makeup-beauty': '💄 Makeup & Beauty',
  'staffing': '👥 Staffing',
  'entertainment': '🎭 Entertainment',
  'rental': '📦 Rentals',
  'tailoring': '✂️ Tailoring',
  'transportation': '🚗 Transportation',
  'printing': '🖨️ Printing'
};
