-- MySQL Database Script
-- Holy City of God Church Network - Development Database Setup
-- This script creates the complete database structure for development environment

-- Added MySQL-specific comment to help VS Code recognize the database type
-- Drop and create database
DROP DATABASE IF EXISTS holycityofgod_dev;
CREATE DATABASE holycityofgod_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE holycityofgod_dev;

-- =============================================
-- CORE TABLES
-- =============================================

-- Churches table - Network of churches
CREATE TABLE churches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    pastor_name VARCHAR(255),
    established_date DATE,
    parent_church_id INT,
    church_type ENUM('headquarters', 'affiliate', 'branch', 'mission') DEFAULT 'affiliate',
    is_active BOOLEAN DEFAULT TRUE,
    settings JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_church_id) REFERENCES churches(id)
);

-- Roles table - System access roles
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Positions table - Church hierarchy positions
CREATE TABLE positions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    hierarchy_level INT NOT NULL,
    permissions JSON,
    is_leadership BOOLEAN DEFAULT FALSE,
    is_clergy BOOLEAN DEFAULT FALSE,
    can_upload_word BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users table - Network users with church and position assignments
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    marital_status ENUM('single', 'married', 'divorced', 'widowed'),
    primary_church_id INT NOT NULL,
    accessible_churches JSON,
    position_id INT,
    role_id INT NOT NULL,
    hire_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    profile_image VARCHAR(255),
    bio TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (primary_church_id) REFERENCES churches(id),
    FOREIGN KEY (position_id) REFERENCES positions(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- User positions table (many-to-many relationship)
CREATE TABLE user_positions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    position_id INT NOT NULL,
    church_id INT,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE CASCADE,
    FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_position_church (user_id, position_id, church_id)
);

-- =============================================
-- CMS TABLES
-- =============================================

-- Content types table
CREATE TABLE content_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    schema_definition JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- CMS content table
CREATE TABLE cms_content (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    content LONGTEXT,
    content_type VARCHAR(50) NOT NULL,
    church_id INT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NOT NULL,
    updated_by INT NOT NULL,
    metadata JSON,
    FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_slug (slug),
    INDEX idx_content_type (content_type),
    INDEX idx_church_id (church_id),
    INDEX idx_published_at (published_at),
    UNIQUE KEY unique_slug_church (slug, church_id)
);

-- Media library table
CREATE TABLE media_library (
    id INT PRIMARY KEY AUTO_INCREMENT,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    alt_text TEXT,
    caption TEXT,
    church_id INT NULL,
    uploaded_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_church_media (church_id),
    INDEX idx_mime_type (mime_type)
);

-- =============================================
-- CHURCH CONTENT TABLES
-- =============================================

-- Posts table - Blog posts and announcements
CREATE TABLE posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    church_id INT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image VARCHAR(255),
    author_id INT NOT NULL,
    category VARCHAR(100),
    tags JSON,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    visibility ENUM('public', 'members', 'leadership') DEFAULT 'public',
    is_featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (church_id) REFERENCES churches(id),
    FOREIGN KEY (author_id) REFERENCES users(id),
    UNIQUE KEY unique_church_slug (church_id, slug)
);

-- Announcements table - Church announcements and notices
CREATE TABLE announcements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    church_id INT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    announcement_type ENUM('general', 'urgent', 'event', 'service_change', 'ministry') DEFAULT 'general',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    target_audience ENUM('all', 'members', 'leadership', 'visitors', 'youth', 'children') DEFAULT 'all',
    display_location JSON, -- ['homepage', 'bulletin', 'email', 'social']
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    featured_image VARCHAR(255),
    contact_person VARCHAR(255),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (church_id) REFERENCES churches(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_announcements_church (church_id),
    INDEX idx_announcements_dates (start_date, end_date),
    INDEX idx_announcements_priority (priority),
    INDEX idx_announcements_active (is_active)
);

