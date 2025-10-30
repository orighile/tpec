import { supabase } from "@/integrations/supabase/client";

export async function uploadVendorCSVToStorage(): Promise<{ success: boolean; error?: string }> {
  try {
    // Fetch the CSV from the public folder
    const response = await fetch('/data/vendors_from_excel.csv');
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    
    const csvBlob = await response.blob();
    const csvFile = new File([csvBlob], 'vendors_from_excel.csv', { type: 'text/csv' });
    
    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('vendor-data')
      .upload('vendors_from_excel.csv', csvFile, {
        upsert: true,
        contentType: 'text/csv'
      });
    
    if (uploadError) {
      throw uploadError;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error uploading CSV to storage:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}