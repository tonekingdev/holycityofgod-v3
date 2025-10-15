-- Event Approval Workflow Schema
-- Adds approval workflow functionality to the calendar system

-- Add approval columns to events table
ALTER TABLE events 
ADD COLUMN approval_status ENUM('pending', 'first_approved', 'final_approved', 'rejected') DEFAULT 'pending',
ADD COLUMN first_approved_by VARCHAR(255) NULL,
ADD COLUMN first_approved_at TIMESTAMP NULL,
ADD COLUMN final_approved_by VARCHAR(255) NULL,
ADD COLUMN final_approved_at TIMESTAMP NULL,
ADD COLUMN rejection_reason TEXT NULL;

-- Create event_approvals table for tracking approval history
CREATE TABLE IF NOT EXISTS event_approvals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT NOT NULL,
  approver_email VARCHAR(255) NOT NULL,
  approver_name VARCHAR(255) NOT NULL,
  approval_level ENUM('first', 'final') NOT NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL,
  comments TEXT NULL,
  approved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  INDEX idx_event_approvals_event_id (event_id),
  INDEX idx_event_approvals_approver (approver_email),
  INDEX idx_event_approvals_status (status)
);

-- Create approval workflow configuration table
CREATE TABLE IF NOT EXISTS approval_workflows (
  id INT PRIMARY KEY AUTO_INCREMENT,
  workflow_name VARCHAR(255) NOT NULL,
  first_approver_name VARCHAR(255) NOT NULL DEFAULT 'First Lady Kiana King',
  first_approver_email VARCHAR(255) NOT NULL DEFAULT 'ck@holycityofgod.org',
  final_approver_name VARCHAR(255) NOT NULL DEFAULT 'Bishop Anthony King',
  final_approver_email VARCHAR(255) NOT NULL DEFAULT 'pastor@holycityofgod.org',
  main_church_name VARCHAR(255) NOT NULL DEFAULT 'Holy City of God Christian Fellowship Inc.',
  main_church_address TEXT NOT NULL DEFAULT '16606 James Couzens Fwy, Detroit, MI 48221',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default approval workflow
INSERT INTO approval_workflows (
  workflow_name,
  first_approver_name,
  first_approver_email,
  final_approver_name,
  final_approver_email,
  main_church_name,
  main_church_address
) VALUES (
  'Holy City of God Event Approval',
  'First Lady Kiana King',
  'ck@holycityofgod.org',
  'Bishop Anthony King',
  'pastor@holycityofgod.org',
  'Holy City of God Christian Fellowship Inc.',
  '16606 James Couzens Fwy, Detroit, MI 48221'
);

-- Update existing events to require approval
UPDATE events SET approval_status = 'pending' WHERE approval_status IS NULL;
