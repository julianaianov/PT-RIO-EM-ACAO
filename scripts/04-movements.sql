-- Movements table
CREATE TABLE IF NOT EXISTS movements (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	name TEXT NOT NULL,
	description TEXT NOT NULL,
	category TEXT,
	region TEXT,
	founded TEXT,
	members INTEGER,
	contact_whatsapp TEXT,
	contact_instagram TEXT,
	contact_facebook TEXT,
	contact_email TEXT,
	website TEXT,
	image_url TEXT,
	created_by UUID REFERENCES profiles(id),
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE movements ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Anyone can view movements" ON movements;
CREATE POLICY "Anyone can view movements" ON movements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Coordinators can create movements" ON movements;
CREATE POLICY "Coordinators can create movements" ON movements FOR INSERT WITH CHECK (
	EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('coordinator', 'admin'))
);

DROP POLICY IF EXISTS "Movement creators can update" ON movements;
CREATE POLICY "Movement creators can update" ON movements FOR UPDATE USING (created_by = auth.uid());

-- Delete policies
DROP POLICY IF EXISTS "Movement creators can delete" ON movements;
CREATE POLICY "Movement creators can delete" ON movements FOR DELETE USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Admins can delete movements" ON movements;
CREATE POLICY "Admins can delete movements" ON movements FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('coordinator','admin'))
); 