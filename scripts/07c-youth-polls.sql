-- Polls for youth groups
CREATE TABLE IF NOT EXISTS youth_group_polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES youth_groups(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closes_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS youth_group_poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES youth_group_polls(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS youth_group_poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES youth_group_polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES youth_group_poll_options(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (poll_id, user_id)
);

ALTER TABLE youth_group_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE youth_group_poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE youth_group_poll_votes ENABLE ROW LEVEL SECURITY;

-- Read
DROP POLICY IF EXISTS "Public read polls" ON youth_group_polls;
CREATE POLICY "Public read polls" ON youth_group_polls FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read poll options" ON youth_group_poll_options;
CREATE POLICY "Public read poll options" ON youth_group_poll_options FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read poll votes" ON youth_group_poll_votes;
CREATE POLICY "Public read poll votes" ON youth_group_poll_votes FOR SELECT USING (true);

-- Insert
DROP POLICY IF EXISTS "Authenticated create polls" ON youth_group_polls;
CREATE POLICY "Authenticated create polls" ON youth_group_polls FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Authenticated create poll options" ON youth_group_poll_options;
CREATE POLICY "Authenticated create poll options" ON youth_group_poll_options FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Authenticated vote" ON youth_group_poll_votes;
CREATE POLICY "Authenticated vote" ON youth_group_poll_votes FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Editors manage
DROP POLICY IF EXISTS "Editors manage polls" ON youth_group_polls;
CREATE POLICY "Editors manage polls" ON youth_group_polls FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('coordinator','admin')));
DROP POLICY IF EXISTS "Editors delete polls" ON youth_group_polls;
CREATE POLICY "Editors delete polls" ON youth_group_polls FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('coordinator','admin')));
DROP POLICY IF EXISTS "Editors manage options" ON youth_group_poll_options;
CREATE POLICY "Editors manage options" ON youth_group_poll_options FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('coordinator','admin')));
DROP POLICY IF EXISTS "Editors delete options" ON youth_group_poll_options;
CREATE POLICY "Editors delete options" ON youth_group_poll_options FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('coordinator','admin'))); 