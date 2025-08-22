-- Movement partnerships table
CREATE TABLE IF NOT EXISTS movement_partnerships (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	name TEXT NOT NULL,
	partnership_type TEXT,
	members_info TEXT,
	order_index INTEGER,
	active BOOLEAN DEFAULT true,
	created_by UUID REFERENCES profiles(id),
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE movement_partnerships ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Anyone can view active partnerships" ON movement_partnerships;
CREATE POLICY "Anyone can view active partnerships" ON movement_partnerships FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Coordinators can create partnerships" ON movement_partnerships;
CREATE POLICY "Coordinators can create partnerships" ON movement_partnerships FOR INSERT WITH CHECK (
	EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('coordinator','admin'))
);

DROP POLICY IF EXISTS "Coordinators can update partnerships" ON movement_partnerships;
CREATE POLICY "Coordinators can update partnerships" ON movement_partnerships FOR UPDATE USING (
	EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('coordinator','admin'))
);

DROP POLICY IF EXISTS "Coordinators can delete partnerships" ON movement_partnerships;
CREATE POLICY "Coordinators can delete partnerships" ON movement_partnerships FOR DELETE USING (
	EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('coordinator','admin'))
); 