-- MySQL script to create calendar_types table for church calendar hierarchy
-- This defines different types of calendars with approval levels

DROP TABLE IF EXISTS calendar_types;

CREATE TABLE calendar_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    level INT NOT NULL DEFAULT 1 COMMENT '1=Main Church (Bishop/First Lady approval), 2=Fellow Churches, 3=Ministry, 4=Personal',
    requires_approval BOOLEAN DEFAULT TRUE,
    approval_roles JSON COMMENT 'JSON array of roles that can approve this calendar type',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default calendar types
INSERT INTO calendar_types (name, description, level, requires_approval, approval_roles) VALUES
('Main Church Calendar', 'Primary church calendar requiring Bishop and First Lady approval', 1, TRUE, '["bishop", "first_lady"]'),
('Fellow Church Calendar', 'Individual church calendars with local approval', 2, TRUE, '["pastor", "church_admin"]'),
('Ministry Calendar', 'Ministry-specific calendars', 3, TRUE, '["ministry_leader", "pastor"]'),
('Personal Calendar', 'Individual user calendars', 4, FALSE, '[]');