-- Fixed MySQL compatibility and table dependencies
-- Holy City of God Network - Fellowship Churches and Partner Businesses Tables
-- This script creates tables for managing fellowship churches and partner businesses
-- Run this AFTER setup-development-database.sql to ensure users table exists

-- Create fellowship_churches table
CREATE TABLE IF NOT EXISTS fellowship_churches (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  website_url VARCHAR(500),
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  pastor_name VARCHAR(255),
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create network_businesses table
CREATE TABLE IF NOT EXISTS network_businesses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  website_url VARCHAR(500),
  business_type VARCHAR(100),
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  contact_person VARCHAR(255),
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fellowship_churches_active ON fellowship_churches(is_active);
CREATE INDEX IF NOT EXISTS idx_fellowship_churches_order ON fellowship_churches(display_order);
CREATE INDEX IF NOT EXISTS idx_network_businesses_active ON network_businesses(is_active);
CREATE INDEX IF NOT EXISTS idx_network_businesses_order ON network_businesses(display_order);
CREATE INDEX IF NOT EXISTS idx_network_businesses_type ON network_businesses(business_type);

-- Show completion message
SELECT 'Network tables created successfully!' as message;
SELECT 'fellowship_churches table ready for data' as fellowship_status;
SELECT 'network_businesses table ready for data' as business_status;