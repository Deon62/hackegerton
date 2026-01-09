-- Supabase Table Creation SQL for Hackegerton
-- Run this in your Supabase SQL Editor

-- 1. Users table (for account registration)
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nickname TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Hackathon registrations table (for Hackegerton Check In)
CREATE TABLE IF NOT EXISTS hackathon_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    track TEXT NOT NULL CHECK (track IN ('AI & Data', 'Web / Mobile', 'FinTech / Blockchain')),
    team_name TEXT,
    team_members JSONB DEFAULT '[]'::jsonb,
    registration_type TEXT NOT NULL CHECK (registration_type IN ('Main Hackathon', 'Mini Hackathon')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'free')),
    payment_reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id) -- One registration per user
);

-- 3. Teams table (for team management)
CREATE TABLE IF NOT EXISTS teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_name TEXT NOT NULL,
    leader_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    track TEXT NOT NULL CHECK (track IN ('AI & Data', 'Web / Mobile', 'FinTech / Blockchain')),
    members JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_hackathon_registrations_user_id ON hackathon_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_hackathon_registrations_track ON hackathon_registrations(track);
CREATE INDEX IF NOT EXISTS idx_teams_leader_id ON teams(leader_id);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathon_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for users table
-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

-- Users can insert their own data
CREATE POLICY "Users can insert own data" ON users
    FOR INSERT WITH CHECK (true);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- 7. Create RLS policies for hackathon_registrations table
-- Users can read their own registrations
CREATE POLICY "Users can read own registrations" ON hackathon_registrations
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Users can insert their own registrations
CREATE POLICY "Users can insert own registrations" ON hackathon_registrations
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Users can update their own registrations
CREATE POLICY "Users can update own registrations" ON hackathon_registrations
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- 8. Create RLS policies for teams table
-- Users can read teams they're part of
CREATE POLICY "Users can read teams" ON teams
    FOR SELECT USING (
        auth.uid()::text = leader_id::text OR 
        auth.uid()::text = ANY(SELECT jsonb_array_elements_text(members))
    );

-- Users can insert teams where they're the leader
CREATE POLICY "Users can create teams" ON teams
    FOR INSERT WITH CHECK (auth.uid()::text = leader_id::text);

-- Users can update teams where they're the leader
CREATE POLICY "Users can update own teams" ON teams
    FOR UPDATE USING (auth.uid()::text = leader_id::text);

-- 9. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Create triggers to automatically update updated_at
-- Drop triggers if they exist to avoid errors
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_hackathon_registrations_updated_at ON hackathon_registrations;
DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hackathon_registrations_updated_at BEFORE UPDATE ON hackathon_registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Note: Since we're using custom authentication (not Supabase Auth),
-- the RLS policies above use auth.uid() which won't work with our setup.
-- We'll need to use service_role key for operations or adjust RLS policies.
-- For now, let's create simpler policies that allow public access for our use case:

-- Drop the above RLS policies and create simpler ones
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can read own registrations" ON hackathon_registrations;
DROP POLICY IF EXISTS "Users can insert own registrations" ON hackathon_registrations;
DROP POLICY IF EXISTS "Users can update own registrations" ON hackathon_registrations;
DROP POLICY IF EXISTS "Users can read teams" ON teams;
DROP POLICY IF EXISTS "Users can create teams" ON teams;
DROP POLICY IF EXISTS "Users can update own teams" ON teams;

-- Drop existing public access policies if they exist
DROP POLICY IF EXISTS "Public read access" ON users;
DROP POLICY IF EXISTS "Public insert access" ON users;
DROP POLICY IF EXISTS "Public update access" ON users;
DROP POLICY IF EXISTS "Public read access" ON hackathon_registrations;
DROP POLICY IF EXISTS "Public insert access" ON hackathon_registrations;
DROP POLICY IF EXISTS "Public update access" ON hackathon_registrations;
DROP POLICY IF EXISTS "Public read access" ON teams;
DROP POLICY IF EXISTS "Public insert access" ON teams;
DROP POLICY IF EXISTS "Public update access" ON teams;

-- Create public access policies (since we're using custom auth)
-- In production, you'd want to secure these properly
CREATE POLICY "Public read access" ON users FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON users FOR UPDATE USING (true);

CREATE POLICY "Public read access" ON hackathon_registrations FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON hackathon_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON hackathon_registrations FOR UPDATE USING (true);

CREATE POLICY "Public read access" ON teams FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON teams FOR UPDATE USING (true);
