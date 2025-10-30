const CACHE_KEY = 'planner_images_cache';
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

interface CachedImage {
  url: string;
  timestamp: number;
  source: string;
}

interface ImageCache {
  [plannerName: string]: CachedImage;
}

// Extract clean domain from URL
export const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
};

// Get cached image for a planner
export const getCachedImage = (plannerName: string): string | null => {
  try {
    const cacheStr = localStorage.getItem(CACHE_KEY);
    if (!cacheStr) return null;

    const cache: ImageCache = JSON.parse(cacheStr);
    const cached = cache[plannerName];

    if (!cached) return null;

    // Check if cache is expired
    const now = Date.now();
    if (now - cached.timestamp > CACHE_TTL) {
      return null;
    }

    return cached.url;
  } catch (error) {
    console.error('Error reading image cache:', error);
    return null;
  }
};

// Set cached image for a planner
export const setCachedImage = (plannerName: string, imageUrl: string, source: string = 'api'): void => {
  try {
    const cacheStr = localStorage.getItem(CACHE_KEY);
    const cache: ImageCache = cacheStr ? JSON.parse(cacheStr) : {};

    cache[plannerName] = {
      url: imageUrl,
      timestamp: Date.now(),
      source,
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Error setting image cache:', error);
  }
};

// Fetch image from Jsonlink.io API
const fetchFromJsonlink = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://jsonlink.io/api/extract?url=${encodeURIComponent(url)}`,
      { signal: AbortSignal.timeout(5000) }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.images?.[0] || data.og?.image || data.twitter?.image || null;
  } catch (error) {
    console.warn('Jsonlink fetch failed:', error);
    return null;
  }
};

// Fetch image from Microlink.io API
const fetchFromMicrolink = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(url)}`,
      { signal: AbortSignal.timeout(5000) }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.data?.logo?.url || data.data?.image?.url || null;
  } catch (error) {
    console.warn('Microlink fetch failed:', error);
    return null;
  }
};

// Handle Instagram URLs specially - try multiple approaches
const handleInstagramUrl = async (url: string): Promise<string | null> => {
  // Instagram requires authentication, so we'll skip it for now
  // In the future, we could use Instagram's official API or a proxy service
  return null;
};

// Handle Facebook URLs
const handleFacebookUrl = async (url: string): Promise<string | null> => {
  // Facebook also requires authentication for most profile data
  return null;
};

// Main function to fetch planner image
export const fetchPlannerImage = async (website?: string): Promise<string | null> => {
  if (!website) return null;

  try {
    const cleanUrl = website.startsWith('http') ? website : `https://${website}`;
    
    // Skip Instagram and Facebook URLs - they require authentication
    if (cleanUrl.includes('instagram.com')) {
      return await handleInstagramUrl(cleanUrl);
    }
    
    if (cleanUrl.includes('facebook.com')) {
      return await handleFacebookUrl(cleanUrl);
    }

    // Try Jsonlink first
    let imageUrl = await fetchFromJsonlink(cleanUrl);
    if (imageUrl) return imageUrl;

    // Fallback to Microlink
    imageUrl = await fetchFromMicrolink(cleanUrl);
    if (imageUrl) return imageUrl;

    return null;
  } catch (error) {
    console.error('Error fetching planner image:', error);
    return null;
  }
};
