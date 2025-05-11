/*
  # Initialize database schema for Karn Kayastha Mahila Samaj

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `full_name` (text)
      - `avatar_url` (text, nullable)
      - `role` (text)
    - `members`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `name` (text)
      - `designation` (text)
      - `photo_url` (text)
      - `bio` (text, nullable)
      - `contact` (text, nullable)
    - `events`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `title` (text)
      - `description` (text)
      - `event_date` (timestamp)
      - `location` (text)
      - `image_url` (text)
      - `is_featured` (boolean)
    - `notifications`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `message` (text)
      - `type` (text)
      - `is_read` (boolean)
      - `user_id` (uuid, references profiles.id)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'Administrator'
);

-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  bio TEXT,
  contact TEXT
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" 
  ON profiles 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- Members Policies
CREATE POLICY "Anyone can view members" 
  ON members 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

CREATE POLICY "Authenticated users can create members" 
  ON members 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update members" 
  ON members 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can delete members" 
  ON members 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Events Policies
CREATE POLICY "Anyone can view events" 
  ON events 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

CREATE POLICY "Authenticated users can create events" 
  ON events 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update events" 
  ON events 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can delete events" 
  ON events 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Notifications Policies
CREATE POLICY "Users can view their own notifications" 
  ON notifications 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
  ON notifications 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to generate notifications
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID,
  p_message TEXT,
  p_type TEXT DEFAULT 'info'
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.notifications (user_id, message, type)
  VALUES (p_user_id, p_message, p_type);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for notifications

-- New member notifications
CREATE OR REPLACE FUNCTION public.handle_new_member()
RETURNS TRIGGER AS $$
DECLARE
  admin_id UUID;
BEGIN
  -- For each admin, create a notification
  FOR admin_id IN SELECT id FROM public.profiles WHERE role = 'Administrator' LOOP
    PERFORM public.create_notification(
      admin_id,
      'New member added: ' || NEW.name,
      'info'
    );
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_member_created
  AFTER INSERT ON public.members
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_member();

-- New event notifications
CREATE OR REPLACE FUNCTION public.handle_new_event()
RETURNS TRIGGER AS $$
DECLARE
  admin_id UUID;
BEGIN
  -- For each admin, create a notification
  FOR admin_id IN SELECT id FROM public.profiles WHERE role = 'Administrator' LOOP
    PERFORM public.create_notification(
      admin_id,
      'New event created: ' || NEW.title,
      'info'
    );
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_event_created
  AFTER INSERT ON public.events
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_event();