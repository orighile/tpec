// Global type declarations

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
    clarity?: (...args: any[]) => void;
    hotjar?: (...args: any[]) => void;
  }

  // Environment variables
  interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    readonly VITE_SITE_URL: string;
    readonly VITE_PAYSTACK_PUBLIC_KEY: string;
    readonly VITE_FLUTTERWAVE_PUBLIC_KEY: string;
    readonly VITE_GOOGLE_ANALYTICS_ID: string;
    readonly VITE_HOTJAR_ID: string;
    readonly VITE_ENABLE_ANALYTICS: string;
    readonly VITE_ENABLE_ERROR_REPORTING: string;
    readonly VITE_ENABLE_MAINTENANCE_MODE: string;
    readonly VITE_FACEBOOK_APP_ID: string;
    readonly VITE_TWITTER_API_KEY: string;
    readonly VITE_INSTAGRAM_ACCESS_TOKEN: string;
    readonly VITE_GOOGLE_MAPS_API_KEY: string;
    readonly VITE_MAPBOX_ACCESS_TOKEN: string;
    readonly VITE_CLOUDINARY_CLOUD_NAME: string;
    readonly VITE_AWS_S3_BUCKET: string;
    readonly VITE_API_TIMEOUT: string;
    readonly VITE_API_RETRY_ATTEMPTS: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};
