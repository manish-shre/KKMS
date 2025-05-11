-- Create messages table for contact form submissions
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for public contact form)
CREATE POLICY "Allow insert for all" ON messages
  FOR INSERT USING (true);

-- Allow authenticated users (admins) to select
CREATE POLICY "Allow select for authenticated" ON messages
  FOR SELECT USING (auth.role() = 'authenticated'); 