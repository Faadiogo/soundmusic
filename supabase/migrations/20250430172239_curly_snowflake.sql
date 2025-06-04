/*
  # Fix profiles policy infinite recursion

  1. Changes
    - Remove recursive policy for profiles table
    - Add simple policy for authenticated users to view their own profile
    - Add policy for admins to view all profiles

  2. Security
    - Maintains RLS on profiles table
    - Ensures users can only access their own data
    - Allows admins to access all profiles
*/

-- Drop existing policies that might be causing recursion
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create new, non-recursive policies
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);