-- Seed Departments & Seat Allocations
USE iem_admission_db;

INSERT INTO departments (id, code, name, degree, duration_years, description, is_active) VALUES
(1, 'CSE', 'Computer Science & Engineering', 'B.Tech', 4, 'Core computing systems, algorithms, high-performance computing, and distributed architectures.', TRUE),
(2, 'CSE-AIML', 'CSE (Artificial Intelligence & Machine Learning)', 'B.Tech', 4, 'Deep learning, neural networks, natural language processing, and computer vision systems.', TRUE),
(3, 'CSE-IOT-CS', 'CSE (IoT & Cyber Security)', 'B.Tech', 4, 'Connected sensor networks, embedded cryptography, industrial IoT, and defense cyber security.', TRUE),
(4, 'IT', 'Information Technology', 'B.Tech', 4, 'Cloud computing, full-stack enterprise architecture, devops, and database management.', TRUE),
(5, 'ECE', 'Electronics & Communication Engineering', 'B.Tech', 4, 'VLSI design, embedded systems, 5G wireless networks, and signal processing.', TRUE),
(6, 'EE', 'Electrical Engineering', 'B.Tech', 4, 'Renewable energy systems, smart power grids, EV drive trains, and industrial automation.', TRUE),
(7, 'MECH', 'Mechanical Engineering', 'B.Tech', 4, 'Robotics, additive manufacturing, thermodynamics, and autonomous automotive engineering.', TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name), degree=VALUES(degree);

INSERT INTO seat_allocations (department_id, total_seats, occupied_seats, available_seats, status) VALUES
(1, 120, 18, 102, 'AVAILABLE'),
(2, 60, 24, 36, 'FILLING_FAST'),
(3, 60, 10, 50, 'AVAILABLE'),
(4, 60, 15, 45, 'AVAILABLE'),
(5, 90, 20, 70, 'AVAILABLE'),
(6, 60, 8, 52, 'AVAILABLE'),
(7, 60, 6, 54, 'AVAILABLE')
ON DUPLICATE KEY UPDATE total_seats=VALUES(total_seats), occupied_seats=VALUES(occupied_seats), available_seats=VALUES(available_seats);
