-- Storage policies for bucket `course-files`
-- Run this in the Supabase SQL Editor (one go). Idempotent.

-- Public read (optional if bucket is already public)
DROP POLICY IF EXISTS "Public read course-files" ON storage.objects;
CREATE POLICY "Public read course-files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'course-files');

-- Upload (INSERT) allowed to authenticated users only in their own folder /{auth.uid()}/...
DROP POLICY IF EXISTS "Auth upload own folder course-files" ON storage.objects;
CREATE POLICY "Auth upload own folder course-files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'course-files'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Update only own objects (optional)
DROP POLICY IF EXISTS "Auth update own folder course-files" ON storage.objects;
CREATE POLICY "Auth update own folder course-files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'course-files'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Delete only own objects (optional)
DROP POLICY IF EXISTS "Auth delete own folder course-files" ON storage.objects;
CREATE POLICY "Auth delete own folder course-files"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'course-files'
    AND (storage.foldername(name))[1] = auth.uid()::text
  ); 