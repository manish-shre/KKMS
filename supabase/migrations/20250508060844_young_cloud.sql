/*
  # Update members table RLS policies

  1. Changes
    - Remove existing overly permissive policies
    - Add new policies that only allow administrators to manage members
    - Keep public read access for members

  2. Security
    - Only administrators can create, update, and delete members
    - Public users can still view members
    - Policies check user role from profiles table
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON members;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON members;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON members;

-- Keep the existing read policy
DROP POLICY IF EXISTS "Enable read access for all users" ON members;
CREATE POLICY "Enable read access for all users"
ON members
FOR SELECT
TO public
USING (true);

-- Add new admin-only policies
CREATE POLICY "Enable insert for administrators"
ON members
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'Administrator'
  )
);

CREATE POLICY "Enable update for administrators"
ON members
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'Administrator'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'Administrator'
  )
);

CREATE POLICY "Enable delete for administrators"
ON members
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'Administrator'
  )
);