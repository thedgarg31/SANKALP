-- Enhanced Sankalp - Insurance Management System
-- enhanced_schema.sql
-- This script defines the enhanced database structure with additional features.

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS sankalp_db;
USE sankalp_db;

-- Table 1: users (Enhanced)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(20),
  `address` TEXT,
  `date_of_birth` DATE,
  `gender` ENUM('Male', 'Female', 'Other'),
  `profile_picture` VARCHAR(255),
  `is_verified` BOOLEAN DEFAULT FALSE,
  `verification_token` VARCHAR(255),
  `reset_password_token` VARCHAR(255),
  `reset_password_expires` DATETIME,
  `last_login` DATETIME,
  `status` ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table 2: insurance_types (Enhanced)
CREATE TABLE IF NOT EXISTS `insurance_types` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `type_name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `icon` VARCHAR(100),
  `category` ENUM('Life', 'Health', 'Property', 'Vehicle', 'Travel', 'Business') NOT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 3: policies (Enhanced)
CREATE TABLE IF NOT EXISTS `policies` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `insurance_type_id` INT,
  `provider_name` VARCHAR(255) NOT NULL,
  `policy_name` VARCHAR(255) NOT NULL,
  `coverage_amount` DECIMAL(15, 2) NOT NULL,
  `annual_premium` DECIMAL(10, 2) NOT NULL,
  `details` TEXT,
  `terms_conditions` TEXT,
  `exclusions` TEXT,
  `waiting_period` INT DEFAULT 0, -- in days
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`insurance_type_id`) REFERENCES `insurance_types`(`id`)
);

-- Table 4: user_policies (Enhanced)
CREATE TABLE IF NOT EXISTS `user_policies` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `policy_id` INT NOT NULL,
  `policy_number` VARCHAR(100) NOT NULL UNIQUE,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `status` ENUM('Active', 'Expired', 'Cancelled', 'Pending', 'Under Review') DEFAULT 'Active',
  `premium_amount` DECIMAL(10, 2) NOT NULL,
  `payment_frequency` ENUM('Monthly', 'Quarterly', 'Half-Yearly', 'Yearly') DEFAULT 'Yearly',
  `next_premium_date` DATE,
  `auto_renewal` BOOLEAN DEFAULT TRUE,
  `purchased_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`policy_id`) REFERENCES `policies`(`id`)
);

-- Table 5: claims (New)
CREATE TABLE IF NOT EXISTS `claims` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_policy_id` INT NOT NULL,
  `claim_number` VARCHAR(100) NOT NULL UNIQUE,
  `claim_type` ENUM('Health', 'Accident', 'Property', 'Vehicle', 'Other') NOT NULL,
  `claim_amount` DECIMAL(15, 2) NOT NULL,
  `description` TEXT NOT NULL,
  `incident_date` DATE NOT NULL,
  `filing_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('Pending', 'Under Review', 'Approved', 'Rejected', 'Settled') DEFAULT 'Pending',
  `documents_required` TEXT,
  `approved_amount` DECIMAL(15, 2),
  `settlement_date` DATE,
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_policy_id`) REFERENCES `user_policies`(`id`)
);

-- Table 6: claim_documents (New)
CREATE TABLE IF NOT EXISTS `claim_documents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `claim_id` INT NOT NULL,
  `document_name` VARCHAR(255) NOT NULL,
  `document_path` VARCHAR(500) NOT NULL,
  `document_type` VARCHAR(100),
  `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`claim_id`) REFERENCES `claims`(`id`)
);

-- Table 7: notifications (New)
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('Info', 'Warning', 'Success', 'Error') DEFAULT 'Info',
  `is_read` BOOLEAN DEFAULT FALSE,
  `action_url` VARCHAR(500),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

-- Table 8: payments (New)
CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_policy_id` INT NOT NULL,
  `payment_id` VARCHAR(100) NOT NULL UNIQUE,
  `amount` DECIMAL(10, 2) NOT NULL,
  `payment_method` ENUM('Credit Card', 'Debit Card', 'Net Banking', 'UPI', 'Cash') NOT NULL,
  `status` ENUM('Pending', 'Completed', 'Failed', 'Refunded') DEFAULT 'Pending',
  `transaction_id` VARCHAR(255),
  `payment_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `due_date` DATE,
  `late_fee` DECIMAL(10, 2) DEFAULT 0,
  FOREIGN KEY (`user_policy_id`) REFERENCES `user_policies`(`id`)
);

-- Table 9: policy_renewals (New)
CREATE TABLE IF NOT EXISTS `policy_renewals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_policy_id` INT NOT NULL,
  `renewal_date` DATE NOT NULL,
  `new_premium_amount` DECIMAL(10, 2),
  `status` ENUM('Pending', 'Completed', 'Cancelled') DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_policy_id`) REFERENCES `user_policies`(`id`)
);

