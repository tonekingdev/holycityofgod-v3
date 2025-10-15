-- Holy City of God Church Network - Multi-Level Calendar System
-- Additional database schema for shared calendar functionality

USE holycityofgod_dev;

-- =============================================
-- CALENDAR SYSTEM TABLES
-- =============================================

-- Calendar types table - Define different calendar levels
CREATE TABLE calendar_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    level ENUM('network', 'church', 'ministry', 'personal') NOT NULL,
    default_visibility ENUM('public', 'members', 'leadership', 'private') DEFAULT 'members',
    can_share_across_churches BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Calendars table - Individual calendar instances
CREATE TABLE calendars (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    calendar_type_id INT NOT NULL,
    owner_church_id INT, -- NULL for network-wide calendars
    owner_user_id INT, -- NULL for church/network calendars
    owner_ministry_id INT, -- NULL for non-ministry calendars
    color_code VARCHAR(7) DEFAULT '#3B82F6', -- Hex color for calendar display
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    settings JSON, -- Calendar-specific settings
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (calendar_type_id) REFERENCES calendar_types(id),
    FOREIGN KEY (owner_church_id) REFERENCES churches(id) ON DELETE CASCADE,
    FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (owner_ministry_id) REFERENCES ministries(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_calendars_church (owner_church_id),
    INDEX idx_calendars_user (owner_user_id),
    INDEX idx_calendars_type (calendar_type_id)
);

-- Enhanced events table (extends existing events table)
-- Add columns to existing events table for calendar system
ALTER TABLE events 
ADD COLUMN calendar_id INT,
ADD COLUMN event_category ENUM('service', 'meeting', 'convention', 'outreach', 'fellowship', 'training', 'conference', 'special') DEFAULT 'meeting',
ADD COLUMN recurrence_pattern JSON, -- For recurring events
ADD COLUMN parent_event_id INT, -- For recurring event instances
ADD COLUMN is_network_event BOOLEAN DEFAULT FALSE,
ADD COLUMN requires_approval BOOLEAN DEFAULT FALSE,
ADD COLUMN approved_by INT,
ADD COLUMN approved_at TIMESTAMP NULL,
ADD COLUMN max_attendees INT,
ADD COLUMN current_attendees INT DEFAULT 0,
ADD COLUMN reminder_settings JSON, -- Email/SMS reminder preferences
ADD COLUMN external_calendar_sync BOOLEAN DEFAULT FALSE,
ADD COLUMN zoom_link VARCHAR(500),
ADD COLUMN meeting_password VARCHAR(100),
ADD COLUMN materials_url VARCHAR(500),
ADD COLUMN livestream_url VARCHAR(500),
ADD FOREIGN KEY (calendar_id) REFERENCES calendars(id) ON DELETE SET NULL,
ADD FOREIGN KEY (parent_event_id) REFERENCES events(id) ON DELETE CASCADE,
ADD FOREIGN KEY (approved_by) REFERENCES users(id),
ADD INDEX idx_events_calendar (calendar_id),
ADD INDEX idx_events_category (event_category),
ADD INDEX idx_events_network (is_network_event),
ADD INDEX idx_events_recurrence (parent_event_id);

-- Calendar permissions table - Cross-church calendar access
CREATE TABLE calendar_permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    calendar_id INT NOT NULL,
    granted_to_church_id INT, -- Church that gets access
    granted_to_user_id INT, -- Individual user that gets access
    granted_to_role_id INT, -- Role that gets access
    permission_type ENUM('view', 'create', 'edit', 'delete', 'admin') NOT NULL,
    granted_by INT NOT NULL,
    expires_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (calendar_id) REFERENCES calendars(id) ON DELETE CASCADE,
    FOREIGN KEY (granted_to_church_id) REFERENCES churches(id) ON DELETE CASCADE,
    FOREIGN KEY (granted_to_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (granted_to_role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (granted_by) REFERENCES users(id),
    INDEX idx_permissions_calendar (calendar_id),
    INDEX idx_permissions_church (granted_to_church_id),
    INDEX idx_permissions_user (granted_to_user_id),
    INDEX idx_permissions_role (granted_to_role_id)
);

-- Event attendees table - Track who's attending events
CREATE TABLE event_attendees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    user_id INT,
    attendee_name VARCHAR(255), -- For non-registered attendees
    attendee_email VARCHAR(255),
    attendee_phone VARCHAR(20),
    church_id INT, -- Which church they're from
    attendance_status ENUM('invited', 'maybe', 'attending', 'not_attending', 'attended', 'no_show') DEFAULT 'invited',
    role_at_event VARCHAR(100), -- 'speaker', 'organizer', 'volunteer', 'attendee'
    special_requirements TEXT,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response_at TIMESTAMP NULL,
    checked_in_at TIMESTAMP NULL,
    notes TEXT,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE SET NULL,
    INDEX idx_attendees_event (event_id),
    INDEX idx_attendees_user (user_id),
    INDEX idx_attendees_church (church_id),
    INDEX idx_attendees_status (attendance_status),
    UNIQUE KEY unique_event_user (event_id, user_id)
);

-- Personal calendar sync table - External calendar integration
CREATE TABLE personal_calendar_sync (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    calendar_provider ENUM('google', 'outlook', 'apple', 'yahoo', 'other') NOT NULL,
    provider_calendar_id VARCHAR(255) NOT NULL,
    calendar_name VARCHAR(255),
    access_token TEXT, -- Encrypted access token
    refresh_token TEXT, -- Encrypted refresh token
    token_expires_at TIMESTAMP,
    sync_direction ENUM('import_only', 'export_only', 'bidirectional') DEFAULT 'import_only',
    sync_frequency ENUM('real_time', 'hourly', 'daily', 'manual') DEFAULT 'daily',
    last_sync_at TIMESTAMP NULL,
    sync_status ENUM('active', 'error', 'paused', 'disconnected') DEFAULT 'active',
    sync_settings JSON, -- What types of events to sync
    error_message TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_sync_user (user_id),
    INDEX idx_sync_provider (calendar_provider),
    INDEX idx_sync_status (sync_status),
    UNIQUE KEY unique_user_provider_calendar (user_id, calendar_provider, provider_calendar_id)
);

-- Personal availability table - Track user availability from synced calendars
CREATE TABLE personal_availability (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    availability_type ENUM('busy', 'free', 'tentative', 'out_of_office') NOT NULL,
    title VARCHAR(255), -- Title of the conflicting event (if busy)
    source ENUM('manual', 'google', 'outlook', 'apple', 'church_event') NOT NULL,
    source_event_id VARCHAR(255), -- ID from external calendar
    is_private BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_availability_user (user_id),
    INDEX idx_availability_date (date),
    INDEX idx_availability_time (start_time, end_time),
    INDEX idx_availability_type (availability_type),
    UNIQUE KEY unique_user_datetime (user_id, date, start_time, end_time, source)
);

-- Calendar sharing sessions table - Track when calendars are shared
CREATE TABLE calendar_sharing_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    calendar_id INT NOT NULL,
    shared_with_church_id INT,
    shared_with_user_id INT,
    session_name VARCHAR(255),
    shared_by INT NOT NULL,
    share_type ENUM('temporary', 'permanent', 'event_specific') DEFAULT 'temporary',
    start_date DATE,
    end_date DATE,
    permissions JSON, -- What permissions are granted
    access_count INT DEFAULT 0,
    last_accessed_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (calendar_id) REFERENCES calendars(id) ON DELETE CASCADE,
    FOREIGN KEY (shared_with_church_id) REFERENCES churches(id) ON DELETE CASCADE,
    FOREIGN KEY (shared_with_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (shared_by) REFERENCES users(id),
    INDEX idx_sharing_calendar (calendar_id),
    INDEX idx_sharing_church (shared_with_church_id),
    INDEX idx_sharing_user (shared_with_user_id),
    INDEX idx_sharing_dates (start_date, end_date)
);

-- Event conflicts table - Track scheduling conflicts
CREATE TABLE event_conflicts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    conflicting_event_id INT,
    user_id INT, -- User who has the conflict
    conflict_type ENUM('time_overlap', 'resource_conflict', 'person_conflict', 'location_conflict') NOT NULL,
    conflict_severity ENUM('minor', 'major', 'critical') DEFAULT 'minor',
    description TEXT,
    resolution_status ENUM('unresolved', 'acknowledged', 'resolved', 'ignored') DEFAULT 'unresolved',
    resolved_by INT,
    resolved_at TIMESTAMP NULL,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (conflicting_event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resolved_by) REFERENCES users(id),
    INDEX idx_conflicts_event (event_id),
    INDEX idx_conflicts_user (user_id),
    INDEX idx_conflicts_status (resolution_status),
    INDEX idx_conflicts_severity (conflict_severity)
);

