-- Insert sample fellowship churches
INSERT INTO fellowship_churches (name, description, website_url, address, phone, email, pastor_name, display_order) VALUES
('Grace Community Church', 'A vibrant fellowship focused on community outreach and spiritual growth.', 'https://gracecommunity.org', '123 Faith Street, Springfield, IL 62701', '(217) 555-0123', 'info@gracecommunity.org', 'Pastor John Smith', 1),
('New Hope Baptist Church', 'Serving the community with love and compassion for over 50 years.', 'https://newhopebaptist.org', '456 Hope Avenue, Springfield, IL 62702', '(217) 555-0456', 'contact@newhopebaptist.org', 'Pastor Mary Johnson', 2),
('Faith Fellowship Center', 'A multicultural church welcoming all families and individuals.', 'https://faithfellowship.org', '789 Unity Boulevard, Springfield, IL 62703', '(217) 555-0789', 'welcome@faithfellowship.org', 'Pastor David Williams', 3);

-- Insert sample network businesses
INSERT INTO network_businesses (name, description, website_url, business_type, address, phone, email, contact_person, display_order) VALUES
('Christian Bookstore & Gifts', 'Your source for Christian books, music, and inspirational gifts.', 'https://christianbooks.com', 'Retail', '321 Gospel Lane, Springfield, IL 62704', '(217) 555-0321', 'info@christianbooks.com', 'Sarah Thompson', 1),
('Faith-Based Counseling Services', 'Professional counseling with a Christian perspective.', 'https://faithcounseling.org', 'Healthcare', '654 Healing Way, Springfield, IL 62705', '(217) 555-0654', 'appointments@faithcounseling.org', 'Dr. Michael Brown', 2),
('Kingdom Construction LLC', 'Honest construction services with integrity and quality.', 'https://kingdomconstruction.com', 'Construction', '987 Builder Street, Springfield, IL 62706', '(217) 555-0987', 'projects@kingdomconstruction.com', 'Robert Davis', 3),
('Blessed Catering Company', 'Catering services for church events and special occasions.', 'https://blessedcatering.com', 'Food Service', '147 Feast Avenue, Springfield, IL 62707', '(217) 555-0147', 'events@blessedcatering.com', 'Lisa Martinez', 4);
