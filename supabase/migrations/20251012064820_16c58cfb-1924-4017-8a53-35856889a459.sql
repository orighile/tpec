-- Allow public access to view verified vendors
CREATE POLICY "Anyone can view verified vendors"
ON vendors
FOR SELECT
USING (verified = true);