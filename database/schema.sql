-- ============================================
-- ROOMIE CONNECT - MySQL Database Schema
-- Compatible with Android (Retrofit/OkHttp)
-- ============================================

CREATE DATABASE IF NOT EXISTS roomie_connect;
USE roomie_connect;

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,         -- bcrypt hashed
    phone VARCHAR(20),
    location VARCHAR(100),
    budget INT DEFAULT 0,
    gender ENUM('male', 'female', 'other') NOT NULL,
    diet ENUM('veg', 'nonveg') NOT NULL,
    personality ENUM('introvert', 'extrovert') NOT NULL,
    schedule ENUM('morningbird', 'nightowl') NOT NULL,
    bio TEXT,
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- TOKENS TABLE (JWT refresh tokens)
CREATE TABLE IF NOT EXISTS tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- CONTACTS / REQUESTS TABLE
CREATE TABLE IF NOT EXISTS contact_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- SEED DATA (50 sample users from original app)
-- ============================================
INSERT INTO users (name, email, password, location, budget, gender, diet, personality, schedule) VALUES
('Amala',     'amala@example.com',    '$2b$10$examplehash', 'Visakhapatnam', 5000, 'female', 'veg',    'introvert', 'morningbird'),
('Arjun',     'arjun@example.com',    '$2b$10$examplehash', 'Vijayawada',    3000, 'male',   'nonveg', 'extrovert', 'nightowl'),
('Ram',       'ram@example.com',      '$2b$10$examplehash', 'Guntur',        2000, 'male',   'veg',    'extrovert', 'nightowl'),
('Sita',      'sita@example.com',     '$2b$10$examplehash', 'Kakinada',      2000, 'female', 'nonveg', 'introvert', 'morningbird'),
('Jessica',   'jessica@example.com',  '$2b$10$examplehash', 'Tirupati',      3500, 'female', 'veg',    'extrovert', 'morningbird'),
('Preetham',  'preetham@example.com', '$2b$10$examplehash', 'Anantapur',     2000, 'male',   'nonveg', 'introvert', 'nightowl'),
('Keerthi',   'keerthi@example.com',  '$2b$10$examplehash', 'Rajahmundry',   2400, 'female', 'veg',    'extrovert', 'morningbird'),
('Yash',      'yash@example.com',     '$2b$10$examplehash', 'Srikakulam',    2600, 'male',   'veg',    'introvert', 'nightowl'),
('Sindhu',    'sindhu@example.com',   '$2b$10$examplehash', 'Nellore',       3200, 'female', 'nonveg', 'extrovert', 'morningbird'),
('Kalyan',    'kalyan@example.com',   '$2b$10$examplehash', 'Chittoor',      1800, 'male',   'veg',    'introvert', 'nightowl');

-- Add index for faster filter queries
CREATE INDEX idx_users_gender      ON users(gender);
CREATE INDEX idx_users_diet        ON users(diet);
CREATE INDEX idx_users_personality ON users(personality);
CREATE INDEX idx_users_schedule    ON users(schedule);
CREATE INDEX idx_users_location    ON users(location);
CREATE INDEX idx_users_budget      ON users(budget);

SHOW DATABASES;
USE roomie_connect;
SHOW TABLES;
SELECT id, name, email, location FROM users;

USE roomie_connect;
 
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_messages_pair (sender_id, receiver_id)
);
 
SELECT 'SUCCESS: Messages table ready! Chat will now work.' AS result;
 