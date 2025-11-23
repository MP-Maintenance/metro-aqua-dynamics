-- Update RLS policies for inquiries table to support authenticated users
-- Drop existing policies
DROP POLICY IF EXISTS "Insert own inquiry" ON public.inquiries;
DROP POLICY IF EXISTS "Select own inquiry" ON public.inquiries;

-- Create new policies that properly check user authentication
CREATE POLICY "Users can insert their own inquiries"
ON public.inquiries
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  (user_id = auth.uid() OR user_id IS NULL)
);

CREATE POLICY "Users can view their own inquiries"
ON public.inquiries
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND 
  user_id = auth.uid()
);

-- Admin policy remains unchanged
-- Admin access policy should already exist