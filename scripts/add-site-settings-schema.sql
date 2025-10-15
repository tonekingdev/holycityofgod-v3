-- Holy City of God Church Network - Site Settings Extension
-- This script adds tables for CMS-managed site settings and content

USE holycityofgod_dev;

-- =============================================
-- SITE SETTINGS TABLES
-- =============================================

-- Site settings table - Global and church-specific settings
CREATE TABLE site_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    church_id INT NULL, -- NULL for network-wide settings
    setting_key VARCHAR(100) NOT NULL,
    setting_value LONGTEXT,
    setting_type ENUM('text', 'textarea', 'html', 'json', 'boolean', 'number', 'url', 'email', 'color', 'image') DEFAULT 'text',
    category VARCHAR(50) NOT NULL, -- 'church_info', 'contact', 'social', 'design', 'services', etc.
    description TEXT,
    is_public BOOLEAN DEFAULT TRUE, -- Whether this setting can be displayed publicly
    is_editable BOOLEAN DEFAULT TRUE, -- Whether this setting can be edited through CMS
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NOT NULL,
    FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id),
    UNIQUE KEY unique_church_setting (church_id, setting_key),
    INDEX idx_settings_church (church_id),
    INDEX idx_settings_category (category),
    INDEX idx_settings_key (setting_key)
);

-- Page sections table - Editable page sections and content blocks
CREATE TABLE page_sections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    church_id INT NULL, -- NULL for network-wide sections
    page_slug VARCHAR(100) NOT NULL, -- 'home', 'about', 'contact', 'ministries', etc.
    section_key VARCHAR(100) NOT NULL, -- 'hero', 'mission', 'values', 'pastor_bio', etc.
    section_title VARCHAR(255),
    section_content LONGTEXT,
    section_type ENUM('hero', 'text', 'image_text', 'gallery', 'contact', 'services', 'staff', 'testimonial') DEFAULT 'text',
    section_data JSON, -- Additional structured data (images, links, etc.)
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_editable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NOT NULL,
    FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id),
    UNIQUE KEY unique_church_page_section (church_id, page_slug, section_key),
    INDEX idx_sections_church (church_id),
    INDEX idx_sections_page (page_slug),
    INDEX idx_sections_order (display_order)
);

-- Service times table - Manageable service schedules
CREATE TABLE service_times (
    id INT PRIMARY KEY AUTO_INCREMENT,
    church_id INT NOT NULL,
    service_name VARCHAR(100) NOT NULL, -- 'Sunday Morning Worship', 'Wednesday Bible Study', etc.
    service_type ENUM('worship', 'bible_study', 'prayer', 'youth', 'children', 'special') DEFAULT 'worship',
    day_of_week ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    location VARCHAR(255),
    description TEXT,
    is_recurring BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    special_date DATE NULL, -- For one-time special services
    contact_person VARCHAR(255),
    contact_phone VARCHAR(20),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NOT NULL,
    FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id),
    INDEX idx_service_times_church (church_id),
    INDEX idx_service_times_day (day_of_week),
    INDEX idx_service_times_active (is_active)
);

-- Design themes table - Customizable design elements
CREATE TABLE design_themes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    church_id INT NULL, -- NULL for network-wide themes
    theme_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    primary_color VARCHAR(7), -- Hex color code
    secondary_color VARCHAR(7),
    accent_color VARCHAR(7),
    background_color VARCHAR(7),
    text_color VARCHAR(7),
    heading_font VARCHAR(100),
    body_font VARCHAR(100),
    logo_url VARCHAR(500),
    favicon_url VARCHAR(500),
    hero_background_url VARCHAR(500),
    custom_css LONGTEXT,
    theme_settings JSON, -- Additional theme customizations
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NOT NULL,
    FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id),
    INDEX idx_themes_church (church_id),
    INDEX idx_themes_active (is_active)
);

