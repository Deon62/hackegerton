-- Create sponsor_inquiries table
CREATE TABLE IF NOT EXISTS sponsor_inquiries (
    id BIGSERIAL PRIMARY KEY,
    company_name TEXT NOT NULL,
    contact_full_name TEXT NOT NULL,
    contact_role_title TEXT,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    sponsorship_types TEXT[] DEFAULT '{}',
    contribution_range TEXT,
    interests TEXT[] DEFAULT '{}',
    logo_approval BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_sponsor_inquiries_updated_at ON sponsor_inquiries;
CREATE TRIGGER update_sponsor_inquiries_updated_at
    BEFORE UPDATE ON sponsor_inquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE sponsor_inquiries ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public insert (for form submissions)
DROP POLICY IF EXISTS "Public insert access" ON sponsor_inquiries;
CREATE POLICY "Public insert access" ON sponsor_inquiries
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Policy: Allow authenticated users to read (for admin access)
DROP POLICY IF EXISTS "Authenticated read access" ON sponsor_inquiries;
CREATE POLICY "Authenticated read access" ON sponsor_inquiries
    FOR SELECT
    TO authenticated
    USING (true);
