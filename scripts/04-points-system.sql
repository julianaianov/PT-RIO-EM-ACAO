-- Create point_actions table to track all point-earning activities
CREATE TABLE IF NOT EXISTS point_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN (
    'event_attendance', 'plenaria_attendance', 'course_completion', 
    'social_share', 'new_affiliate', 'weekly_mission', 
    'youth_proposal', 'donation'
  )),
  points_earned INTEGER NOT NULL,
  description TEXT,
  reference_id UUID, -- Can reference events, courses, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create weekly_missions table
CREATE TABLE IF NOT EXISTS weekly_missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  points_reward INTEGER DEFAULT 25,
  mission_type TEXT CHECK (mission_type IN ('poster', 'flyer', 'door_to_door', 'social_media')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mission_completions table
CREATE TABLE IF NOT EXISTS mission_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mission_id UUID REFERENCES weekly_missions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  proof_url TEXT, -- Photo or evidence
  description TEXT,
  approved BOOLEAN DEFAULT false,
  points_awarded INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(mission_id, user_id)
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2),
  donation_type TEXT CHECK (donation_type IN ('money', 'material', 'service')),
  description TEXT,
  points_awarded INTEGER DEFAULT 15,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for new tables
ALTER TABLE point_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