-- =============================================
-- SEED DATA FOR CALENDAR SYSTEM
-- =============================================

-- Insert calendar types
INSERT INTO calendar_types (name, description, level, default_visibility, can_share_across_churches) VALUES
('Network Fellowship Calendar', 'Network-wide events and fellowship activities', 'network', 'public', TRUE),
('Church Main Calendar', 'Primary church calendar for services and events', 'church', 'public', TRUE),
('Leadership Calendar', 'Leadership meetings and administrative events', 'church', 'leadership', TRUE),
('Ministry Calendar', 'Ministry-specific events and activities', 'ministry', 'members', TRUE),
('Personal Ministry Calendar', 'Individual ministry leader calendars', 'personal', 'private', FALSE),
('Pastor Calendar', 'Pastor\'s personal ministry calendar', 'personal', 'leadership', TRUE);

-- Insert network-wide calendar
INSERT INTO calendars (name, description, calendar_type_id, owner_church_id, color_code, is_default, created_by) VALUES
('Holy City of God Network Calendar', 'Fellowship-wide events, conventions, and collaborative activities', 1, NULL, '#8B5CF6', TRUE, 4);

-- Insert church calendars for each campus
INSERT INTO calendars (name, description, calendar_type_id, owner_church_id, color_code, created_by) VALUES
('Main Campus Calendar', 'Main campus services, events, and activities', 2, 1, '#3B82F6', 6),
('North Campus Calendar', 'North campus services, events, and activities', 2, 2, '#10B981', 7),
('South Campus Calendar', 'South campus services, events, and activities', 2, 3, '#F59E0B', 8),
('East Campus Calendar', 'East campus services, events, and activities', 2, 4, '#EF4444', 9),
('West Campus Calendar', 'West campus services, events, and activities', 2, 5, '#8B5CF6', 10);

