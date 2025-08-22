-- Leaderboard uses profiles.points; add a table to log point changes
CREATE TABLE IF NOT EXISTS point_transactions (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
	Delta INTEGER NOT NULL,
	reason TEXT,
	created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;

-- Policies: public read, authenticated insert own, admins manage all
DROP POLICY IF EXISTS "Public read point transactions" ON point_transactions;
CREATE POLICY "Public read point transactions" ON point_transactions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert own transactions" ON point_transactions;
CREATE POLICY "Users can insert own transactions" ON point_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins manage point transactions" ON point_transactions;
CREATE POLICY "Admins manage point transactions" ON point_transactions FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id=auth.uid() AND role IN ('admin','coordinator'))); 