-- Add created_by to courses for authorship (idempotent)
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES profiles(id);

-- Create course_links table
CREATE TABLE IF NOT EXISTS public.course_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  url text NOT NULL,
  title text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.course_links ENABLE ROW LEVEL SECURITY;

-- Create course_attachments table
CREATE TABLE IF NOT EXISTS public.course_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  mime_type text,
  title text,
  size_bytes bigint,
  is_cover boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.course_attachments ENABLE ROW LEVEL SECURITY;

-- Ensure column exists when table already created
ALTER TABLE public.course_attachments
  ADD COLUMN IF NOT EXISTS is_cover boolean DEFAULT false;

-- Policies for courses management (insert/update) for coordinators/admins
DROP POLICY IF EXISTS "Coordinators can create courses" ON public.courses;
DROP POLICY IF EXISTS "Coordinators can update courses" ON public.courses;
CREATE POLICY "Coordinators can create courses" ON public.courses
  FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('coordinator','admin')));
CREATE POLICY "Coordinators can update courses" ON public.courses
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('coordinator','admin')));

-- Policies for course_links
DROP POLICY IF EXISTS "Anyone can view course links" ON public.course_links;
DROP POLICY IF EXISTS "Coordinators manage course links" ON public.course_links;
CREATE POLICY "Anyone can view course links" ON public.course_links FOR SELECT USING (true);
CREATE POLICY "Coordinators manage course links" ON public.course_links FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('coordinator','admin'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('coordinator','admin'))
);

-- Policies for course_attachments
DROP POLICY IF EXISTS "Anyone can view course attachments" ON public.course_attachments;
DROP POLICY IF EXISTS "Coordinators manage course attachments" ON public.course_attachments;
CREATE POLICY "Anyone can view course attachments" ON public.course_attachments FOR SELECT USING (true);
CREATE POLICY "Coordinators manage course attachments" ON public.course_attachments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('coordinator','admin'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('coordinator','admin'))
); 