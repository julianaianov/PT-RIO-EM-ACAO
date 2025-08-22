-- Youth: base entities used by /youth page

-- Events
CREATE TABLE IF NOT EXISTS youth_events (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	title TEXT NOT NULL,
	description TEXT,
	event_date TIMESTAMP WITH TIME ZONE NOT NULL,
	location TEXT,
	category TEXT,
	participants INTEGER DEFAULT 0,
	max_participants INTEGER,
	event_type TEXT CHECK (event_type IN ('Online','Presencial')),
	organizer TEXT,
	active BOOLEAN DEFAULT true,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mentorship programs
CREATE TABLE IF NOT EXISTS youth_mentorships (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	title TEXT NOT NULL,
	description TEXT,
	duration TEXT,
	mentors INTEGER,
	mentees INTEGER,
	next_cohort TEXT,
	level TEXT CHECK (level IN ('Iniciante','Intermediário','Avançado')),
	active BOOLEAN DEFAULT true,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discussion groups (quick actions)
CREATE TABLE IF NOT EXISTS youth_groups (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	name TEXT NOT NULL,
	members INTEGER,
	last_activity TEXT,
	topic TEXT,
	color TEXT,
	active BOOLEAN DEFAULT true,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Youth leaders
CREATE TABLE IF NOT EXISTS youth_leaders (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	name TEXT NOT NULL,
	role TEXT,
	age INTEGER,
	focus TEXT,
	image_url TEXT,
	active BOOLEAN DEFAULT true,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Opportunities
CREATE TABLE IF NOT EXISTS youth_opportunities (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	title TEXT NOT NULL,
	description TEXT,
	org TEXT,
	deadline DATE,
	opportunity_type TEXT,
	active BOOLEAN DEFAULT true,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE youth_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE youth_mentorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE youth_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE youth_leaders ENABLE ROW LEVEL SECURITY;
ALTER TABLE youth_opportunities ENABLE ROW LEVEL SECURITY;

-- Policies: public read active=true
DO $$
BEGIN
	EXECUTE 'DROP POLICY IF EXISTS "Public read youth_events" ON youth_events';
	EXECUTE 'CREATE POLICY "Public read youth_events" ON youth_events FOR SELECT USING (active = true)';

	EXECUTE 'DROP POLICY IF EXISTS "Public read youth_mentorships" ON youth_mentorships';
	EXECUTE 'CREATE POLICY "Public read youth_mentorships" ON youth_mentorships FOR SELECT USING (active = true)';

	EXECUTE 'DROP POLICY IF EXISTS "Public read youth_groups" ON youth_groups';
	EXECUTE 'CREATE POLICY "Public read youth_groups" ON youth_groups FOR SELECT USING (active = true)';

	EXECUTE 'DROP POLICY IF EXISTS "Public read youth_leaders" ON youth_leaders';
	EXECUTE 'CREATE POLICY "Public read youth_leaders" ON youth_leaders FOR SELECT USING (active = true)';

	EXECUTE 'DROP POLICY IF EXISTS "Public read youth_opportunities" ON youth_opportunities';
	EXECUTE 'CREATE POLICY "Public read youth_opportunities" ON youth_opportunities FOR SELECT USING (active = true)';
END$$;

-- Policies: admin/coordinator CRUD
DO $$
DECLARE
	_t text;
	_tbls text[] := ARRAY['youth_events','youth_mentorships','youth_groups','youth_leaders','youth_opportunities'];
BEGIN
	FOREACH _t IN ARRAY _tbls LOOP
		EXECUTE format('DROP POLICY IF EXISTS "Editors can insert %s" ON %I', _t, _t);
		EXECUTE format('CREATE POLICY "Editors can insert %s" ON %I FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id=auth.uid() AND role IN (''coordinator'',''admin'')))', _t, _t);
		EXECUTE format('DROP POLICY IF EXISTS "Editors can update %s" ON %I', _t, _t);
		EXECUTE format('CREATE POLICY "Editors can update %s" ON %I FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id=auth.uid() AND role IN (''coordinator'',''admin'')))', _t, _t);
		EXECUTE format('DROP POLICY IF EXISTS "Editors can delete %s" ON %I', _t, _t);
		EXECUTE format('CREATE POLICY "Editors can delete %s" ON %I FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id=auth.uid() AND role IN (''coordinator'',''admin'')))', _t, _t);
	END LOOP;
END$$; 