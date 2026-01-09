-- Quick migration: Add gender and avatar_url columns to existing users table
-- Run this if you already ran the initial SQL and just need to add these columns

-- Add gender column
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female'));

-- Add avatar_url column  
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Update existing users without avatars to have default male avatar
UPDATE users SET avatar_url = 'assets/male.png' WHERE avatar_url IS NULL;
