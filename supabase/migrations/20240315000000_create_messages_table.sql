-- Create messages table for contact form submissions
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert messages (for public contact form)
CREATE POLICY "Allow insert for all" ON messages
  FOR INSERT USING (true);

-- Create policy to allow authenticated users (admins) to view messages
CREATE POLICY "Allow select for authenticated" ON messages
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users (admins) to delete messages
CREATE POLICY "Allow delete for authenticated" ON messages
  FOR DELETE USING (auth.role() = 'authenticated'); 