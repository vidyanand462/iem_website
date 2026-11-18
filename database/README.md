# Database Setup & Seed Documentation

This directory contains the SQL schema definitions and initial seed scripts for the Institute of Engineering & Management (IEM) Admission System.

## Database Engine
- **RDBMS**: MySQL 8.0+ (with InnoDB engine for ACID transactions and foreign key support)
- **Document Store**: MongoDB 6.0+ (for application documents and uploaded file metadata)

## Schema Files
- `schema/001_create_tables.sql`: Core tables for users, applicants, applications, multi-section applicant details, departments, seat allocations, deadlines, decisions, and status history.
- `schema/002_constraints_indexes.sql`: Foreign keys, check constraints (`available_seats >= 0`), and performance indexes.

## Seed Files
- `seed/departments_and_seats.sql`: Standard IEM engineering departments (CSE, CSE-AIML, CSE-IOT-CS, IT, ECE, EE, MECH) with initial seat distributions.
- `seed/admin_user.sql`: Default administrator account (`admin@iemcal.com` / `Admin@12345`).
- `seed/deadline.sql`: Active admission deadline window for 2026-2027.

## Manual Execution (MySQL CLI)
```bash
mysql -u root -p < schema/001_create_tables.sql
mysql -u root -p < schema/002_constraints_indexes.sql
mysql -u root -p < seed/departments_and_seats.sql
mysql -u root -p < seed/admin_user.sql
mysql -u root -p < seed/deadline.sql
```

## Docker Compose Quickstart
Run the included `docker-compose.yml` in the root folder:
```bash
docker-compose up -d
```
The MySQL instance automatically initializes schema scripts placed in `/docker-entrypoint-initdb.d`.
