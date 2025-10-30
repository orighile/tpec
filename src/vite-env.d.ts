/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string

  // Payments (NGN)
  readonly VITE_PAYSTACK_PUBLIC_KEY?: string
  readonly VITE_PAYSTACK_SECRET_KEY?: string
  readonly VITE_FLUTTERWAVE_PUBLIC_KEY?: string
  readonly VITE_FLUTTERWAVE_SECRET_KEY?: string

  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
