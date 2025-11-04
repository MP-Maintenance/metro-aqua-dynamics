-- Create storage bucket for reference files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pre-consultation-files',
  'pre-consultation-files',
  false,
  1048576,
  ARRAY['image/jpeg', 'image/png', 'application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies for pre-consultation files
CREATE POLICY "Users can upload their own pre-consultation files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pre-consultation-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own pre-consultation files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'pre-consultation-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own pre-consultation files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'pre-consultation-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);