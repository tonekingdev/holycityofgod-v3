-- Removing backticks and using standard SQL syntax to avoid MSSQL linter conflicts
-- MySQL script to update calendar_events table to link with calendars
-- This connects events to specific calendars and adds approval workflow

-- Add calendar_id column to existing calendar_events table
-- Removed AFTER clause to avoid MSSQL linter error
ALTER TABLE calendar_events 
ADD calendar_id INT NULL;

-- Add approval workflow columns
-- Removed AFTER clause and moved CHECK constraint to separate statement
ALTER TABLE calendar_events
ADD approval_status VARCHAR(20) DEFAULT 'draft'; 

ALTER TABLE calendar_events
ADD CONSTRAINT chk_approval_status 
CHECK (approval_status IN ('draft', 'pending', 'approved', 'rejected'));

-- Removed COMMENT clause to avoid MSSQL linter error
ALTER TABLE calendar_events
ADD approved_by INT NULL;

ALTER TABLE calendar_events
ADD approved_at DATETIME NULL;

ALTER TABLE calendar_events
ADD rejection_reason TEXT NULL;

ALTER TABLE calendar_events
ADD requires_approval BOOLEAN DEFAULT TRUE;

-- Add foreign key constraint for calendar_id
ALTER TABLE calendar_events
ADD CONSTRAINT fk_calendar_events_calendar 
FOREIGN KEY (calendar_id) REFERENCES calendars(id) ON DELETE CASCADE;

-- Add foreign key constraint for approved_by
ALTER TABLE calendar_events
ADD CONSTRAINT fk_calendar_events_approved_by 
FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL;

-- Add indexes for performance
CREATE INDEX idx_calendar_events_calendar ON calendar_events(calendar_id);
CREATE INDEX idx_calendar_events_status ON calendar_events(approval_status);
CREATE INDEX idx_calendar_events_approval ON calendar_events(requires_approval);