-- Navigation menus table - Customizable navigation
CREATE TABLE navigation_menus (
    id INT PRIMARY KEY AUTO_INCREMENT,
    church_id INT NULL, -- NULL for network-wide menus
    menu_location ENUM('header', 'footer', 'sidebar', 'mobile') DEFAULT 'header',
    menu_item_label VARCHAR(100) NOT NULL,
    menu_item_url VARCHAR(500),
    menu_item_type ENUM('page', 'external', 'dropdown') DEFAULT 'page',
    parent_menu_id INT NULL, -- For dropdown menus
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    target_blank BOOLEAN DEFAULT FALSE, -- Open in new window
    css_class VARCHAR(100),
    icon_class VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NOT NULL,
    FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_menu_id) REFERENCES navigation_menus(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id),
    INDEX idx_nav_church (church_id),
    INDEX idx_nav_location (menu_location),
    INDEX idx_nav_order (display_order)
);

-- =============================================
-- SEED DATA FOR SITE SETTINGS
-- =============================================

-- Insert default network-wide settings
INSERT INTO site_settings (church_id, setting_key, setting_value, setting_type, category, description, updated_by) VALUES
-- Church Information
(NULL, 'network_name', 'Holy City of God Network', 'text', 'church_info', 'Network name displayed across all sites', 4),
(NULL, 'network_tagline', 'Building Strong Communities of Faith', 'text', 'church_info', 'Network tagline or motto', 4),
(NULL, 'network_description', 'A network of churches dedicated to spreading God''s love and building strong communities of faith throughout Georgia and beyond.', 'textarea', 'church_info', 'Network description for about pages', 4),
(NULL, 'network_mission', 'To spread the Gospel of Jesus Christ and build strong, vibrant church communities.', 'textarea', 'church_info', 'Network mission statement', 4),
(NULL, 'network_vision', 'To see lives transformed by the power of God''s love, creating disciples who make disciples in every community we serve.', 'textarea', 'church_info', 'Network vision statement', 4),

-- Contact Information
(NULL, 'network_phone', '(404) 555-0100', 'text', 'contact', 'Main network phone number', 4),
(NULL, 'network_email', 'info@holycityofgod.org', 'email', 'contact', 'Main network email address', 4),
(NULL, 'prayer_email', 'prayers@holycityofgod.org', 'email', 'contact', 'Email for prayer requests', 4),

-- Social Media
(NULL, 'facebook_url', 'https://facebook.com/holycityofgodnetwork', 'url', 'social', 'Facebook page URL', 4),
(NULL, 'instagram_url', 'https://instagram.com/holycityofgodnetwork', 'url', 'social', 'Instagram profile URL', 4),
(NULL, 'youtube_url', 'https://youtube.com/@holycityofgodnetwork', 'url', 'social', 'YouTube channel URL', 4),
(NULL, 'twitter_url', 'https://twitter.com/hcognetwork', 'url', 'social', 'Twitter/X profile URL', 4),

-- Design Settings
(NULL, 'primary_color', '#6B46C1', 'color', 'design', 'Primary brand color (purple)', 4),
(NULL, 'secondary_color', '#F59E0B', 'color', 'design', 'Secondary brand color (gold)', 4),
(NULL, 'accent_color', '#10B981', 'color', 'design', 'Accent color for highlights', 4),

-- Homepage Settings
(NULL, 'hero_title', 'Welcome to the Holy City of God Network', 'text', 'homepage', 'Main hero section title', 4),
(NULL, 'hero_subtitle', 'Building Strong Communities of Faith', 'text', 'homepage', 'Hero section subtitle', 4),
(NULL, 'hero_description', 'Join us as we worship together, grow in faith, and serve our communities with the love of Christ.', 'textarea', 'homepage', 'Hero section description', 4),
(NULL, 'hero_cta_text', 'Find a Church Near You', 'text', 'homepage', 'Hero call-to-action button text', 4),
(NULL, 'hero_cta_url', '/churches', 'url', 'homepage', 'Hero call-to-action button URL', 4);

