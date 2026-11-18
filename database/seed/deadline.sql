-- Seed Application Deadline for 2026-2027 Admission Cycle
USE iem_admission_db;

INSERT INTO application_deadlines (id, academic_year, start_date, end_date, status, announcement_notice) VALUES
(1, '2026-2027', '2026-01-15 00:00:00', '2026-08-30 23:59:59', 'OPEN', 'Admissions for Academic Year 2026-2027 are currently active across all engineering & management departments.')
ON DUPLICATE KEY UPDATE status=VALUES(status), end_date=VALUES(end_date);
