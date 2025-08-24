-- Share Links Management for Admin Dashboard
-- Tabela para gerenciar links de compartilhamento que aparecem no card de compartilhamento

CREATE TABLE IF NOT EXISTS share_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  path TEXT NOT NULL,
  message TEXT,
  icon TEXT DEFAULT 'Share2',
  color TEXT DEFAULT 'text-red-600',
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;

-- Public read for active links
DROP POLICY IF EXISTS "Public read share_links" ON share_links;
CREATE POLICY "Public read share_links" ON share_links FOR SELECT USING (active = true);

-- Admin/coordinator can manage all links
DROP POLICY IF EXISTS "Admins manage share_links" ON share_links;
CREATE POLICY "Admins manage share_links" ON share_links FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','coordinator'))
);

-- Insert default links
INSERT INTO share_links (label, path, message, icon, color, order_index) VALUES
  ('Página Inicial', '/', 'Acompanhe a Página Inicial na Plataforma PT RJ', 'Home', 'text-red-600', 1),
  ('Notícias', '/news', 'Acompanhe as Notícias na Plataforma PT RJ', 'Newspaper', 'text-blue-600', 2),
  ('Agenda', '/events', 'Acompanhe a Agenda na Plataforma PT RJ', 'Calendar', 'text-green-600', 3),
  ('Formação', '/courses', 'Acompanhe a Formação na Plataforma PT RJ', 'BookOpen', 'text-purple-600', 4),
  ('Rádio', '/radio', 'Acompanhe a Rádio na Plataforma PT RJ', 'Radio', 'text-red-600', 5),
  ('Movimentos', '/movements', 'Acompanhe os Movimentos na Plataforma PT RJ', 'Users', 'text-teal-600', 6),
  ('Instagram PT RJ', 'https://www.instagram.com/diegozeidan/', 'Siga o PT RJ no Instagram', 'Share2', 'text-pink-600', 7)
ON CONFLICT DO NOTHING;

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_share_links_updated_at ON share_links;
CREATE TRIGGER update_share_links_updated_at
    BEFORE UPDATE ON share_links
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
