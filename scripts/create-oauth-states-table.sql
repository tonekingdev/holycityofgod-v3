-- Adding explicit MySQL syntax markers to prevent MSSQL linter errors
-- MySQL syntax for OAuth states table
DROP TABLE IF EXISTS oauth_states;

CREATE TABLE oauth_states (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  state VARCHAR(255) NOT NULL UNIQUE,
  provider VARCHAR(50) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_oauth_states_state (state),
  INDEX idx_oauth_states_user_id (user_id),
  INDEX idx_oauth_states_expires_at (expires_at),
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;