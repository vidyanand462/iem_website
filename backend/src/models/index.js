import bcrypt from 'bcryptjs';
import { sequelize } from '../config/db.js';
import User from './user.model.js';
import Applicant from './applicant.model.js';
import Department from './department.model.js';
import SeatAllocation from './seatAllocation.model.js';
import ApplicationDeadline from './deadline.model.js';
import Application from './application.model.js';
import PersonalInfo from './personalInfo.model.js';
import ContactInfo from './contactInfo.model.js';
import GuardianInfo from './guardianInfo.model.js';
import AcademicInfo from './academicInfo.model.js';
import ApplicationDecision from './decision.model.js';
import StatusHistory from './statusHistory.model.js';
import { SQLDocument, MongoDocument } from './document.model.js';
import Payment from './payment.model.js';
import { ROLES } from '../constants/roles.js';

// --- Associations ---

// User <-> Applicant (1:1)
User.hasOne(Applicant, { foreignKey: 'user_id', as: 'applicantProfile', onDelete: 'CASCADE' });
Applicant.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Department <-> SeatAllocation (1:1)
Department.hasOne(SeatAllocation, { foreignKey: 'department_id', as: 'seatAllocation', onDelete: 'CASCADE' });
SeatAllocation.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });

// Applicant <-> Application (1:N)
Applicant.hasMany(Application, { foreignKey: 'applicant_id', as: 'applications', onDelete: 'CASCADE' });
Application.belongsTo(Applicant, { foreignKey: 'applicant_id', as: 'applicant' });

// Department <-> Application (1:N)
Department.hasMany(Application, { foreignKey: 'department_id', as: 'applications' });
Application.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });

// Application <-> Sections (1:1)
Application.hasOne(PersonalInfo, { foreignKey: 'application_id', as: 'personalInfo', onDelete: 'CASCADE' });
PersonalInfo.belongsTo(Application, { foreignKey: 'application_id', as: 'application' });

Application.hasOne(ContactInfo, { foreignKey: 'application_id', as: 'contactInfo', onDelete: 'CASCADE' });
ContactInfo.belongsTo(Application, { foreignKey: 'application_id', as: 'application' });

Application.hasOne(GuardianInfo, { foreignKey: 'application_id', as: 'guardianInfo', onDelete: 'CASCADE' });
GuardianInfo.belongsTo(Application, { foreignKey: 'application_id', as: 'application' });

Application.hasOne(AcademicInfo, { foreignKey: 'application_id', as: 'academicInfo', onDelete: 'CASCADE' });
AcademicInfo.belongsTo(Application, { foreignKey: 'application_id', as: 'application' });

Application.hasOne(ApplicationDecision, { foreignKey: 'application_id', as: 'decision', onDelete: 'CASCADE' });
ApplicationDecision.belongsTo(Application, { foreignKey: 'application_id', as: 'application' });

ApplicationDecision.belongsTo(User, { foreignKey: 'decided_by', as: 'decidedByAdmin' });

// Application <-> StatusHistory (1:N)
Application.hasMany(StatusHistory, { foreignKey: 'application_id', as: 'statusLogs', onDelete: 'CASCADE' });
StatusHistory.belongsTo(Application, { foreignKey: 'application_id', as: 'application' });
StatusHistory.belongsTo(User, { foreignKey: 'changed_by', as: 'user' });

// Application <-> Payment (1:N)
Application.hasMany(Payment, { foreignKey: 'application_id', as: 'payments', onDelete: 'CASCADE' });
Payment.belongsTo(Application, { foreignKey: 'application_id', as: 'application' });

// Applicant <-> Payment (1:N)
Applicant.hasMany(Payment, { foreignKey: 'applicant_id', as: 'payments', onDelete: 'CASCADE' });
Payment.belongsTo(Applicant, { foreignKey: 'applicant_id', as: 'applicant' });

