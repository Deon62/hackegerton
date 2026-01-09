-- Migration SQL to add gender and avatar_url columns to existing users table
-- Run this if you already have a users table without these columns

-- Add gender column (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'gender'
    ) THEN
        ALTER TABLE users ADD COLUMN gender TEXT CHECK (gender IN ('male', 'female'));
    END IF;
END $$;

-- Add avatar_url column (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'avatar_url'
    ) THEN
        ALTER TABLE users ADD COLUMN avatar_url TEXT;
    END IF;
END $$;

-- Update existing users without avatars to have default male avatar
UPDATE users SET avatar_url = 'assets/male.png' WHERE avatar_url IS NULL;