-- Insert church-specific settings for Main Campus
INSERT INTO site_settings (church_id, setting_key, setting_value, setting_type, category, description, updated_by) VALUES
-- Church Information
(1, 'church_name', 'Holy City of God - Main Campus', 'text', 'church_info', 'Full church name', 6),
(1, 'church_tagline', 'Faith, Community, Service', 'text', 'church_info', 'Church tagline', 6),
(1, 'pastor_name', 'Pastor John Smith', 'text', 'church_info', 'Lead pastor name', 6),
(1, 'pastor_title', 'Lead Pastor', 'text', 'church_info', 'Pastor title', 6),
(1, 'pastor_bio', 'Pastor John Smith has been serving the Lord for over 20 years, leading with compassion and biblical wisdom. He holds a Master of Divinity and is passionate about discipleship and community outreach.', 'textarea', 'church_info', 'Pastor biography', 6),

-- Contact Information
(1, 'church_address', '123 Faith Street', 'text', 'contact', 'Church street address', 6),
(1, 'church_city', 'Atlanta', 'text', 'contact', 'Church city', 6),
(1, 'church_state', 'GA', 'text', 'contact', 'Church state', 6),
(1, 'church_zip', '30309', 'text', 'contact', 'Church ZIP code', 6),
(1, 'church_phone', '(404) 555-0100', 'text', 'contact', 'Church phone number', 6),
(1, 'church_email', 'main@holycityofgod.org', 'email', 'contact', 'Church email address', 6),

-- Service Information
(1, 'sunday_service_note', 'Join us for inspiring worship and biblical teaching every Sunday', 'textarea', 'services', 'Note about Sunday services', 6),
(1, 'midweek_service_note', 'Grow deeper in your faith through our midweek Bible study', 'textarea', 'services', 'Note about midweek services', 6);

-- Insert default page sections for Main Campus
INSERT INTO page_sections (church_id, page_slug, section_key, section_title, section_content, section_type, display_order, updated_by) VALUES
-- Homepage sections
(1, 'home', 'hero', 'Welcome to Holy City of God - Main Campus', 
'<h1>Welcome to Holy City of God - Main Campus</h1>
<p class="text-xl">Located in the heart of Atlanta, we are a vibrant community of believers committed to worship, fellowship, and service.</p>
<p>Join us every Sunday for inspiring worship services that will strengthen your faith and connect you with our church family.</p>', 
'hero', 1, 6),

(1, 'home', 'mission', 'Our Mission', 
'<h2>Our Mission</h2>
<p>To spread the Gospel of Jesus Christ in Atlanta and beyond, building a strong community of believers who worship together, grow in faith, and serve others with the love of Christ.</p>', 
'text', 2, 6),

(1, 'home', 'values', 'Our Core Values', 
'<h2>What We Believe</h2>
<div class="grid md:grid-cols-2 gap-6">
<div>
<h3>Faith</h3>
<p>We believe in the transforming power of Jesus Christ and the authority of God''s Word.</p>
</div>
<div>
<h3>Community</h3>
<p>We are stronger together, supporting one another through life''s joys and challenges.</p>
</div>
<div>
<h3>Service</h3>
<p>We serve others as Christ served us, making a positive impact in our community.</p>
</div>
<div>
<h3>Growth</h3>
<p>We are committed to continuous spiritual growth and discipleship.</p>
</div>
</div>', 
'text', 3, 6),

-- About page sections
(1, 'about', 'pastor', 'Meet Our Pastor', 
'<h2>Pastor John Smith</h2>
<p>Pastor John Smith has been faithfully serving the Lord for over 20 years, leading our congregation with compassion, wisdom, and a heart for God''s people.</p>
<p>He holds a Master of Divinity from Atlanta Theological Seminary and is passionate about discipleship, community outreach, and helping people discover their purpose in Christ.</p>
<p>Pastor Smith and his wife, Sarah, have been married for 18 years and have three children. They love spending time with the church family and are always available to pray with and encourage our members.</p>', 
'staff', 1, 6),

