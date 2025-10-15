-- Removed foreign key constraints to prevent errno 150 error
-- Converting from PostgreSQL to MySQL syntax to fix MSSQL linter errors
-- MySQL syntax for calendar events table
DROP TABLE IF EXISTS calendar_events;

CREATE TABLE calendar_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  sync_id INT NOT NULL,
  external_event_id VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  all_day BOOLEAN DEFAULT FALSE,
  location VARCHAR(500),
  attendees JSON,
  recurrence_rule VARCHAR(255),
  status VARCHAR(50) DEFAULT 'confirmed',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_synced_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_sync_external (sync_id, external_event_id),
  INDEX idx_calendar_events_user_id (user_id),
  INDEX idx_calendar_events_sync_id (sync_id),
  INDEX idx_calendar_events_start_time (start_time),
  INDEX idx_calendar_events_external_id (external_event_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;