-- Prayers table - Prayer requests and testimonies
CREATE TABLE prayers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    church_id INT,
    requester_id INT,
    requester_name VARCHAR(255),
    requester_email VARCHAR(255),
    requester_phone VARCHAR(20),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    prayer_type ENUM('request', 'praise', 'testimony', 'intercession') DEFAULT 'request',
    category VARCHAR(100), -- 'healing', 'family', 'finances', 'guidance', 'salvation', etc.
    urgency ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    is_confidential BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'answered', 'ongoing', 'archived') DEFAULT 'active',
    answered_description TEXT,
    answered_at TIMESTAMP NULL,
    answered_by INT,
    follow_up_needed BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    assigned_to INT, -- Pastor or prayer team member
    prayer_count INT DEFAULT 0, -- Number of people who prayed
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (church_id) REFERENCES churches(id),
    FOREIGN KEY (requester_id) REFERENCES users(id),
    FOREIGN KEY (answered_by) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    INDEX idx_prayers_church (church_id),
    INDEX idx_prayers_status (status),
    INDEX idx_prayers_type (prayer_type),
    INDEX idx_prayers_public (is_public),
    INDEX idx_prayers_urgency (urgency)
);

-- Bible verses table
CREATE TABLE bible_verses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    church_id INT,
    verse TEXT NOT NULL,
    reference VARCHAR(100) NOT NULL,
    book VARCHAR(50),
    chapter INT,
    verse_start INT,
    verse_end INT,
    category VARCHAR(100),
    tags JSON,
    is_featured BOOLEAN DEFAULT FALSE,
    is_daily_verse BOOLEAN DEFAULT FALSE,
    date_featured DATE,
    added_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (church_id) REFERENCES churches(id),
    FOREIGN KEY (added_by) REFERENCES users(id)
);

-- Events table
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    church_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location VARCHAR(255),
    address TEXT,
    event_type VARCHAR(100),
    capacity INT,
    registration_required BOOLEAN DEFAULT FALSE,
    registration_deadline DATE,
    cost DECIMAL(10,2) DEFAULT 0.00,
    contact_person VARCHAR(255),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    featured_image VARCHAR(255),
    status ENUM('draft', 'published', 'cancelled') DEFAULT 'published',
    visibility ENUM('public', 'members', 'leadership') DEFAULT 'public',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (church_id) REFERENCES churches(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Donations table
CREATE TABLE donations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    church_id INT NOT NULL,
    donor_id INT,
    donor_name VARCHAR(255),
    donor_email VARCHAR(255),
    donor_phone VARCHAR(20),
    amount DECIMAL(10,2) NOT NULL,
    donation_type ENUM('tithe', 'offering', 'special', 'building_fund', 'missions') DEFAULT 'offering',
    payment_method ENUM('cash', 'check', 'credit_card', 'bank_transfer', 'online') DEFAULT 'online',
    transaction_id VARCHAR(255),
    reference_number VARCHAR(100),
    notes TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_frequency ENUM('weekly', 'monthly', 'quarterly', 'annually'),
    is_anonymous BOOLEAN DEFAULT FALSE,
    tax_deductible BOOLEAN DEFAULT TRUE,
    receipt_sent BOOLEAN DEFAULT FALSE,
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (church_id) REFERENCES churches(id),
    FOREIGN KEY (donor_id) REFERENCES users(id)
);

-- Word table (formerly sermons) - Messages from ministers, pastors, and bishops
CREATE TABLE word (
    id INT PRIMARY KEY AUTO_INCREMENT,
    church_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    speaker_id INT NOT NULL,
    speaker_name VARCHAR(255) NOT NULL,
    speaker_title VARCHAR(100), -- 'Pastor', 'Bishop', 'Minister', 'Elder', etc.
    word_date DATE NOT NULL,
    service_type VARCHAR(100), -- 'Sunday Morning', 'Sunday Evening', 'Wednesday', 'Special Service'
    series_name VARCHAR(255),
    series_part INT,
    scripture_reference VARCHAR(255),
    key_points JSON, -- Array of main points from the message
    audio_url VARCHAR(500),
    video_url VARCHAR(500),
    slides_url VARCHAR(500), -- PowerPoint or presentation slides
    notes_url VARCHAR(500), -- Speaker notes or outline
    transcript TEXT,
    summary TEXT,
    tags JSON,
    duration INT, -- Duration in minutes
    is_featured BOOLEAN DEFAULT FALSE,
    is_live BOOLEAN DEFAULT FALSE, -- Currently being shared during live service
    live_shared_at TIMESTAMP NULL,
    download_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    share_count INT DEFAULT 0,
    status ENUM('draft', 'published', 'archived', 'live') DEFAULT 'draft',
    visibility ENUM('public', 'members', 'leadership') DEFAULT 'public',
    created_by INT NOT NULL,
    approved_by INT, -- For approval workflow
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (church_id) REFERENCES churches(id),
    FOREIGN KEY (speaker_id) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    INDEX idx_word_church (church_id),
    INDEX idx_word_speaker (speaker_id),
    INDEX idx_word_date (word_date),
    INDEX idx_word_featured (is_featured),
    INDEX idx_word_live (is_live),
    INDEX idx_word_status (status)
);

