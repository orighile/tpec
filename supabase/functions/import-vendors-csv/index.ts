import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VendorCSVRow {
  Name?: string;
  name?: string;
  categories?: string;
  category?: string;
  Location?: string;
  state?: string;
  city?: string;
  contact?: string;
  Email?: string;
  email?: string;
  price_min?: string;
  price_max?: string;
  short_description?: string;
  profile_url?: string;
  contact_info?: string;
  images?: string;
}

interface ImportStats {
  processed: number;
  inserted: number;
  updated: number;
  skipped: number;
  errors: string[];
}

function createSlug(name: string, city: string): string {
  const combined = `${name} ${city}`.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-|-$/g, '');
  return combined || 'vendor';
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

async function fetchCSVContent(csvContent?: string): Promise<string> {
  // If CSV content is provided in request, use it
  if (csvContent) {
    return csvContent;
  }

  // Try Supabase storage
  const storageUrl = 'https://lppgtqtqockemugndxio.supabase.co/storage/v1/object/public/vendor-data/vendors_from_excel.csv';
  const response = await fetch(storageUrl);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch CSV from storage: ${response.status} ${response.statusText}`);
  }
  
  return await response.text();
}

async function importVendorsFromCSV(csvContent?: string): Promise<ImportStats> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const stats: ImportStats = {
    processed: 0,
    inserted: 0,
    updated: 0,
    skipped: 0,
    errors: []
  };

  try {
    const content = await fetchCSVContent(csvContent);
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      throw new Error('CSV file is empty');
    }

    // Skip header row
    const dataLines = lines.slice(1);
    
    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i].trim();
      if (!line) continue;

      try {
        stats.processed++;
        const columns = parseCSVLine(line);
        
        // Detect CSV format: new format has 5 columns (Name, categories, Location, contact, Email)
        const isNewFormat = columns.length === 5;
        
        let row: VendorCSVRow;
        
        if (isNewFormat) {
          // New CSV format
          row = {
            Name: columns[0] || '',
            categories: columns[1] || '',
            Location: columns[2] || '',
            contact: columns[3] || '',
            Email: columns[4] || ''
          };
        } else {
          // Old CSV format
          if (columns.length < 11) {
            stats.errors.push(`Row ${i + 2}: Insufficient columns (${columns.length})`);
            stats.skipped++;
            continue;
          }
          row = {
            name: columns[0] || '',
            category: columns[1] || 'General',
            state: columns[2] || '',
            city: columns[3] || '',
            price_min: columns[4] || '',
            price_max: columns[5] || '',
            short_description: columns[6] || '',
            profile_url: columns[7] || '',
            contact_info: columns[8] || '',
            email: columns[9] || '',
            images: columns[10] || ''
          };
        }

        // Extract values based on format
        const name = row.Name || row.name || '';
        const category = row.categories || row.category || 'General';
        const location = row.Location;
        const contact = row.contact || row.contact_info;
        const email = row.Email || row.email;

        // Skip rows with empty names
        if (!name || name.trim() === '') {
          stats.skipped++;
          continue;
        }

        // Parse location for new format
        let city = row.city;
        let state = row.state;
        
        if (location && !city) {
          // Extract city from Location field
          city = location.trim();
          state = 'Lagos'; // Default state
        }

        const slug = createSlug(name, city || state || 'nigeria');
        
        // Parse numeric values
        const priceMin = row.price_min ? parseFloat(row.price_min) : null;
        const priceMax = row.price_max ? parseFloat(row.price_max) : null;
        
        // Parse images array
        const images = row.images ? row.images.split('|').map(img => img.trim()).filter(Boolean) : [];

        const vendorData = {
          name: name.trim(),
          category: category.trim(),
          state: state || null,
          city: city || null,
          price_min: priceMin,
          price_max: priceMax,
          short_description: row.short_description || null,
          profile_url: row.profile_url || null,
          contact_email: email || null,
          contact_phone: contact || null,
          images: images,
          slug: slug,
          verified: true,
          owner_user_id: '00000000-0000-0000-0000-000000000000',
          description: row.short_description || null,
          location: city || state || location || 'Nigeria'
        };

        // Check if vendor exists by slug
        const { data: existing } = await supabase
          .from('vendors')
          .select('id')
          .eq('slug', slug)
          .maybeSingle();

        if (existing) {
          // Update existing vendor
          const { error: updateError } = await supabase
            .from('vendors')
            .update({
              ...vendorData,
              updated_at: new Date().toISOString()
            })
            .eq('slug', slug);

          if (updateError) {
            stats.errors.push(`Row ${i + 2}: Update failed - ${updateError.message}`);
            stats.skipped++;
          } else {
            stats.updated++;
          }
        } else {
          // Insert new vendor
          const { error: insertError } = await supabase
            .from('vendors')
            .insert(vendorData);

          if (insertError) {
            stats.errors.push(`Row ${i + 2}: Insert failed - ${insertError.message}`);
            stats.skipped++;
          } else {
            stats.inserted++;
          }
        }
      } catch (rowError) {
        stats.errors.push(`Row ${i + 2}: ${rowError instanceof Error ? rowError.message : 'Unknown error'}`);
        stats.skipped++;
      }
    }
  } catch (error) {
    stats.errors.push(`CSV processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return stats;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate caller and verify admin role
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await authClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const userId = claimsData.claims.sub;

    // Check admin role using service client
    const serviceClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: roleData } = await serviceClient
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) {
      return new Response(
        JSON.stringify({ success: false, error: 'Forbidden: admin role required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }
    const body = await req.json().catch(() => ({}));
    const csvContent = body.csvContent;
    const stats = await importVendorsFromCSV(csvContent);
    
    console.log('Vendor import completed:', stats);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Vendor import completed',
        stats
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Vendor import failed:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});