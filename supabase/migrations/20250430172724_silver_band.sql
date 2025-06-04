/*
  # Add song plays tracking
  
  1. New Tables
    - `song_plays`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `songid` (uuid, references songs)
      - `platform` (text) - plataforma de reprodução
      - `country` (text) - país da reprodução
  
  2. Security
    - Enable RLS on song_plays table
    - Add policies for users and admins
*/

CREATE TABLE IF NOT EXISTS song_plays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  songid uuid REFERENCES songs ON DELETE CASCADE,
  platform text NOT NULL,
  country text NOT NULL,
  CONSTRAINT valid_platform CHECK (platform IN ('spotify', 'youtube', 'tiktok', 'other'))
);

ALTER TABLE song_plays ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own song plays"
  ON song_plays
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM songs
      WHERE songs.id = song_plays.songid
      AND songs.userid = auth.uid()
    )
  );

CREATE POLICY "Admins can view all song plays"
  ON song_plays
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to record play and update song stats
CREATE OR REPLACE FUNCTION record_song_play(
  p_songid uuid,
  p_platform text,
  p_country text
) RETURNS void AS $$
DECLARE
  v_userid uuid;
  v_streams integer;
  v_milestone integer;
BEGIN
  -- Record the play
  INSERT INTO song_plays (songid, platform, country)
  VALUES (p_songid, p_platform, p_country);
  
  -- Update song streams count
  UPDATE songs 
  SET streams = streams + 1
  WHERE id = p_songid
  RETURNING userid, streams INTO v_userid, v_streams;
  
  -- Check for milestones and create notifications
  SELECT 
    CASE
      WHEN v_streams = 1000 THEN 1000
      WHEN v_streams = 10000 THEN 10000
      WHEN v_streams = 100000 THEN 100000
      WHEN v_streams = 500000 THEN 500000
      WHEN v_streams = 1000000 THEN 1000000
      ELSE 0
    END INTO v_milestone;
    
  IF v_milestone > 0 THEN
    PERFORM create_notification(
      v_userid,
      'milestone',
      'Parabéns! Sua música atingiu uma nova marca!',
      format('Sua música alcançou %s reproduções!', v_milestone),
      p_songid
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;