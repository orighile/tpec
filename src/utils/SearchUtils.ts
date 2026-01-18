import { nigerianEventVenues } from "@/components/jarabot/utils/venueData";
import { nigerianEventQA } from "@/components/jarabot/utils/culturalData";
import { vendors, categories } from "@/data/VendorData";

export type SearchResultItem = {
  id: string;
  type: "venue" | "vendor" | "blog" | "service" | "event" | "cultural";
  title: string;
  description: string;
  location?: string;
  imageUrl?: string;
  tags?: string[];
  url?: string;
};

// Convert venue data to searchable format
export const getVenueSearchResults = (query: string): SearchResultItem[] => {
  const results: SearchResultItem[] = [];
  const queryLower = query.toLowerCase();
  
  // Search through all cities
  Object.entries(nigerianEventVenues).forEach(([city, venueList]) => {
    venueList.forEach((venue, index) => {
      // Check if venue matches the query
      if (
        venue.name.toLowerCase().includes(queryLower) ||
        venue.location.toLowerCase().includes(queryLower) ||
        city.toLowerCase().includes(queryLower) ||
        venue.description.toLowerCase().includes(queryLower) ||
        venue.bestFor.some(item => item.toLowerCase().includes(queryLower)) ||
        venue.amenities.some(item => item.toLowerCase().includes(queryLower))
      ) {
        results.push({
          id: `venue-${city}-${index}`,
          type: "venue",
          title: venue.name,
          description: venue.description || `${venue.name} in ${venue.location}, perfect for ${venue.bestFor.join(", ")}`,
          location: venue.location,
          tags: [...venue.bestFor, ...venue.amenities.slice(0, 3)],
        });
      }
    });
  });
  
  return results;
};

// Convert vendor data to searchable format
export const getVendorSearchResults = (query: string): SearchResultItem[] => {
  const queryLower = query.toLowerCase();
  
  return vendors
    .filter(vendor => 
      vendor.name.toLowerCase().includes(queryLower) ||
      vendor.description.toLowerCase().includes(queryLower) ||
      vendor.category.toLowerCase().includes(queryLower) ||
      vendor.location.toLowerCase().includes(queryLower) ||
      (vendor.specialties && vendor.specialties.some(s => s.toLowerCase().includes(queryLower)))
    )
    .map(vendor => ({
      id: vendor.id,
      type: "vendor",
      title: vendor.name,
      description: vendor.description,
      location: vendor.location,
      imageUrl: vendor.imageUrl,
      tags: vendor.specialties || [vendor.category],
    }));
};

// Convert cultural data to searchable format
export const getCulturalSearchResults = (query: string): SearchResultItem[] => {
  const queryLower = query.toLowerCase();
  
  return nigerianEventQA
    .filter(qa => 
      qa.question.toLowerCase().includes(queryLower) ||
      qa.answer.toLowerCase().includes(queryLower)
    )
    .map((qa, index) => {
      // Extract keywords from the question to use as tags
      const questionWords = qa.question.toLowerCase().split(' ')
        .filter(word => word.length > 4)
        .slice(0, 3);
        
      return {
        id: `cultural-${index}`,
        type: "cultural",
        title: qa.question,
        description: qa.answer.substring(0, 150) + (qa.answer.length > 150 ? "..." : ""),
        tags: questionWords,
      };
    });
};

// Mock event data based on Nigerian context
const mockEvents = [
  {
    id: "evt-1",
    title: "Lagos Fashion Week",
    description: "The premier fashion event showcasing Nigeria's top designers and emerging talent",
    location: "Lagos",
    tags: ["fashion", "cultural", "networking", "lagos"]
  },
  {
    id: "evt-2",
    title: "Abuja Food Festival",
    description: "A celebration of Nigerian cuisine featuring top chefs and food vendors",
    location: "Abuja",
    tags: ["food", "festival", "catering", "abuja"]
  },
  {
    id: "evt-3",
    title: "Port Harcourt Cultural Festival",
    description: "Annual festival celebrating the rich cultural heritage of Rivers State",
    location: "Port Harcourt",
    tags: ["cultural", "music", "dance", "port harcourt"]
  },
  {
    id: "evt-4",
    title: "Corporate Leadership Summit",
    description: "Nigeria's biggest gathering of business leaders and entrepreneurs",
    location: "Lagos",
    tags: ["business", "corporate", "networking", "lagos"]
  },
  {
    id: "evt-5",
    title: "Lagos Wedding Expo 2024",
    description: "The ultimate wedding planning event featuring vendors, fashion shows, and workshops",
    location: "Lagos",
    tags: ["wedding", "planning", "expo", "lagos", "weddings"]
  },
  {
    id: "evt-6",
    title: "Lagos Weddings & Events Fair",
    description: "Premier wedding showcase featuring top vendors, planners, and venues in Lagos",
    location: "Lagos",
    tags: ["wedding", "weddings", "lagos", "events", "fair"]
  },
  {
    id: "evt-7",
    title: "Traditional Wedding Showcase Lagos",
    description: "Experience the beauty of Nigerian traditional wedding ceremonies with live demonstrations",
    location: "Lagos",
    tags: ["traditional", "wedding", "weddings", "lagos", "culture"]
  },
  {
    id: "evt-8",
    title: "Destination Wedding Lagos",
    description: "Planning your dream destination wedding in Lagos - venue tours and vendor meet-ups",
    location: "Lagos",
    tags: ["destination", "wedding", "weddings", "lagos", "luxury"]
  }
];

// Mock blog articles
const mockBlogs = [
  {
    id: "blog-1",
    title: "Top 10 Wedding Trends in Lagos 2024",
    description: "Discover the latest wedding trends that are taking Nigerian ceremonies to the next level",
    tags: ["wedding", "weddings", "trends", "planning", "lagos"]
  },
  {
    id: "blog-2",
    title: "Planning Your Traditional Wedding in Lagos",
    description: "A comprehensive guide to planning a traditional Nigerian wedding ceremony in Lagos",
    tags: ["traditional", "wedding", "weddings", "planning", "lagos"]
  },
  {
    id: "blog-3",
    title: "Cost-Saving Tips for Nigerian Events",
    description: "Smart ways to manage your event budget without compromising on quality",
    tags: ["budget", "planning", "tips", "events"]
  },
  {
    id: "blog-4",
    title: "Corporate Event Planning Guide",
    description: "Everything you need to know about planning successful corporate events in Nigeria",
    tags: ["corporate", "planning", "business"]
  },
  {
    id: "blog-5",
    title: "Nigerian Party Food: What to Serve",
    description: "Popular food options that will impress guests at your Nigerian party",
    tags: ["food", "catering", "party"]
  },
  {
    id: "blog-6",
    title: "Best Lagos Wedding Venues 2024",
    description: "Top-rated wedding venues in Lagos for your special day, from luxury to budget-friendly options",
    tags: ["lagos", "wedding", "weddings", "venues", "best"]
  },
  {
    id: "blog-7",
    title: "Lagos Beach Weddings: A Complete Guide",
    description: "Everything you need to know about planning a beautiful beach wedding in Lagos",
    tags: ["lagos", "beach", "wedding", "weddings", "guide"]
  }
];

// Get mock event search results
export const getEventSearchResults = (query: string): SearchResultItem[] => {
  const queryLower = query.toLowerCase();
  
  return mockEvents
    .filter(event => 
      event.title.toLowerCase().includes(queryLower) ||
      event.description.toLowerCase().includes(queryLower) ||
      event.location.toLowerCase().includes(queryLower) ||
      event.tags.some(tag => tag.toLowerCase().includes(queryLower))
    )
    .map(event => ({
      id: event.id,
      type: "event",
      title: event.title,
      description: event.description,
      location: event.location,
      tags: event.tags,
    }));
};

// Get mock blog search results
export const getBlogSearchResults = (query: string): SearchResultItem[] => {
  const queryLower = query.toLowerCase();
  
  return mockBlogs
    .filter(blog => 
      blog.title.toLowerCase().includes(queryLower) ||
      blog.description.toLowerCase().includes(queryLower) ||
      blog.tags.some(tag => tag.toLowerCase().includes(queryLower))
    )
    .map(blog => ({
      id: blog.id,
      type: "blog",
      title: blog.title,
      description: blog.description,
      tags: blog.tags,
    }));
};

// Comprehensive search across all sources
export const performSearch = (query: string): SearchResultItem[] => {
  if (!query || query.trim().length < 2) return [];
  
  const venueResults = getVenueSearchResults(query);
  const vendorResults = getVendorSearchResults(query);
  const culturalResults = getCulturalSearchResults(query);
  const eventResults = getEventSearchResults(query);
  const blogResults = getBlogSearchResults(query);
  
  // Combine and sort by relevance (here we're just concatenating, but you could implement more sophisticated ranking)
  const allResults = [
    ...venueResults,
    ...vendorResults,
    ...culturalResults,
    ...eventResults,
    ...blogResults
  ];
  
  return allResults;
};

// Helper function to get badge color based on result type
export const getTypeColor = (type: string): string => {
  switch (type) {
    case 'venue':
      return 'bg-blue-100 text-blue-800';
    case 'vendor':
      return 'bg-green-100 text-green-800';
    case 'cultural':
      return 'bg-purple-100 text-purple-800';
    case 'event':
      return 'bg-yellow-100 text-yellow-800';
    case 'blog':
      return 'bg-pink-100 text-pink-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
