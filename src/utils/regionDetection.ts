// Region detection utility for payment processor selection
export interface UserLocation {
  country: string;
  countryCode: string;
  continent: string;
}

export type PaymentProvider = 'stripe' | 'paystack' | 'flutterwave';

// Nigerian country codes and common African countries for Paystack
const PAYSTACK_COUNTRIES = ['NG', 'GH', 'ZA', 'KE'];

// European and other Stripe-supported countries
const STRIPE_COUNTRIES = ['US', 'GB', 'CA', 'AU', 'FR', 'DE', 'ES', 'IT', 'NL', 'SE', 'NO', 'DK', 'FI'];

export async function detectUserLocation(): Promise<UserLocation | null> {
  try {
    // Using ipapi.co for geolocation (free tier)
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) throw new Error('Failed to fetch location');
    
    const data = await response.json();
    return {
      country: data.country_name || 'Unknown',
      countryCode: data.country_code || 'US',
      continent: data.continent_code || 'NA'
    };
  } catch (error) {
    console.warn('Failed to detect user location:', error);
    return null;
  }
}

export function getRecommendedPaymentProvider(countryCode?: string): PaymentProvider {
  if (!countryCode) return 'stripe'; // Default fallback
  
  const code = countryCode.toUpperCase();
  
  // Paystack for Nigeria, Ghana, South Africa, Kenya
  if (PAYSTACK_COUNTRIES.includes(code)) {
    return 'paystack';
  }
  
  // Stripe for US, Europe, and other major markets
  if (STRIPE_COUNTRIES.includes(code)) {
    return 'stripe';
  }
  
  // Flutterwave for other African countries
  if (code.match(/^(BF|BJ|CI|CM|SN|TG|ML|NE|BW|MW|UG|TZ|RW|ET|GM|GN|LR|SL|MG|MZ|ZW|ZM|CD|CF|CG|GA|TD|DJ|ER|SO|SS|SD)$/)) {
    return 'flutterwave';
  }
  
  // Default to Stripe for unknown regions
  return 'stripe';
}

export const PAYMENT_PROVIDER_CONFIG = {
  stripe: {
    name: 'Stripe',
    description: 'Secure payments worldwide',
    logo: '💳',
    supportedRegions: ['US', 'Europe', 'Australia', 'Canada']
  },
  paystack: {
    name: 'Paystack',
    description: 'Leading payments in Africa',
    logo: '🏦',
    supportedRegions: ['Nigeria', 'Ghana', 'South Africa', 'Kenya']
  },
  flutterwave: {
    name: 'Flutterwave',
    description: 'Pan-African payment solution',
    logo: '🌍',
    supportedRegions: ['Africa', 'Global']
  }
} as const;