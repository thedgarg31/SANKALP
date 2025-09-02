-- Sankalp - Insurance Management System
-- schema.sql
-- This script defines the database structure for the project.

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS sankalp_db;
USE sankalp_db;

-- Table 1: users
-- Stores user account information.
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL, -- In a real app, this should be a hashed password.
  `full_name` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(20),
  `address` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: insurance_types
-- Stores the different categories of insurance available (e.g., Health, Car, Life).
CREATE TABLE IF NOT EXISTS `insurance_types` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `type_name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `icon` VARCHAR(100) -- e.g., 'ph-heartbeat', 'ph-car' for mapping to frontend icons
);

-- Table 3: policies
-- Stores details about specific insurance policies offered by providers.
CREATE TABLE IF NOT EXISTS `policies` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `insurance_type_id` INT,
  `provider_name` VARCHAR(255) NOT NULL, -- e.g., 'LIC', 'HDFC Ergo', 'Bajaj Allianz'
  `policy_name` VARCHAR(255) NOT NULL, -- e.g., 'Jeevan Anand', 'Optima Restore'
  `coverage_amount` DECIMAL(15, 2) NOT NULL,
  `annual_premium` DECIMAL(10, 2) NOT NULL,
  `details` TEXT,
  FOREIGN KEY (`insurance_type_id`) REFERENCES `insurance_types`(`id`)
);

-- Table 4: user_policies (Junction Table)
-- Links users to the policies they have purchased.
CREATE TABLE IF NOT EXISTS `user_policies` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `policy_id` INT NOT NULL,
  `policy_number` VARCHAR(100) NOT NULL UNIQUE,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `status` ENUM('Active', 'Expired', 'Cancelled') DEFAULT 'Active',
  `purchased_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`policy_id`) REFERENCES `policies`(`id`)
);

-- --- Sample Data Insertion (Optional) ---
-- You can run these commands to populate your database with some initial data.

-- Insert insurance types
INSERT INTO `insurance_types` (`type_name`, `description`, `icon`) VALUES
('Health Insurance', 'Coverage for medical and surgical expenses.', 'ph-first-aid-kit'),
('Car Insurance', 'Protection against physical damage or bodily injury from traffic collisions.', 'ph-car'),
('Life Insurance', 'A payout to beneficiaries upon the insured person''s death.', 'ph-heartbeat'),
('Home Insurance', 'Protection for your home and belongings.', 'ph-house'),
('Travel Insurance', 'Coverage for risks while travelling.', 'ph-airplane-takeoff');

-- Insert a sample user
INSERT INTO `users` (`email`, `password`, `full_name`) VALUES
('testuser@sankalp.com', 'password123', 'Suresh Kumar');

-- Insert some sample policies
INSERT INTO `policies` (`insurance_type_id`, `provider_name`, `policy_name`, `coverage_amount`, `annual_premium`) VALUES
(1, 'HDFC Ergo', 'Optima Restore', 500000.00, 12500.00),
(2, 'Bajaj Allianz', 'Comprehensive Car Plan', 800000.00, 18000.00);

-- Link the sample user to the policies
INSERT INTO `user_policies` (`user_id`, `policy_id`, `policy_number`, `start_date`, `end_date`) VALUES
(1, 1, 'HLT-987654', '2023-10-16', '2024-10-15'),
(1, 2, 'CAR-123456', '2023-12-23', '2024-12-22'); 
