-- Youth mentorship applications (mentees)
CREATE TABLE IF NOT EXISTS youth_mentorship_applications (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	program_id UUID NOT NULL REFERENCES youth_mentorships(id) ON DELETE CASCADE,
	user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
	motivation TEXT,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	UNIQUE(program_id, user_id)
);

-- Mentor applications
CREATE TABLE IF NOT EXISTS youth_mentor_applications (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
	areas TEXT,
	message TEXT,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	UNIQUE(user_id)
);

ALTER TABLE youth_mentorship_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE youth_mentor_applications ENABLE ROW LEVEL SECURITY;

-- Public read
DO $$
BEGIN
	EXECUTE 'DROP POLICY IF EXISTS "Public read mentorship applications" ON youth_mentorship_applications';
	EXECUTE 'CREATE POLICY "Public read mentorship applications" ON youth_mentorship_applications FOR SELECT USING (true)';
	EXECUTE 'DROP POLICY IF EXISTS "Public read mentor applications" ON youth_mentor_applications';
	EXECUTE 'CREATE POLICY "Public read mentor applications" ON youth_mentor_applications FOR SELECT USING (true)';
END$$;

-- Authenticated can insert
DO $$
BEGIN
	EXECUTE 'DROP POLICY IF EXISTS "Auth can insert mentorship applications" ON youth_mentorship_applications';
	EXECUTE 'CREATE POLICY "Auth can insert mentorship applications" ON youth_mentorship_applications FOR INSERT WITH CHECK (auth.uid() = user_id)';
	EXECUTE 'DROP POLICY IF EXISTS "Auth can insert mentor applications" ON youth_mentor_applications';
	EXECUTE 'CREATE POLICY "Auth can insert mentor applications" ON youth_mentor_applications FOR INSERT WITH CHECK (auth.uid() = user_id)';
END$$;

-- Users can delete their own; admins/coordinators can delete any
DO $$
BEGIN
	EXECUTE 'DROP POLICY IF EXISTS "Owner can delete mentorship application" ON youth_mentorship_applications';
	EXECUTE 'CREATE POLICY "Owner can delete mentorship application" ON youth_mentorship_applications FOR DELETE USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id=auth.uid() AND role IN (''coordinator'',''admin'')))';
	EXECUTE 'DROP POLICY IF EXISTS "Owner can delete mentor application" ON youth_mentor_applications';
	EXECUTE 'CREATE POLICY "Owner can delete mentor application" ON youth_mentor_applications FOR DELETE USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id=auth.uid() AND role IN (''coordinator'',''admin'')))';
END$$; 