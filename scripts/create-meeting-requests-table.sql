-- Create meeting_requests table for Bishop meeting requests
CREATE TABLE IF NOT EXISTS meeting_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  meeting_type VARCHAR(100) NOT NULL,
  reason TEXT NOT NULL,
  approval_status ENUM('pending', 'first_approved', 'final_approved', 'rejected') DEFAULT 'pending',
  first_approved_by VARCHAR(255),
  first_approved_at DATETIME,
  final_approved_by VARCHAR(255),
  final_approved_at DATETIME,
  rejection_reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_approval_status (approval_status),
  INDEX idx_email (email),
  INDEX idx_preferred_date (preferred_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;