-- Word sharing sessions - Track when Word is shared during services
CREATE TABLE word_sharing_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    word_id INT NOT NULL,
    church_id INT NOT NULL,
    session_name VARCHAR(255), -- 'Sunday Morning Service', 'Wednesday Bible Study', etc.
    shared_by INT NOT NULL,
    shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_start_time TIMESTAMP NULL,
    session_end_time TIMESTAMP NULL,
    attendee_count INT DEFAULT 0,
    notes TEXT,
    feedback JSON, -- Collect feedback from attendees
    is_recorded BOOLEAN DEFAULT FALSE,
    recording_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (word_id) REFERENCES word(id) ON DELETE CASCADE,
    FOREIGN KEY (church_id) REFERENCES churches(id),
    FOREIGN KEY (shared_by) REFERENCES users(id),
    INDEX idx_sharing_word (word_id),
    INDEX idx_sharing_church (church_id),
    INDEX idx_sharing_date (shared_at)
);

-- Word interactions - Track user engagement with Word content
CREATE TABLE word_interactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    word_id INT NOT NULL,
    user_id INT,
    interaction_type ENUM('view', 'like', 'share', 'download', 'comment', 'bookmark') NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (word_id) REFERENCES word(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_interactions_word (word_id),
    INDEX idx_interactions_user (user_id),
    INDEX idx_interactions_type (interaction_type)
);

-- Word comments - Allow comments on Word messages
CREATE TABLE word_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    word_id INT NOT NULL,
    user_id INT,
    commenter_name VARCHAR(255),
    commenter_email VARCHAR(255),
    comment TEXT NOT NULL,
    parent_comment_id INT, -- For threaded comments
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by INT,
    approved_at TIMESTAMP NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (word_id) REFERENCES word(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (parent_comment_id) REFERENCES word_comments(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id),
    INDEX idx_comments_word (word_id),
    INDEX idx_comments_user (user_id),
    INDEX idx_comments_approved (is_approved)
);

-- Ministries table
CREATE TABLE ministries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    church_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    leader_id INT,
    meeting_day VARCHAR(20),
    meeting_time TIME,
    meeting_location VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    age_group VARCHAR(100),
    ministry_type VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (church_id) REFERENCES churches(id),
    FOREIGN KEY (leader_id) REFERENCES users(id)
);

-- Attendance table
CREATE TABLE attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    church_id INT NOT NULL,
    service_date DATE NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    adult_count INT DEFAULT 0,
    youth_count INT DEFAULT 0,
    children_count INT DEFAULT 0,
    visitor_count INT DEFAULT 0,
    total_count INT GENERATED ALWAYS AS (adult_count + youth_count + children_count + visitor_count) STORED,
    notes TEXT,
    recorded_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (church_id) REFERENCES churches(id),
    FOREIGN KEY (recorded_by) REFERENCES users(id),
    UNIQUE KEY unique_church_service (church_id, service_date, service_type)
);

-- Audit logs table
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    church_id INT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (church_id) REFERENCES churches(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Users indexes
CREATE INDEX idx_users_church ON users(primary_church_id);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_position ON users(position_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);

-- Posts indexes
CREATE INDEX idx_posts_church ON posts(church_id);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published ON posts(published_at);

-- Events indexes
CREATE INDEX idx_events_church ON events(church_id);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status);

-- Donations indexes
CREATE INDEX idx_donations_church ON donations(church_id);
CREATE INDEX idx_donations_donor ON donations(donor_id);
CREATE INDEX idx_donations_date ON donations(created_at);
CREATE INDEX idx_donations_status ON donations(status);

-- Bible verses indexes
CREATE INDEX idx_bible_verses_church ON bible_verses(church_id);
CREATE INDEX idx_bible_verses_featured ON bible_verses(is_featured);
CREATE INDEX idx_bible_verses_daily ON bible_verses(is_daily_verse);

