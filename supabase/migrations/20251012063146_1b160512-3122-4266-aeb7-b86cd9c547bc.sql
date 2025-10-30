-- Create storage bucket for vendor data
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vendor-data', 'vendor-data', true)
ON CONFLICT (id) DO NOTHING;

-- Enable public access to vendor-data bucket
CREATE POLICY "Public Access to vendor data"
ON storage.objects FOR SELECT
USING (bucket_id = 'vendor-data');

CREATE POLICY "Authenticated users can upload vendor data"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'vendor-data' AND auth.role() = 'authenticated');