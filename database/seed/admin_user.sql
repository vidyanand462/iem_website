-- Seed Admin User (Credentials: admin@iemcal.com / Admin@12345)
USE iem_admission_db;

INSERT INTO users (id, email, password_hash, role, is_active) VALUES
(1, 'admin@iemcal.com', '$2b$10$wT0l06qHw1f9Z56k5zR1CeX3NqSgnVj.gV6B5e2gK4qE.5dYJbkyG', 'ADMIN', TRUE)
ON DUPLICATE KEY UPDATE role='ADMIN', is_active=TRUE;