-- Insert leadership calendars
INSERT INTO calendars (name, description, calendar_type_id, owner_church_id, color_code, created_by) VALUES
('Network Leadership Calendar', 'Network leadership meetings and planning sessions', 3, NULL, '#DC2626', 4),
('Main Campus Leadership', 'Main campus leadership and administrative meetings', 3, 1, '#1E40AF', 6),
('North Campus Leadership', 'North campus leadership and administrative meetings', 3, 2, '#047857', 7),
('South Campus Leadership', 'South campus leadership and administrative meetings', 3, 3, '#D97706', 8),
('East Campus Leadership', 'East campus leadership and administrative meetings', 3, 4, '#B91C1C', 9),
('West Campus Leadership', 'West campus leadership and administrative meetings', 3, 5, '#7C3AED', 10);

-- Insert personal calendars for key leadership
INSERT INTO calendars (name, description, calendar_type_id, owner_user_id, color_code, created_by) VALUES
('First Lady Cliffondra King', 'First Lady\'s ministry and network activities', 6, 3, '#EC4899', 3),
('Bishop Anthony King', 'Bishop\'s ministry and oversight activities', 6, 5, '#7C2D12', 5);

-- Grant network-wide calendar permissions to all churches
INSERT INTO calendar_permissions (calendar_id, granted_to_church_id, permission_type, granted_by) VALUES
(1, 1, 'view', 4), -- Main campus can view network calendar
(1, 2, 'view', 4), -- North campus can view network calendar
(1, 3, 'view', 4), -- South campus can view network calendar
(1, 4, 'view', 4), -- East campus can view network calendar
(1, 5, 'view', 4); -- West campus can view network calendar

