-- Create pre_consultations table
CREATE TABLE IF NOT EXISTS public.pre_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Step 1: Service Required
  service_required TEXT NOT NULL,
  
  -- Step 2: Facility Type
  facility_type TEXT,
  
  -- Step 3: Surface Type
  surface_type TEXT,
  
  -- Step 4: Finishing
  finishing TEXT,
  
  -- Step 5: Desired Size (optional)
  length NUMERIC,
  width NUMERIC,
  depth NUMERIC,
  
  -- Step 6: Filtration System (optional)
  filtration_system TEXT,
  
  -- Step 7: Contact Details
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  preferred_contact_method TEXT,
  
  -- Step 8: File Upload
  reference_file_url TEXT,
  reference_file_name TEXT,
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','in-progress','completed','cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.pre_consultations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own pre-consultations"
ON public.pre_consultations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pre-consultations"
ON public.pre_consultations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pre-consultations"
ON public.pre_consultations FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pre-consultations"
ON public.pre_consultations FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER set_updated_at_pre_consultations
BEFORE UPDATE ON public.pre_consultations
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create storage bucket for reference files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pre-consultation-files',
  'pre-consultation-files',
  false,
  1048576,
  ARRAY['image/jpeg', 'image/png', 'application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Users can upload their own reference files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pre-consultation-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own reference files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'pre-consultation-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own reference files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'pre-consultation-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);