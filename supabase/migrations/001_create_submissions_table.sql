-- Create patient_submissions table for crowdsourced wait time data
CREATE TABLE IF NOT EXISTS patient_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  procedure TEXT NOT NULL CHECK (procedure IN ('cataract', 'hip', 'knee')),
  location TEXT NOT NULL CHECK (location IN ('london', 'manchester', 'birmingham', 'leeds', 'bristol')),
  booking_date DATE NOT NULL,
  surgery_date DATE NOT NULL,
  wait_weeks INT NOT NULL CHECK (wait_weeks >= 0 AND wait_weeks <= 200),
  nhs_or_private TEXT NOT NULL CHECK (nhs_or_private IN ('nhs', 'private')),
  cancellations INT DEFAULT 0 CHECK (cancellations >= 0 AND cancellations <= 10),
  satisfaction INT CHECK (satisfaction >= 1 AND satisfaction <= 5),
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published BOOLEAN DEFAULT TRUE,
  flagged_for_review BOOLEAN DEFAULT FALSE,
  
  -- Validation constraints
  CONSTRAINT valid_dates CHECK (surgery_date >= booking_date),
  CONSTRAINT reasonable_wait CHECK (
    (wait_weeks >= 1 AND wait_weeks <= 120) OR 
    (wait_weeks > 120 AND flagged_for_review = TRUE) OR
    (wait_weeks < 1 AND nhs_or_private = 'private')
  )
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_submissions_procedure_location 
  ON patient_submissions(procedure, location);

CREATE INDEX IF NOT EXISTS idx_submissions_created_at 
  ON patient_submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_submissions_published 
  ON patient_submissions(published) WHERE published = TRUE;

-- Create index for duplicate detection
CREATE INDEX IF NOT EXISTS idx_submissions_dates 
  ON patient_submissions(booking_date, surgery_date);

-- Enable Row Level Security (RLS)
ALTER TABLE patient_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert submissions
CREATE POLICY "Allow public inserts" ON patient_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Allow anyone to read published submissions
CREATE POLICY "Allow public reads" ON patient_submissions
  FOR SELECT
  TO public
  USING (published = TRUE);

-- Function to auto-flag unusual submissions
CREATE OR REPLACE FUNCTION flag_unusual_submissions()
RETURNS TRIGGER AS $$
BEGIN
  -- Flag if wait time is unusually long
  IF NEW.wait_weeks > 120 THEN
    NEW.flagged_for_review := TRUE;
  END IF;
  
  -- Flag if NHS wait is less than 1 week
  IF NEW.wait_weeks < 1 AND NEW.nhs_or_private = 'nhs' THEN
    NEW.flagged_for_review := TRUE;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-flag on insert
CREATE TRIGGER flag_unusual_submissions_trigger
  BEFORE INSERT ON patient_submissions
  FOR EACH ROW
  EXECUTE FUNCTION flag_unusual_submissions();

