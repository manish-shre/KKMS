/*
  # Fix Members RLS Policies

  1. Changes
    - Update RLS policies for members table to properly handle authenticated users
    - Add storage bucket policies for members' photos

  2. Security
    - Enable RLS on members table
    - Add policies for CRUD operations
    - Add storage policies for image uploads
*/

-- Drop existing policies for members table
DROP POLICY IF EXISTS "Anyone can view members" ON members;
DROP POLICY IF EXISTS "Authenticated users can create members" ON members;
DROP POLICY IF EXISTS "Authenticated users can delete members" ON members;
DROP POLICY IF EXISTS "Authenticated users can update members" ON members;

-- Create new policies for members table
CREATE POLICY "Enable read access for all users" ON members
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON members
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON members
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users" ON members
  FOR DELETE TO authenticated
  USING (true);

-- Storage policies for members photos
BEGIN;
  -- Create storage bucket if it doesn't exist
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('members', 'members', true)
  ON CONFLICT (id) DO NOTHING;

  -- Policy for viewing photos (public read)
  CREATE POLICY "Public Access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'members');

  -- Policy for uploading photos (authenticated users only)
  CREATE POLICY "Authenticated users can upload photos"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'members');

  -- Policy for updating photos (authenticated users only)
  CREATE POLICY "Authenticated users can update photos"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'members');

  -- Policy for deleting photos (authenticated users only)
  CREATE POLICY "Authenticated users can delete photos"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'members');
COMMIT;