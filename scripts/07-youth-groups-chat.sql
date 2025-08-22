-- Youth Groups Chat and Memberships

-- Messages table
CREATE TABLE IF NOT EXISTS youth_group_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES youth_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE youth_group_messages ENABLE ROW LEVEL SECURITY;

-- Public read
DROP POLICY IF EXISTS "Public read group messages" ON youth_group_messages;
CREATE POLICY "Public read group messages" ON youth_group_messages FOR SELECT USING (true);

-- Any authenticated can insert messages (you can tighten later with memberships)
DROP POLICY IF EXISTS "Authenticated can insert group messages" ON youth_group_messages;
CREATE POLICY "Authenticated can insert group messages" ON youth_group_messages FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Admin/coordinator can update/delete messages
DROP POLICY IF EXISTS "Editors can update group messages" ON youth_group_messages;
CREATE POLICY "Editors can update group messages" ON youth_group_messages FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('coordinator','admin')));

DROP POLICY IF EXISTS "Editors can delete group messages" ON youth_group_messages;
CREATE POLICY "Editors can delete group messages" ON youth_group_messages FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('coordinator','admin')));

-- Memberships table (optional)
CREATE TABLE IF NOT EXISTS youth_group_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES youth_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (group_id, user_id)
);

ALTER TABLE youth_group_memberships ENABLE ROW LEVEL SECURITY;

-- Users can view their own membership; admins/coordinators can view all
DROP POLICY IF EXISTS "Memberships readable" ON youth_group_memberships;
CREATE POLICY "Memberships readable" ON youth_group_memberships FOR SELECT USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('coordinator','admin'))
);

-- Authenticated can join any group
DROP POLICY IF EXISTS "Authenticated can join groups" ON youth_group_memberships;
CREATE POLICY "Authenticated can join groups" ON youth_group_memberships FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can delete their own membership; editors can manage all
DROP POLICY IF EXISTS "Users can leave groups" ON youth_group_memberships;
CREATE POLICY "Users can leave groups" ON youth_group_memberships FOR DELETE USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('coordinator','admin'))
); 