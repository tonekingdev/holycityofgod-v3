-- MySQL script to create calendar_permissions table
-- This manages who can view/edit specific calendars

DROP TABLE IF EXISTS calendar_permissions;

CREATE TABLE calendar_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    calendar_id INT NOT NULL,
    user_id INT NOT NULL,
    permission_type ENUM('view', 'edit', 'admin') NOT NULL DEFAULT 'view',
    granted_by INT NOT NULL COMMENT 'User ID who granted this permission',
    granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Foreign key constraints
    CONSTRAINT fk_calendar_permissions_calendar FOREIGN KEY (calendar_id) REFERENCES calendars(id) ON DELETE CASCADE,
    CONSTRAINT fk_calendar_permissions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_calendar_permissions_granted_by FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE RESTRICT,
    
    -- Indexes
    INDEX idx_calendar_permissions_calendar (calendar_id),
    INDEX idx_calendar_permissions_user (user_id),
    INDEX idx_calendar_permissions_active (is_active),
    
    -- Unique constraint to prevent duplicate permissions
    UNIQUE KEY uk_calendar_user_permission (calendar_id, user_id, permission_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;