
-- Add song status tracking
CREATE TYPE song_status AS ENUM (
  'submitted',
  'under_review',
  'approved',
  'in_production',
  'mastering',
  'distribution_pending',
  'published',
  'rejected'
);

-- Add status column to songs table
ALTER TABLE songs ADD COLUMN status song_status DEFAULT 'submitted';
ALTER TABLE songs ADD COLUMN status_notes TEXT;
ALTER TABLE songs ADD COLUMN status_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE songs ADD COLUMN status_updated_by UUID REFERENCES auth.users(id);

-- Add super admin role
UPDATE profiles SET role = 'super_admin' WHERE role = 'admin';

-- Create function to update song status
CREATE OR REPLACE FUNCTION update_song_status()
RETURNS TRIGGER AS $$
BEGIN
  NEW.status_updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for song status updates
CREATE TRIGGER song_status_updated
  BEFORE UPDATE OF status ON songs
  FOR EACH ROW
  EXECUTE FUNCTION update_song_status();

-- Add RLS policies for super admin
CREATE POLICY "Super admins can view all profiles"
  ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can update all profiles"
  ON profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can view all artists"
  ON artists
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can manage all songs"
  ON songs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can manage all song collaborators"
  ON song_collaborators
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );
