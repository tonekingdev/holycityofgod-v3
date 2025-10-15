-- Complete calendar system setup - Run this script AFTER setup-development-database.sql
-- MySQL Database Script for Holy City of God Church Network Calendar System

-- Use the development database
USE holycityofgod_dev;

-- Step 1: Create calendar_types table first (no dependencies)
CREATE TABLE IF NOT EXISTS calendar_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    hierarchy_level INT NOT NULL,
    requires_approval BOOLEAN DEFAULT FALSE,
    approval_roles JSON,
    default_color VARCHAR(7) DEFAULT '#3B82F6',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert calendar types with proper hierarchy
INSERT IGNORE INTO calendar_types (name, description, hierarchy_level, requires_approval, approval_roles, default_color) VALUES
('Main Church Calendar', 'Main church events requiring Bishop and First Lady approval', 1, TRUE, '["bishop", "first_lady"]', '#DC2626'),
('Fellow Church Calendar', 'Individual church calendars with local approval', 2, TRUE, '["pastor"]', '#2563EB'),
('Ministry Calendar', 'Ministry-specific events and activities', 3, TRUE, '["ministry_leader", "pastor"]', '#059669'),
('Personal Calendar', 'Individual user calendars', 4, FALSE, '[]', '#7C3AED');

-- Step 2: Create calendars table (depends on calendar_types)
CREATE TABLE IF NOT EXISTS calendars (
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
    approval_status VARCHAR(20) DEFAULT 'approved',
    approved_by INT NULL,
    approved_at DATETIME NULL,
    rejection_reason TEXT NULL,
    
    -- Sync settings for external calendars
    sync_enabled BOOLEAN DEFAULT FALSE,
    external_calendar_id VARCHAR(255) NULL,
    sync_provider VARCHAR(20) NULL,
    last_sync_at DATETIME NULL,
    
    created_by INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 3: Add foreign key constraints now that all tables exist
ALTER TABLE calendars 
ADD CONSTRAINT fk_calendars_calendar_type 
FOREIGN KEY (calendar_type_id) REFERENCES calendar_types(id) ON DELETE RESTRICT;

ALTER TABLE calendars 
ADD CONSTRAINT fk_calendars_owner_church 
FOREIGN KEY (owner_church_id) REFERENCES churches(id) ON DELETE CASCADE;

ALTER TABLE calendars 
ADD CONSTRAINT fk_calendars_owner_user 
FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE calendars 
ADD CONSTRAINT fk_calendars_owner_ministry 
FOREIGN KEY (owner_ministry_id) REFERENCES ministries(id) ON DELETE CASCADE;

ALTER TABLE calendars 
ADD CONSTRAINT fk_calendars_approved_by 
FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE calendars 
ADD CONSTRAINT fk_calendars_created_by 
FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT;

-- Step 4: Create calendar_permissions table
CREATE TABLE IF NOT EXISTS calendar_permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    calendar_id INT NOT NULL,
    permission_type VARCHAR(20) NOT NULL,
    entity_type VARCHAR(20) NOT NULL,
    entity_id INT,
    church_id INT,
    user_id INT,
    role_id INT,
    can_view BOOLEAN DEFAULT TRUE,
    can_edit BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    can_approve BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (calendar_id) REFERENCES calendars(id) ON DELETE CASCADE,
    FOREIGN KEY (church_id) REFERENCES churches(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 5: Update calendar_events table to link with calendars
ALTER TABLE calendar_events 
ADD COLUMN IF NOT EXISTS calendar_id INT,
ADD COLUMN IF NOT EXISTS approval_status VARCHAR(20) DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS approved_by INT,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP NULL;

-- Add foreign key constraints for calendar_events
ALTER TABLE calendar_events 
ADD CONSTRAINT fk_calendar_events_calendar 
FOREIGN KEY (calendar_id) REFERENCES calendars(id);

ALTER TABLE calendar_events 
ADD CONSTRAINT fk_calendar_events_approved_by 
FOREIGN KEY (approved_by) REFERENCES users(id);

-- Step 6: Add all check constraints
ALTER TABLE calendars 
ADD CONSTRAINT chk_calendars_approval_status 
CHECK (approval_status IN ('draft', 'pending', 'approved', 'rejected'));

ALTER TABLE calendars 
ADD CONSTRAINT chk_calendars_sync_provider 
CHECK (sync_provider IN ('google', 'microsoft', 'apple') OR sync_provider IS NULL);

ALTER TABLE calendars 
ADD CONSTRAINT chk_calendars_single_owner CHECK (
    (owner_church_id IS NOT NULL AND owner_user_id IS NULL AND owner_ministry_id IS NULL) OR
    (owner_church_id IS NULL AND owner_user_id IS NOT NULL AND owner_ministry_id IS NULL) OR
    (owner_church_id IS NULL AND owner_user_id IS NULL AND owner_ministry_id IS NOT NULL)
);

ALTER TABLE calendar_permissions 
ADD CONSTRAINT chk_permissions_type 
CHECK (permission_type IN ('view', 'edit', 'delete', 'approve'));

ALTER TABLE calendar_permissions 
ADD CONSTRAINT chk_permissions_entity_type 
CHECK (entity_type IN ('church', 'user', 'role', 'public'));

ALTER TABLE calendar_events 
ADD CONSTRAINT chk_calendar_events_approval_status 
CHECK (approval_status IN ('draft', 'pending', 'approved', 'rejected'));

-- Step 7: Add indexes for performance
CREATE INDEX idx_calendars_type ON calendars(calendar_type_id);
CREATE INDEX idx_calendars_owner_church ON calendars(owner_church_id);
CREATE INDEX idx_calendars_owner_user ON calendars(owner_user_id);
CREATE INDEX idx_calendars_owner_ministry ON calendars(owner_ministry_id);
CREATE INDEX idx_calendars_status ON calendars(approval_status);
CREATE INDEX idx_calendars_active ON calendars(is_active);
CREATE INDEX idx_calendars_public ON calendars(is_public);

CREATE INDEX idx_calendar_permissions_calendar ON calendar_permissions(calendar_id);
CREATE INDEX idx_calendar_permissions_entity ON calendar_permissions(entity_type, entity_id);

CREATE INDEX idx_calendar_events_calendar ON calendar_events(calendar_id);
CREATE INDEX idx_calendar_events_approval ON calendar_events(approval_status);

-- Step 8: Insert default calendars for each church
INSERT IGNORE INTO calendars (name, description, calendar_type_id, owner_church_id, created_by, is_public, approval_status) 
SELECT 
    CONCAT(c.name, ' - Main Calendar'),
    CONCAT('Main calendar for ', c.name),
    CASE 
        WHEN c.church_type = 'headquarters' THEN 1 
        ELSE 2 
    END,
    c.id,
    COALESCE((SELECT u.id FROM users u WHERE u.primary_church_id = c.id AND u.role_id IN (4, 5) ORDER BY u.role_id LIMIT 1), 1),
    TRUE,
    'approved'
FROM churches c;

-- Step 9: Create default permissions for church calendars
INSERT IGNORE INTO calendar_permissions (calendar_id, permission_type, entity_type, church_id, can_view, can_edit)
SELECT 
    cal.id,
    'edit',
    'church',
    cal.owner_church_id,
    TRUE,
    TRUE
FROM calendars cal 
WHERE cal.owner_church_id IS NOT NULL;

-- Show completion message
SELECT 'Calendar system setup completed successfully!' as message;
SELECT COUNT(*) as calendar_types_created FROM calendar_types;
SELECT COUNT(*) as calendars_created FROM calendars;
SELECT COUNT(*) as permissions_created FROM calendar_permissions;
SELECT 'Run this script AFTER setup-development-database.sql to avoid foreign key errors' as important_note;