-- Grant leadership calendar permissions
INSERT INTO calendar_permissions (calendar_id, granted_to_role_id, permission_type, granted_by) VALUES
(7, 3, 'view', 4), -- First Lady can view network leadership calendar
(7, 4, 'view', 4), -- Bishops can view network leadership calendar
(7, 5, 'view', 4); -- Pastors can view network leadership calendar

-- Update existing events to use calendar system
UPDATE events SET 
    calendar_id = CASE 
        WHEN church_id = 1 THEN 2  -- Main campus events
        WHEN church_id = 2 THEN 3  -- North campus events
        WHEN church_id = 3 THEN 4  -- South campus events
        WHEN church_id = 4 THEN 5  -- East campus events
        WHEN church_id = 5 THEN 6  -- West campus events
        WHEN church_id IS NULL THEN 1  -- Network events
        ELSE 1
    END,
    event_category = CASE 
        WHEN title LIKE '%Worship%' OR title LIKE '%Service%' THEN 'service'
        WHEN title LIKE '%Conference%' OR title LIKE '%Convention%' THEN 'convention'
        WHEN title LIKE '%Meeting%' THEN 'meeting'
        WHEN title LIKE '%Bible Study%' THEN 'training'
        ELSE 'meeting'
    END,
    is_network_event = CASE WHEN church_id IS NULL THEN TRUE ELSE FALSE END;

-- Insert sample network events
INSERT INTO events (calendar_id, church_id, title, description, event_date, start_time, end_time, location, event_type, event_category, is_network_event, visibility, created_by) VALUES
(1, NULL, 'Annual Network Convention 2024', 'Annual gathering of all Holy City of God churches for worship, fellowship, and ministry training.', '2024-06-15', '09:00:00', '17:00:00', 'Main Campus - Atlanta, GA', 'convention', 'convention', TRUE, 'public', 4),
(1, NULL, 'Network Leadership Retreat', 'Quarterly leadership retreat for pastors, ministers, and church leaders across the network.', '2024-04-20', '10:00:00', '15:00:00', 'Conference Center - Marietta, GA', 'retreat', 'training', TRUE, 'leadership', 4),
(1, NULL, 'Network Prayer & Fasting Week', 'Week-long prayer and fasting initiative across all network churches.', '2024-03-10', '06:00:00', '21:00:00', 'All Campuses', 'special', 'special', TRUE, 'public', 5);

-- Insert sample cross-church sharing permissions
INSERT INTO calendar_permissions (calendar_id, granted_to_church_id, permission_type, granted_by) VALUES
-- Main campus shares with North campus
(2, 2, 'view', 6),
-- North campus shares with Main campus  
(3, 1, 'view', 7),
-- Leadership calendars shared across campuses
(8, 2, 'view', 6), -- Main leadership shared with North
(8, 3, 'view', 6), -- Main leadership shared with South
(9, 1, 'view', 7), -- North leadership shared with Main
(9, 3, 'view', 7); -- North leadership shared with South

-- Show completion message
SELECT 'Multi-level calendar system schema created successfully!' as message;
SELECT COUNT(*) as total_calendar_types FROM calendar_types;
SELECT COUNT(*) as total_calendars FROM calendars;
SELECT COUNT(*) as total_calendar_permissions FROM calendar_permissions;
SELECT 'Network calendar supports cross-church sharing and personal sync' as features;
SELECT 'Events table enhanced with calendar system integration' as enhancement;