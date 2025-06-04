/*
  # Initial schema for SOUNDMUSIC Platform

  1. New Tables
    - `profiles`
      - `id` (UUID, references auth.users)
      - `updated_at` (timestamp)
      - `username` (text, nullable)
      - `full_name` (text, nullable)
      - `avatar_url` (text, nullable)
      - `website` (text, nullable)
      - `role` (text, default 'user')

    - `artists`
      - `id` (UUID, primary key)
      - `created_at` (timestamp)
      - `userId` (UUID, references auth.users)
      - `name` (text)
      - `artisticName` (text)
      - `birthDate` (date)
      - `cpf` (text)
      - `soundOnEmail` (text, nullable)
      - `onerpmEmail` (text, nullable)
      - `spotifyLink` (text, nullable)
      - `youtubeLink` (text, nullable)
      - `tiktokLink` (text, nullable)
      - `instagramLink` (text, nullable)

    - `songs`
      - `id` (UUID, primary key)
      - `created_at` (timestamp)
      - `userId` (UUID, references auth.users)
      - `title` (text)
      - `genre` (text)
      - `lyrics` (text, nullable)
      - `duration` (integer)
      - `audioUrl` (text, nullable)
      - `releaseDate` (date)
      - `distributorRoyalty` (numeric)
      - `streams` (integer, default 0)
      - `revenue` (numeric, default 0)

    - `song_collaborators`
      - `id` (UUID, primary key)
      - `songId` (UUID, references songs)
      - `artistId` (UUID, references artists)
      - `role` (text)
      - `royaltyPercentage` (numeric)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data
    - Admin users can access all records
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  updated_at TIMESTAMP WITH TIME ZONE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  role TEXT NOT NULL DEFAULT 'user'
);

-- Create artists table
CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  userId UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  artisticName TEXT NOT NULL,
  birthDate DATE NOT NULL,
  cpf TEXT NOT NULL,
  soundOnEmail TEXT,
  onerpmEmail TEXT,
  spotifyLink TEXT,
  youtubeLink TEXT,
  tiktokLink TEXT,
  instagramLink TEXT
);

-- Create songs table
CREATE TABLE IF NOT EXISTS songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  userId UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  genre TEXT NOT NULL,
  lyrics TEXT,
  duration INTEGER NOT NULL,
  audioUrl TEXT,
  releaseDate DATE NOT NULL,
  distributorRoyalty NUMERIC NOT NULL,
  streams INTEGER NOT NULL DEFAULT 0,
  revenue NUMERIC NOT NULL DEFAULT 0
);

-- Create song collaborators table (for managing artists and royalty percentages)
CREATE TABLE IF NOT EXISTS song_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  songId UUID NOT NULL REFERENCES songs ON DELETE CASCADE,
  artistId UUID NOT NULL REFERENCES artists ON DELETE CASCADE,
  role TEXT NOT NULL,
  royaltyPercentage NUMERIC NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE song_collaborators ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Artists RLS policies
CREATE POLICY "Users can view their own artists"
  ON artists
  FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can create their own artists"
  ON artists
  FOR INSERT
  WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update their own artists"
  ON artists
  FOR UPDATE
  USING (auth.uid() = userId);

CREATE POLICY "Users can delete their own artists"
  ON artists
  FOR DELETE
  USING (auth.uid() = userId);

-- Songs RLS policies
CREATE POLICY "Users can view their own songs"
  ON songs
  FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can create their own songs"
  ON songs
  FOR INSERT
  WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update their own songs"
  ON songs
  FOR UPDATE
  USING (auth.uid() = userId);

CREATE POLICY "Users can delete their own songs"
  ON songs
  FOR DELETE
  USING (auth.uid() = userId);

-- Song Collaborators RLS policies
CREATE POLICY "Users can view their song collaborators"
  ON song_collaborators
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM songs
      WHERE songs.id = song_collaborators.songId
      AND songs.userId = auth.uid()
    )
  );

CREATE POLICY "Users can create song collaborators for their songs"
  ON song_collaborators
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM songs
      WHERE songs.id = song_collaborators.songId
      AND songs.userId = auth.uid()
    )
  );

CREATE POLICY "Users can update song collaborators for their songs"
  ON song_collaborators
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM songs
      WHERE songs.id = song_collaborators.songId
      AND songs.userId = auth.uid()
    )
  );

CREATE POLICY "Users can delete song collaborators for their songs"
  ON song_collaborators
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM songs
      WHERE songs.id = song_collaborators.songId
      AND songs.userId = auth.uid()
    )
  );

-- Admin policies
CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can view all artists"
  ON artists
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all artists"
  ON artists
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete all artists"
  ON artists
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can view all songs"
  ON songs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all songs"
  ON songs
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete all songs"
  ON songs
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can view all song collaborators"
  ON song_collaborators
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all song collaborators"
  ON song_collaborators
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete all song collaborators"
  ON song_collaborators
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create a trigger to create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();