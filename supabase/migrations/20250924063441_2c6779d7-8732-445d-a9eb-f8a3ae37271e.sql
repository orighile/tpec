-- Enable pg_cron and pg_net extensions for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Set up weekly cron job to import vendors every Monday at 2am
SELECT cron.schedule(
  'weekly-vendor-import',
  '0 2 * * 1', -- 2 AM every Monday
  $$
  SELECT net.http_post(
    url:='https://lppgtqtqockemugndxio.supabase.co/functions/v1/import-vendors-csv',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwcGd0cXRxb2NrZW11Z25keGlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzOTkyOTEsImV4cCI6MjA1ODk3NTI5MX0.XU3emxlOYImEdOWTSqqBi2OOSZN9g6reohd-jnVX_Jo"}'::jsonb,
    body:='{"source": "cron"}'::jsonb
  ) as request_id;
  $$
);