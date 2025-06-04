/*
  # Add notifications system
  
  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `userid` (uuid, references users)
      - `type` (text) - tipo da notificação (release, milestone, system)
      - `title` (text) - título da notificação
      - `content` (text) - conteúdo da notificação
      - `read` (boolean) - se foi lida
      - `songid` (uuid, references songs, nullable)
  
  2. Security
    - Enable RLS on notifications table
    - Add policies for users and admins
*/

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  userid uuid REFERENCES auth.users ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  songid uuid REFERENCES songs ON DELETE CASCADE,
  CONSTRAINT valid_type CHECK (type IN ('release', 'milestone', 'system'))
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (userid = auth.uid());

CREATE POLICY "Admins can view all notifications"
  ON notifications
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_userid uuid,
  p_type text,
  p_title text,
  p_content text,
  p_songid uuid DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO notifications (userid, type, title, content, songid)
  VALUES (p_userid, p_type, p_title, p_content, p_songid)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;