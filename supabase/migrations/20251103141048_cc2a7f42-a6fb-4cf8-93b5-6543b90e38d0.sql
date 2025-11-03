-- Add items column to store multiple products in a quote request
ALTER TABLE public.quote_requests 
ADD COLUMN items JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Make product_id and quantity nullable since we'll use items column instead
ALTER TABLE public.quote_requests 
ALTER COLUMN product_id DROP NOT NULL,
ALTER COLUMN quantity DROP NOT NULL;