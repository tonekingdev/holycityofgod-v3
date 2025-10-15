-- Create personal_calendar_sync table for calendar synchronization
-- Added explicit MySQL syntax to resolve MSSQL linter conflicts
DROP TABLE IF EXISTS personal_calendar_sync;

CREATE TABLE personal_calendar_sync (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  calendar_provider VARCHAR(50) NOT NULL COMMENT 'google, outlook, apple, etc.',
  calendar_id VARCHAR(255) NOT NULL COMMENT 'External calendar ID',
  calendar_name VARCHAR(255) NOT NULL,
  access_token TEXT COMMENT 'Encrypted access token',
  refresh_token TEXT COMMENT 'Encrypted refresh token',
  token_expires_at DATETIME NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  sync_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  last_sync_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (id),
  
  CONSTRAINT fk_personal_calendar_sync_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  INDEX idx_personal_calendar_sync_user_id (user_id),
  INDEX idx_personal_calendar_sync_is_primary (is_primary),
  INDEX idx_personal_calendar_sync_sync_enabled (sync_enabled),
  
  UNIQUE KEY unique_user_calendar (user_id, calendar_provider, calendar_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;