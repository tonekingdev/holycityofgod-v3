-- Creating a simplified calendars table without foreign key constraints
-- MySQL script to create calendars table for church calendar system
-- This version has NO foreign key constraints to avoid errno 150 errors

DROP TABLE IF EXISTS calendars;

CREATE TABLE calendars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    calendar_type_id INT NOT NULL,
    
    -- Ownership (one of these will be set based on calendar type)
    owner_church_id INT NULL,
    owner_user_id INT NULL,
    owner_ministry_id INT NULL,
    
    -- Calendar settings
    color VARCHAR(7) DEFAULT '#3B82F6',
    is_public BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Approval workflow
    approval_status VARCHAR(20) DEFAULT 'draft',
    approved_by INT NULL,
    approved_at DATETIME NULL,
    rejection_reason TEXT NULL,
    
    -- Sync settings for external calendars
    sync_enabled BOOLEAN DEFAULT FALSE,
    external_calendar_id VARCHAR(255) NULL,
    sync_provider VARCHAR(20) NULL,
    last_sync_at DATETIME NULL,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add basic indexes only (no foreign key constraints)
CREATE INDEX idx_calendars_type ON calendars(calendar_type_id);
CREATE INDEX idx_calendars_owner_church ON calendars(owner_church_id);
CREATE INDEX idx_calendars_owner_user ON calendars(owner_user_id);
CREATE INDEX idx_calendars_owner_ministry ON calendars(owner_ministry_id);
CREATE INDEX idx_calendars_status ON calendars(approval_status);
CREATE INDEX idx_calendars_active ON calendars(is_active);
