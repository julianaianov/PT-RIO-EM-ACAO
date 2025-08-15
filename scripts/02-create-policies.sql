-- Profiles policies
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Nucleos policies (public read)
DROP POLICY IF EXISTS "Anyone can view nucleos" ON nucleos;
CREATE POLICY "Anyone can view nucleos" ON nucleos FOR SELECT USING (active = true);

-- Events policies
DROP POLICY IF EXISTS "Anyone can view events" ON events;
DROP POLICY IF EXISTS "Coordinators can create events" ON events;
DROP POLICY IF EXISTS "Event creators can update their events" ON events;
CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Coordinators can create events" ON events FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('coordinator', 'admin'))
);
CREATE POLICY "Event creators can update their events" ON events FOR UPDATE USING (created_by = auth.uid());

-- Event participants policies
DROP POLICY IF EXISTS "Users can view event participants" ON event_participants;
DROP POLICY IF EXISTS "Users can join events" ON event_participants;
DROP POLICY IF EXISTS "Users can leave events" ON event_participants;
CREATE POLICY "Users can view event participants" ON event_participants FOR SELECT USING (true);
CREATE POLICY "Users can join events" ON event_participants FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can leave events" ON event_participants FOR DELETE USING (user_id = auth.uid());

-- News policies
DROP POLICY IF EXISTS "Anyone can view published news" ON news;
DROP POLICY IF EXISTS "Coordinators can create news" ON news;
CREATE POLICY "Anyone can view published news" ON news FOR SELECT USING (published = true);
CREATE POLICY "Coordinators can create news" ON news FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('coordinator', 'admin'))
);

-- Courses policies (public read)
DROP POLICY IF EXISTS "Anyone can view active courses" ON courses;
CREATE POLICY "Anyone can view active courses" ON courses FOR SELECT USING (active = true);

-- Course progress policies (fix duplicate name and make idempotent)
DROP POLICY IF EXISTS "Users can view own progress" ON course_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON course_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON course_progress;
CREATE POLICY "Users can view own progress" ON course_progress FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own progress" ON course_progress FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own progress" ON course_progress FOR UPDATE USING (user_id = auth.uid());

-- Social movements policies (public read)
DROP POLICY IF EXISTS "Anyone can view active movements" ON social_movements;
CREATE POLICY "Anyone can view active movements" ON social_movements FOR SELECT USING (active = true);

-- Movement participants policies
DROP POLICY IF EXISTS "Users can view movement participants" ON movement_participants;
DROP POLICY IF EXISTS "Users can join movements" ON movement_participants;
CREATE POLICY "Users can view movement participants" ON movement_participants FOR SELECT USING (true);
CREATE POLICY "Users can join movements" ON movement_participants FOR INSERT WITH CHECK (user_id = auth.uid());

-- Youth posts policies
DROP POLICY IF EXISTS "Anyone can view youth posts" ON youth_posts;
DROP POLICY IF EXISTS "Users can create youth posts" ON youth_posts;
DROP POLICY IF EXISTS "Users can update own posts" ON youth_posts;
CREATE POLICY "Anyone can view youth posts" ON youth_posts FOR SELECT USING (true);
CREATE POLICY "Users can create youth posts" ON youth_posts FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "Users can update own posts" ON youth_posts FOR UPDATE USING (created_by = auth.uid());

-- Youth challenges policies (public read)
DROP POLICY IF EXISTS "Anyone can view active challenges" ON youth_challenges;
CREATE POLICY "Anyone can view active challenges" ON youth_challenges FOR SELECT USING (active = true);

-- Challenge submissions policies
DROP POLICY IF EXISTS "Users can view challenge submissions" ON challenge_submissions;
DROP POLICY IF EXISTS "Users can submit to challenges" ON challenge_submissions;
CREATE POLICY "Users can view challenge submissions" ON challenge_submissions FOR SELECT USING (true);
CREATE POLICY "Users can submit to challenges" ON challenge_submissions FOR INSERT WITH CHECK (user_id = auth.uid());

-- Radio programs policies (public read)
DROP POLICY IF EXISTS "Anyone can view radio programs" ON radio_programs;
CREATE POLICY "Anyone can view radio programs" ON radio_programs FOR SELECT USING (true);
