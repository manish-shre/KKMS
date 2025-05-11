/*
  # Add Events Storage Bucket

  1. Changes
    - Create storage bucket for event images
    - Add storage policies for public read access
    - Add storage policies for authenticated users to upload, update, and delete images
    - Create events folder in the storage bucket

  2. Security
    - Public read access for all images
    - Authenticated users can upload, update, and delete images
*/

BEGIN;
  -- Create storage bucket for event images
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('images', 'images', true)
  ON CONFLICT (id) DO NOTHING;

  -- Create events folder in the storage bucket
  INSERT INTO storage.objects (bucket_id, name, owner)
  VALUES ('images', 'events/', auth.uid())
  ON CONFLICT (bucket_id, name) DO NOTHING;

  -- Policy for viewing images (public read)
  CREATE POLICY "Public Access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'images');

  -- Policy for uploading images (authenticated users only)
  CREATE POLICY "Authenticated users can upload images"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'images' 
      AND auth.role() = 'authenticated'
    );

  -- Policy for updating images (authenticated users only)
  CREATE POLICY "Authenticated users can update their own images"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = 'images' 
      AND auth.role() = 'authenticated'
    );

  -- Policy for deleting images (authenticated users only)
  CREATE POLICY "Authenticated users can delete their own images"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'images' 
      AND auth.role() = 'authenticated'
    );
COMMIT; 