// Sync and Seed database
export const initModelsAndSeed = async () => {
  await sequelize.sync({ alter: false });
  await Payment.sync({ alter: false });

  // Seed Admin if not present
  const adminEmail = 'admin@iemcal.com';
  const existingAdmin = await User.findOne({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('Admin@12345', 10);
    await User.create({
      email: adminEmail,
      password_hash: passwordHash,
      role: ROLES.ADMIN,
      is_active: true,
    });
    console.log('[Seed] Default admin created: admin@iemcal.com / Admin@12345');
  }

  // Seed Departments & Seats if not present
  const deptCount = await Department.count();
  if (deptCount === 0) {
    const departmentsData = [
      { code: 'CSE', name: 'Computer Science & Engineering', degree: 'B.Tech', duration_years: 4, description: 'Core computing systems, algorithms, high-performance computing, and distributed architectures.', total_seats: 120, occupied_seats: 0, available_seats: 120, status: 'AVAILABLE' },
      { code: 'CSE-AIML', name: 'CSE (Artificial Intelligence & Machine Learning)', degree: 'B.Tech', duration_years: 4, description: 'Deep learning, neural networks, natural language processing, and computer vision systems.', total_seats: 60, occupied_seats: 0, available_seats: 60, status: 'AVAILABLE' },
      { code: 'CSE-IOT-CS', name: 'CSE (IoT & Cyber Security)', degree: 'B.Tech', duration_years: 4, description: 'Connected sensor networks, embedded cryptography, industrial IoT, and defense cyber security.', total_seats: 60, occupied_seats: 0, available_seats: 60, status: 'AVAILABLE' },
      { code: 'IT', name: 'Information Technology', degree: 'B.Tech', duration_years: 4, description: 'Cloud computing, full-stack enterprise architecture, devops, and database management.', total_seats: 60, occupied_seats: 0, available_seats: 60, status: 'AVAILABLE' },
      { code: 'ECE', name: 'Electronics & Communication Engineering', degree: 'B.Tech', duration_years: 4, description: 'VLSI design, embedded systems, 5G wireless networks, and signal processing.', total_seats: 90, occupied_seats: 0, available_seats: 90, status: 'AVAILABLE' },
      { code: 'EE', name: 'Electrical Engineering', degree: 'B.Tech', duration_years: 4, description: 'Renewable energy systems, smart power grids, EV drive trains, and industrial automation.', total_seats: 60, occupied_seats: 0, available_seats: 60, status: 'AVAILABLE' },
      { code: 'MECH', name: 'Mechanical Engineering', degree: 'B.Tech', duration_years: 4, description: 'Robotics, additive manufacturing, thermodynamics, and autonomous automotive engineering.', total_seats: 60, occupied_seats: 0, available_seats: 60, status: 'AVAILABLE' },
    ];

    for (const d of departmentsData) {
      const dept = await Department.create({
        code: d.code,
        name: d.name,
        degree: d.degree,
        duration_years: d.duration_years,
        description: d.description,
        is_active: true,
      });

      await SeatAllocation.create({
        department_id: dept.id,
        total_seats: d.total_seats,
        occupied_seats: d.occupied_seats,
        available_seats: d.available_seats,
        status: d.status,
      });
    }
    console.log('[Seed] Default departments and seat allocations initialized.');
  }

  // Seed Deadline if not present
  const deadlineCount = await ApplicationDeadline.count();
  if (deadlineCount === 0) {
    const startDate = new Date();
    const endDate = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000); // 180 days in future
    await ApplicationDeadline.create({
      academic_year: '2026-2027',
      start_date: startDate,
      end_date: endDate,
      status: 'OPEN',
      announcement_notice: 'Admissions for Academic Year 2026-2027 are currently open across all engineering departments.',
    });
    console.log('[Seed] Default admission deadline initialized for 2026-2027.');
  }
};

export {
  User,
  Applicant,
  Department,
  SeatAllocation,
  ApplicationDeadline,
  Application,
  PersonalInfo,
  ContactInfo,
  GuardianInfo,
  AcademicInfo,
  ApplicationDecision,
  StatusHistory,
  Payment,
  SQLDocument,
  MongoDocument,
};
