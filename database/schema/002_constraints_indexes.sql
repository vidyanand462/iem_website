-- 002_constraints_indexes.sql
-- Performance Indexes and Constraints for IEM Admission System

USE iem_admission_db;

-- Indexes for fast lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_applicants_user_id ON applicants(user_id);
CREATE INDEX idx_applicants_phone ON applicants(phone);

CREATE INDEX idx_applications_app_id ON applications(application_id);
CREATE INDEX idx_applications_applicant ON applications(applicant_id);
CREATE INDEX idx_applications_dept ON applications(department_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created ON applications(created_at);

CREATE INDEX idx_seat_allocations_dept ON seat_allocations(department_id);
CREATE INDEX idx_status_history_app ON status_history(application_id);
CREATE INDEX idx_status_history_created ON status_history(created_at);

CREATE INDEX idx_academic_entrance_rank ON academic_information(entrance_rank);
