

# Fix: Define CORS Headers in delete-account Edge Function

## Problem
`supabase/functions/delete-account/index.ts` line 1 imports `corsHeaders` from `@supabase/supabase-js/cors` — this bare specifier doesn't resolve in the Deno edge runtime, causing a deploy failure.

## Fix
Replace line 1 with a manually defined `corsHeaders` constant:

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

Remove the `import { corsHeaders } from '@supabase/supabase-js/cors';` line. No other changes needed.

## File Changed
- `supabase/functions/delete-account/index.ts` — line 1 only