-- Attendance indexes
CREATE INDEX idx_attendance_church ON attendance(church_id);
CREATE INDEX idx_attendance_date ON attendance(service_date);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_church ON audit_logs(church_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_date ON audit_logs(created_at);

-- =============================================
-- SEED DATA FOR DEVELOPMENT
-- =============================================

-- Insert roles
INSERT INTO roles (name, description, permissions) VALUES
('super_admin', 'Super Administrator - Full System Access', '["all"]'),
('network_admin', 'Network Administrator', '["network_admin", "church_admin", "content_manage", "user_manage", "word_upload", "word_approve"]'),
('first_lady', 'First Lady - Network Administrator', '["network_admin", "church_admin", "content_manage", "user_manage", "word_upload"]'),
('bishop', 'Bishop - Highest church authority', '["church_admin", "content_manage", "user_manage", "word_upload", "word_approve"]'),
('pastor', 'Church Pastor', '["church_admin", "content_manage", "user_manage", "word_upload"]'),
('minister', 'Church Minister', '["content_manage", "member_view", "word_upload"]'),
('elder', 'Church Elder', '["content_manage", "member_view"]'),
('deacon', 'Church Deacon', '["member_view", "prayer_manage"]'),
('leader', 'Ministry Leader', '["content_view", "member_view"]'),
('member', 'Church Member', '["content_view", "profile_edit"]');

-- Insert positions with Word upload permissions
INSERT INTO positions (name, description, hierarchy_level, is_leadership, is_clergy, can_upload_word) VALUES
('First Lady', 'First Lady of the Church Network', 1, TRUE, FALSE, TRUE),
('Bishop', 'Bishop - Oversees multiple churches', 2, TRUE, TRUE, TRUE),
('Pastor', 'Lead Pastor of the church', 3, TRUE, TRUE, TRUE),
('Associate Pastor', 'Assistant to the Lead Pastor', 4, TRUE, TRUE, TRUE),
('Minister', 'Licensed Minister', 5, TRUE, TRUE, TRUE),
('Elder', 'Church Elder', 6, TRUE, FALSE, FALSE),
('Deacon', 'Church Deacon', 7, TRUE, FALSE, FALSE),
('Worship Leader', 'Leads worship services', 8, TRUE, FALSE, FALSE),
('Youth Pastor', 'Leads youth ministry', 9, TRUE, TRUE, TRUE),
('Children Director', 'Oversees children ministry', 10, TRUE, FALSE, FALSE),
('Administrator', 'Church Administrator', 11, FALSE, FALSE, FALSE),
('Treasurer', 'Church Treasurer', 12, TRUE, FALSE, FALSE),
('Secretary', 'Church Secretary', 13, FALSE, FALSE, FALSE);

-- Insert sample churches
INSERT INTO churches (name, code, address, city, state, zip_code, phone, email, pastor_name, church_type) VALUES
('Holy City of God - Main Campus', 'HCOG-MAIN', '123 Faith Street', 'Atlanta', 'GA', '30309', '(404) 555-0100', 'main@holycityofgod.org', 'Bishop Anthony King', 'headquarters'),
('Holy City of God - North Campus', 'HCOG-NORTH', '456 Hope Avenue', 'Marietta', 'GA', '30060', '(770) 555-0200', 'north@holycityofgod.org', 'Pastor Mary Johnson', 'affiliate'),
('Holy City of God - South Campus', 'HCOG-SOUTH', '789 Grace Boulevard', 'College Park', 'GA', '30337', '(404) 555-0300', 'south@holycityofgod.org', 'Pastor David Williams', 'affiliate'),
('Holy City of God - East Campus', 'HCOG-EAST', '321 Love Lane', 'Decatur', 'GA', '30030', '(404) 555-0400', 'east@holycityofgod.org', 'Pastor Sarah Davis', 'affiliate'),
('Holy City of God - West Campus', 'HCOG-WEST', '654 Peace Drive', 'Smyrna', 'GA', '30080', '(770) 555-0500', 'west@holycityofgod.org', 'Pastor Michael Brown', 'affiliate');

-- Insert super admins and network leadership (password: admin123 - hashed with bcrypt)
INSERT INTO users (username, email, password_hash, first_name, last_name, primary_church_id, role_id, position_id) VALUES
-- Super Admins (Tone King Development)
('tking', 'tone@tonekingdev.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.hl.vHm', 'Tone', 'King', 1, 1, NULL),
('krisk', 'krisk@tonekingdev.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.hl.vHm', 'Krissie', 'Knight', 1, 1, NULL),

-- Network Leadership
('cking', 'cking@holycityofgod.org', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.hl.vHm', 'Cliffondra', 'King', 1, 3, 1),
('admin', 'admin@holycityofgod.org', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.hl.vHm', 'Network', 'Administrator', 1, 2, NULL),
('bishop.king', 'pastor@holycityofgod.org', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.hl.vHm', 'Anthony', 'King', 1, 4, 2),

-- Church Pastors
('pastor.main', 'pastor.main@holycityofgod.org', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.hl.vHm', 'John', 'Smith', 1, 5, 3),
('pastor.north', 'pastor.north@holycityofgod.org', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.hl.vHm', 'Mary', 'Johnson', 2, 5, 3),
('pastor.south', 'pastor.south@holycityofgod.org', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.hl.vHm', 'David', 'Williams', 3, 5, 3),
('pastor.east', 'pastor.east@holycityofgod.org', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.hl.vHm', 'Sarah', 'Davis', 4, 5, 3),
('pastor.west', 'pastor.west@holycityofgod.org', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.hl.vHm', 'Michael', 'Brown', 5, 5, 3),

-- Ministers
('minister.jones', 'minister.jones@holycityofgod.org', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.hl.vHm', 'Robert', 'Jones', 1, 6, 5);

-- Assign positions to users
INSERT INTO user_positions (user_id, position_id, church_id, start_date) VALUES
(3, 1, 1, '2020-01-01'), -- Cliffondra King - First Lady
(5, 2, 1, '2020-01-01'), -- Bishop King
(6, 3, 1, '2020-01-01'), -- Pastor Smith - Main
(7, 3, 2, '2020-01-01'), -- Pastor Johnson - North
(8, 3, 3, '2020-01-01'), -- Pastor Williams - South
(9, 3, 4, '2020-01-01'), -- Pastor Davis - East
(10, 3, 5, '2020-01-01'), -- Pastor Brown - West
(11, 5, 1, '2021-01-01'); -- Minister Jones

-- Insert content types
INSERT INTO content_types (name, description, schema_definition) VALUES
('page', 'Static page content', '{"title": "string", "content": "html"}'),
('hero', 'Hero section for homepage', '{"title": "string", "subtitle": "string", "content": "html", "image": "url", "cta_text": "string", "cta_link": "url"}'),
('announcement', 'Church announcements', '{"title": "string", "content": "html", "priority": "number", "expires_at": "datetime"}'),
('event', 'Church events', '{"title": "string", "content": "html", "event_date": "datetime", "location": "string", "contact": "string"}'),
('text-block', 'Reusable text blocks', '{"title": "string", "content": "html", "position": "string"}'),
('word', 'Word/Message content', '{"title": "string", "content": "html", "scripture": "string", "audio_url": "url", "video_url": "url", "date": "date"}');

-- Insert sample network-wide content
INSERT INTO cms_content (title, slug, content, content_type, church_id, created_by, updated_by, published_at) VALUES
('Welcome to Holy City of God Network', 'homepage-hero', 
'<h1>Welcome to the Holy City of God Network</h1>
<p>A network of churches dedicated to spreading God''s love and building strong communities of faith.</p>
<p>Join us as we worship together, grow in faith, and serve our communities with the love of Christ.</p>', 
'hero', NULL, 4, 4, NOW()),

('About Our Network', 'about-network',
'<h2>Our Mission</h2>
<p>The Holy City of God Network is committed to spreading the Gospel of Jesus Christ and building strong, vibrant church communities throughout Georgia and beyond.</p>
<h2>Our Vision</h2>
<p>To see lives transformed by the power of God''s love, creating disciples who make disciples in every community we serve.</p>
<h2>Our Values</h2>
<ul>
<li><strong>Faith:</strong> We believe in the transforming power of Jesus Christ</li>
<li><strong>Community:</strong> We are stronger together than apart</li>
<li><strong>Service:</strong> We serve others as Christ served us</li>
<li><strong>Growth:</strong> We are committed to continuous spiritual growth</li>
<li><strong>Love:</strong> Love is at the center of everything we do</li>
</ul>',
'page', NULL, 4, 4, NOW());

-- Insert sample church-specific content for Main Campus
INSERT INTO cms_content (title, slug, content, content_type, church_id, created_by, updated_by, published_at) VALUES
('Main Campus Welcome', 'main-campus-hero',
'<h1>Welcome to Holy City of God - Main Campus</h1>
<p>Located in the heart of Atlanta, we are a vibrant community of believers committed to worship, fellowship, and service.</p>
<p>Join us every Sunday at 9:00 AM and 11:00 AM for inspiring worship services.</p>',
'hero', 1, 6, 6, NOW()),

('Sunday Service Times', 'sunday-services',
'<h2>Sunday Worship Services</h2>
<ul>
<li><strong>First Service:</strong> 9:00 AM</li>
<li><strong>Sunday School:</strong> 10:00 AM</li>
<li><strong>Second Service:</strong> 11:00 AM</li>
</ul>
<h2>Midweek Services</h2>
<ul>
<li><strong>Wednesday Bible Study:</strong> 7:00 PM</li>
<li><strong>Friday Youth Service:</strong> 7:30 PM</li>
</ul>',
'page', 1, 6, 6, NOW());

-- Insert sample Bible verses (KJV)
INSERT INTO bible_verses (church_id, verse, reference, book, chapter, verse_start, is_featured, added_by) VALUES
(NULL, 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.', 'John 3:16', 'John', 3, 16, TRUE, 4),
(NULL, 'Trust in the Lord with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.', 'Proverbs 3:5-6', 'Proverbs', 3, 5, TRUE, 4),
(NULL, 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.', 'Romans 8:28', 'Romans', 8, 28, FALSE, 4),
(NULL, 'I can do all things through Christ which strengtheneth me.', 'Philippians 4:13', 'Philippians', 4, 13, TRUE, 4),
(NULL, 'The Lord is my shepherd; I shall not want.', 'Psalm 23:1', 'Psalm', 23, 1, TRUE, 4),
(NULL, 'Be strong and of a good courage; be not afraid, neither be thou dismayed: for the Lord thy God is with thee whithersoever thou goest.', 'Joshua 1:9', 'Joshua', 1, 9, FALSE, 4),
(NULL, 'But they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.', 'Isaiah 40:31', 'Isaiah', 40, 31, TRUE, 4),
(NULL, 'For I know the thoughts that I think toward you, saith the Lord, thoughts of peace, and not of evil, to give you an expected end.', 'Jeremiah 29:11', 'Jeremiah', 29, 11, FALSE, 4),
(NULL, 'Delight thyself also in the Lord: and he shall give thee the desires of thine heart.', 'Psalm 37:4', 'Psalm', 37, 4, FALSE, 4),
(NULL, 'And it shall come to pass, that before they call, I will answer; and while they are yet speaking, I will hear.', 'Isaiah 65:24', 'Isaiah', 65, 24, FALSE, 4);

-- Insert sample events
INSERT INTO events (church_id, title, description, event_date, start_time, location, created_by) VALUES
(1, 'Sunday Worship Service', 'Join us for our weekly worship service with inspiring music and biblical teaching.', '2024-02-25', '11:00:00', 'Main Sanctuary', 6),
(1, 'Wednesday Bible Study', 'Dive deeper into God''s Word with our midweek Bible study.', '2024-02-28', '19:00:00', 'Fellowship Hall', 6),
(NULL, 'Network Conference 2024', 'Annual conference bringing together all churches in our network.', '2024-03-15', '09:00:00', 'Main Campus', 4);

-- Insert sample announcements
INSERT INTO announcements (church_id, title, content, announcement_type, priority, target_audience, start_date, end_date, created_by) VALUES
(1, 'New Member Orientation', 'Join us for our monthly new member orientation class. Learn about our church history, beliefs, and how to get involved in ministry.', 'general', 'medium', 'all', '2024-02-01', '2024-02-29', 6),
(NULL, 'Network Prayer Week', 'Join churches across our network for a week of focused prayer and fasting. Special prayer services will be held each evening.', 'event', 'high', 'all', '2024-03-01', '2024-03-07', 5),
(1, 'Youth Ministry Fundraiser', 'Support our youth ministry by purchasing tickets for our upcoming car wash fundraiser. All proceeds go toward summer camp scholarships.', 'ministry', 'medium', 'all', '2024-02-15', '2024-03-15', 6);

-- Insert sample prayers
INSERT INTO prayers (church_id, requester_name, title, description, prayer_type, category, urgency, is_public, requester_id) VALUES
(1, 'Anonymous', 'Healing for Family Member', 'Please pray for healing and comfort for my family member who is going through a difficult health challenge. The doctors are doing all they can, but we know God is the ultimate healer.', 'request', 'healing', 'high', TRUE, NULL),
(1, 'John Doe', 'Job Search Guidance', 'Seeking God''s guidance and provision as I search for new employment opportunities. Pray for open doors and wisdom in decision making.', 'request', 'career', 'medium', TRUE, NULL),
(1, 'Mary Smith', 'Praise for Answered Prayer', 'Giving thanks to God for answering our prayers regarding my son''s college acceptance. He was accepted to his first choice school with a scholarship!', 'praise', 'family', 'low', TRUE, NULL),
(NULL, 'First Lady King', 'Network Unity', 'Praying for continued unity and growth across all churches in our network. May we work together effectively to advance God''s kingdom.', 'intercession', 'church', 'medium', TRUE, 3);

-- Insert sample Word messages
INSERT INTO word (church_id, title, description, speaker_id, speaker_name, speaker_title, word_date, service_type, scripture_reference, key_points, status, created_by) VALUES
(1, 'Walking by Faith', 'A powerful message about trusting God even when we cannot see the path ahead. Learn how to walk by faith and not by sight in the KJV tradition.', 5, 'Bishop Anthony King', 'Bishop', '2024-02-18', 'Sunday Morning', 'Hebrews 11:1-6', '["Now faith is the substance of things hoped for", "Walking by faith requires complete trust", "God is a rewarder of them that diligently seek him"]', 'published', 5),
(1, 'The Power of Effectual Prayer', 'Discover the transformative power of prayer in the believer''s life. Learn practical ways to develop a stronger prayer life according to scripture.', 6, 'Pastor John Smith', 'Pastor', '2024-02-11', 'Sunday Morning', 'James 5:16', '["The effectual fervent prayer of a righteous man availeth much", "Prayer is our direct line to the Father", "Persistence in prayer brings breakthrough"]', 'published', 6),
(2, 'Love in Action', 'How we can demonstrate God''s love through our actions and service to others in our community, following Christ''s example.', 7, 'Pastor Mary Johnson', 'Pastor', '2024-02-18', 'Sunday Morning', '1 John 3:16-18', '["Hereby perceive we the love of God", "Love must be demonstrated through deeds", "Community impact through Christ-like love"]', 'published', 7),
(1, 'Overcoming Through Christ', 'A message of hope and encouragement for those facing challenges. God has equipped us to overcome every obstacle through His strength.', 11, 'Minister Robert Jones', 'Minister', '2024-02-14', 'Wednesday Bible Study', 'Philippians 4:13', '["I can do all things through Christ", "His strength is made perfect in weakness", "Victory is assured through faith"]', 'published', 11);

-- Insert Word sharing sessions
INSERT INTO word_sharing_sessions (word_id, church_id, session_name, shared_by, shared_at, attendee_count) VALUES
(1, 1, 'Sunday Morning Service', 5, '2024-02-18 11:00:00', 250),
(2, 1, 'Sunday Morning Service', 6, '2024-02-11 11:00:00', 230),
(3, 2, 'Sunday Morning Service', 7, '2024-02-18 10:30:00', 180),
(4, 1, 'Wednesday Bible Study', 11, '2024-02-14 19:00:00', 85);

-- Show completion message
SELECT 'Development database setup completed successfully!' as message;
SELECT 'Super Admin (Tone King): tone@tonekingdev.com / admin123' as super_admin_1;
SELECT 'Super Admin (Krissie Knight): krisk@tonekingdev.com / admin123' as super_admin_2;
SELECT 'First Lady (Cliffondra King): cking@holycityofgod.org / admin123' as first_lady;
SELECT 'Network Admin: admin@holycityofgod.org / admin123' as network_admin;
SELECT 'Bishop: pastor@holycityofgod.org / admin123' as bishop_login;
SELECT 'Sample pastor login: pastor.main@holycityofgod.org / admin123' as pastor_login;
SELECT COUNT(*) as total_churches FROM churches;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_content FROM cms_content;
SELECT COUNT(*) as total_roles FROM roles;
SELECT COUNT(*) as total_positions FROM positions;
SELECT COUNT(*) as total_announcements FROM announcements;
SELECT COUNT(*) as total_prayers FROM prayers;
SELECT COUNT(*) as total_word_messages FROM word;
SELECT COUNT(*) as total_bible_verses FROM bible_verses;