-- Extra fields for debates
ALTER TABLE youth_groups ADD COLUMN IF NOT EXISTS motive TEXT;
ALTER TABLE youth_groups ADD COLUMN IF NOT EXISTS purpose TEXT; 