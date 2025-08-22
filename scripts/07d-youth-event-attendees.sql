-- Attendees for youth events
CREATE TABLE IF NOT EXISTS youth_event_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES youth_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);

ALTER TABLE youth_event_attendees ENABLE ROW LEVEL SECURITY;

-- Public read
DROP POLICY IF EXISTS "Public read event attendees" ON youth_event_attendees;
CREATE POLICY "Public read event attendees" ON youth_event_attendees FOR SELECT USING (true);

-- Authenticated can confirm presence
DROP POLICY IF EXISTS "Authenticated can join events" ON youth_event_attendees;
CREATE POLICY "Authenticated can join events" ON youth_event_attendees FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can remove own presence, editors can manage all
DROP POLICY IF EXISTS "Users can leave events" ON youth_event_attendees;
CREATE POLICY "Users can leave events" ON youth_event_attendees FOR DELETE USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('coordinator','admin'))
); 