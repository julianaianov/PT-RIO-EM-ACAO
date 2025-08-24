-- Items curated by admins to be shared on social networks
CREATE TABLE IF NOT EXISTS share_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  image_url TEXT,
  target_url TEXT, -- absolute or relative URL to open/share
  active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE share_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read share_items" ON share_items;
CREATE POLICY "Public read share_items" ON share_items FOR SELECT USING (active = true);
DROP POLICY IF EXISTS "Admins manage share_items" ON share_items;
CREATE POLICY "Admins manage share_items" ON share_items FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','coordinator'))
);