-- Table 10: support_tickets (New)
CREATE TABLE IF NOT EXISTS `support_tickets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `ticket_number` VARCHAR(100) NOT NULL UNIQUE,
  `subject` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `priority` ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
  `status` ENUM('Open', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Open',
  `assigned_to` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

-- Table 11: ticket_responses (New)
CREATE TABLE IF NOT EXISTS `ticket_responses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ticket_id` INT NOT NULL,
  `responder_id` INT,
  `response` TEXT NOT NULL,
  `is_staff_response` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets`(`id`),
  FOREIGN KEY (`responder_id`) REFERENCES `users`(`id`)
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_policies_user_id ON user_policies(user_id);
CREATE INDEX idx_user_policies_status ON user_policies(status);
CREATE INDEX idx_claims_user_policy_id ON claims(user_policy_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_payments_user_policy_id ON payments(user_policy_id);
CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);

-- Sample Data Insertion
INSERT INTO `insurance_types` (`type_name`, `description`, `icon`, `category`) VALUES
('Health Insurance', 'Comprehensive coverage for medical and surgical expenses.', 'ph-first-aid-kit', 'Health'),
('Car Insurance', 'Protection against physical damage or bodily injury from traffic collisions.', 'ph-car', 'Vehicle'),
('Life Insurance', 'A payout to beneficiaries upon the insured person''s death.', 'ph-heartbeat', 'Life'),
('Home Insurance', 'Protection for your home and belongings.', 'ph-house', 'Property'),
('Travel Insurance', 'Coverage for risks while travelling.', 'ph-airplane-takeoff', 'Travel'),
('Business Insurance', 'Comprehensive plans to protect your business assets and liabilities.', 'ph-briefcase', 'Business'),
('Bike Insurance', 'Two-wheeler insurance with comprehensive coverage.', 'ph-bicycle', 'Vehicle'),
('Term Insurance', 'Pure life insurance with high coverage at low premium.', 'ph-shield-check', 'Life');

-- Insert sample policies
INSERT INTO `policies` (`insurance_type_id`, `provider_name`, `policy_name`, `coverage_amount`, `annual_premium`, `details`, `terms_conditions`) VALUES
(1, 'HDFC Ergo', 'Optima Restore', 500000.00, 12500.00, 'Comprehensive health insurance with restore benefit', 'Standard terms apply'),
(2, 'Bajaj Allianz', 'Comprehensive Car Plan', 800000.00, 18000.00, 'Full coverage car insurance', 'Standard terms apply'),
(3, 'LIC', 'Jeevan Anand', 1000000.00, 25000.00, 'Traditional life insurance plan', 'Standard terms apply'),
(4, 'ICICI Lombard', 'Home Shield', 2000000.00, 8000.00, 'Complete home protection', 'Standard terms apply');

-- Insert sample user (password will be hashed in the application)
INSERT INTO `users` (`email`, `password`, `full_name`, `phone_number`, `date_of_birth`, `gender`) VALUES
('testuser@sankalp.com', '$2a$10$dummyhash', 'Suresh Kumar', '+91-9876543210', '1990-05-15', 'Male'),
('admin@sankalp.com', '$2a$10$dummyhash', 'Admin User', '+91-9876543211', '1985-03-20', 'Male');

-- Link sample user to policies
INSERT INTO `user_policies` (`user_id`, `policy_id`, `policy_number`, `start_date`, `end_date`, `premium_amount`, `next_premium_date`) VALUES
(1, 1, 'HLT-987654', '2023-10-16', '2024-10-15', 12500.00, '2024-10-16'),
(1, 2, 'CAR-123456', '2023-12-23', '2024-12-22', 18000.00, '2024-12-23');

-- Insert sample notifications
INSERT INTO `notifications` (`user_id`, `title`, `message`, `type`) VALUES
(1, 'Premium Due Reminder', 'Your health insurance premium is due on 16 Oct 2024', 'Warning'),
(1, 'Policy Renewal', 'Your car insurance policy expires on 22 Dec 2024', 'Info');

-- Insert sample support ticket
INSERT INTO `support_tickets` (`user_id`, `ticket_number`, `subject`, `description`, `priority`) VALUES
(1, 'TKT-001', 'Claim Status Inquiry', 'I would like to know the status of my recent claim', 'Medium');
