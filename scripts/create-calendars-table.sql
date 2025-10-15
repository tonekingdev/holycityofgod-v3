-- MySQL script to create calendars table for church calendar system
-- This table manages different calendars with ownership and approval workflows

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

-- Add foreign key constraints separately to avoid creation issues
ALTER TABLE calendars 
ADD CONSTRAINT fk_calendars_calendar_type 
FOREIGN KEY (calendar_type_id) REFERENCES calendar_types(id) ON DELETE RESTRICT;

-- Add conditional foreign key constraints for owner tables if they exist
-- Note: These will only work if the referenced tables exist
-- ALTER TABLE calendars ADD CONSTRAINT fk_calendars_owner_church FOREIGN KEY (owner_church_id) REFERENCES churches(id) ON DELETE CASCADE;
-- ALTER TABLE calendars ADD CONSTRAINT fk_calendars_owner_user FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE;
-- ALTER TABLE calendars ADD CONSTRAINT fk_calendars_owner_ministry FOREIGN KEY (owner_ministry_id) REFERENCES ministries(id) ON DELETE CASCADE;
-- ALTER TABLE calendars ADD CONSTRAINT fk_calendars_approved_by FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL;

-- Add indexes for performance
CREATE INDEX idx_calendars_type ON calendars(calendar_type_id);
CREATE INDEX idx_calendars_owner_church ON calendars(owner_church_id);
CREATE INDEX idx_calendars_owner_user ON calendars(owner_user_id);
CREATE INDEX idx_calendars_owner_ministry ON calendars(owner_ministry_id);
CREATE INDEX idx_calendars_status ON calendars(approval_status);
CREATE INDEX idx_calendars_active ON calendars(is_active);

-- Add check constraints for approval status and sync provider
ALTER TABLE calendars 
ADD CONSTRAINT chk_approval_status 
CHECK (approval_status IN ('draft', 'pending', 'approved', 'rejected'));

ALTER TABLE calendars 
ADD CONSTRAINT chk_sync_provider 
CHECK (sync_provider IN ('google', 'microsoft', 'apple') OR sync_provider IS NULL);

-- Add constraint to ensure only one owner type is set
ALTER TABLE calendars 
ADD CONSTRAINT chk_single_owner CHECK (
    (owner_church_id IS NOT NULL AND owner_user_id IS NULL AND owner_ministry_id IS NULL) OR
    (owner_church_id IS NULL AND owner_user_id IS NOT NULL AND owner_ministry_id IS NULL) OR
    (owner_church_id IS NULL AND owner_user_id IS NULL AND owner_ministry_id IS NOT NULL)
);