(1, 'about', 'history', 'Our History', 
'<h2>Our Church History</h2>
<p>Holy City of God - Main Campus was established in 2005 as part of the growing Holy City of God Network. What began as a small group of believers meeting in a community center has grown into a thriving congregation of over 300 members.</p>
<p>Throughout our history, we have remained committed to our founding principles: faithful biblical teaching, genuine Christian fellowship, and active service to our Atlanta community.</p>
<p>Today, we continue to grow and serve, always seeking to honor God in everything we do.</p>', 
'text', 2, 6);

-- Insert default service times for Main Campus
INSERT INTO service_times (church_id, service_name, service_type, day_of_week, start_time, end_time, location, description, display_order, updated_by) VALUES
(1, 'First Service', 'worship', 'Sunday', '09:00:00', '10:15:00', 'Main Sanctuary', 'Traditional worship service with inspiring music and biblical teaching', 1, 6),
(1, 'Sunday School', 'bible_study', 'Sunday', '10:00:00', '10:45:00', 'Various Classrooms', 'Bible study classes for all ages', 2, 6),
(1, 'Second Service', 'worship', 'Sunday', '11:00:00', '12:15:00', 'Main Sanctuary', 'Contemporary worship service with dynamic praise and worship', 3, 6),
(1, 'Wednesday Bible Study', 'bible_study', 'Wednesday', '19:00:00', '20:30:00', 'Fellowship Hall', 'Midweek Bible study for spiritual growth and fellowship', 4, 6),
(1, 'Friday Youth Service', 'youth', 'Friday', '19:30:00', '21:00:00', 'Youth Center', 'Dynamic service designed for teenagers and young adults', 5, 6);

-- Insert default navigation menu for Main Campus
INSERT INTO navigation_menus (church_id, menu_location, menu_item_label, menu_item_url, display_order, updated_by) VALUES
(1, 'header', 'Home', '/', 1, 6),
(1, 'header', 'About', '/about', 2, 6),
(1, 'header', 'Services', '/services', 3, 6),
(1, 'header', 'Ministries', '/ministries', 4, 6),
(1, 'header', 'Events', '/events', 5, 6),
(1, 'header', 'Word', '/word', 6, 6),
(1, 'header', 'Prayer', '/prayer', 7, 6),
(1, 'header', 'Contact', '/contact', 8, 6);

-- Insert footer navigation
INSERT INTO navigation_menus (church_id, menu_location, menu_item_label, menu_item_url, display_order, updated_by) VALUES
(1, 'footer', 'About Us', '/about', 1, 6),
(1, 'footer', 'Service Times', '/services', 2, 6),
(1, 'footer', 'Prayer Requests', '/prayer', 3, 6),
(1, 'footer', 'Contact Us', '/contact', 4, 6),
(1, 'footer', 'Give Online', '/give', 5, 6);

-- Insert default design theme for Main Campus
INSERT INTO design_themes (church_id, theme_name, is_active, primary_color, secondary_color, accent_color, background_color, text_color, heading_font, body_font, updated_by) VALUES
(1, 'Holy City of God - Main Campus Theme', TRUE, '#6B46C1', '#F59E0B', '#10B981', '#FFFFFF', '#1F2937', 'Inter', 'Inter', 6);

-- Show completion message
SELECT 'Site settings schema extension completed successfully!' as message;
SELECT COUNT(*) as total_site_settings FROM site_settings;
SELECT COUNT(*) as total_page_sections FROM page_sections;
SELECT COUNT(*) as total_service_times FROM service_times;
SELECT COUNT(*) as total_navigation_items FROM navigation_menus;
SELECT COUNT(*) as total_design_themes FROM design_themes;