import { Op } from 'sequelize';
import { sequelize } from '../config/db.js';
import Application from '../models/application.model.js';
import Applicant from '../models/applicant.model.js';
import User from '../models/user.model.js';
import Department from '../models/department.model.js';
import SeatAllocation from '../models/seatAllocation.model.js';
import PersonalInfo from '../models/personalInfo.model.js';
import ContactInfo from '../models/contactInfo.model.js';
import GuardianInfo from '../models/guardianInfo.model.js';
import AcademicInfo from '../models/academicInfo.model.js';
import ApplicationDecision from '../models/decision.model.js';
import StatusHistory from '../models/statusHistory.model.js';
import { SQLDocument } from '../models/document.model.js';
import AppError from '../utils/AppError.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { APPLICATION_STATUS } from '../constants/applicationStatus.js';

export class AdminService {
  /**
   * Executive Dashboard Metrics and Charts Data
   */
  static async getDashboardMetrics() {
    const totalApplications = await Application.count();
    const draftCount = await Application.count({ where: { status: APPLICATION_STATUS.DRAFT } });
    const submittedCount = await Application.count({ where: { status: APPLICATION_STATUS.SUBMITTED } });
    const underReviewCount = await Application.count({ where: { status: APPLICATION_STATUS.UNDER_REVIEW } });
    const acceptedCount = await Application.count({ where: { status: APPLICATION_STATUS.ACCEPTED } });
    const rejectedCount = await Application.count({ where: { status: APPLICATION_STATUS.REJECTED } });

    // Department Seat Allocations & counts
    const departments = await Department.findAll({
      include: [
        { model: SeatAllocation, as: 'seatAllocation' },
        { model: Application, as: 'applications', attributes: ['id', 'status'] },
      ],
    });

    const departmentStats = departments.map((dept) => {
      const appCount = dept.applications?.length || 0;
      const acceptedDept = dept.applications?.filter((a) => a.status === APPLICATION_STATUS.ACCEPTED).length || 0;
      return {
        id: dept.id,
        code: dept.code,
        name: dept.name,
        totalSeats: dept.seatAllocation?.total_seats || 0,
        occupiedSeats: dept.seatAllocation?.occupied_seats || 0,
        availableSeats: dept.seatAllocation?.available_seats || 0,
        status: dept.seatAllocation?.status || 'AVAILABLE',
        applicationCount: appCount,
        acceptedCount: acceptedDept,
      };
    });

    // Recent Decisions
    const recentDecisions = await ApplicationDecision.findAll({
      limit: 10,
      order: [['decided_at', 'DESC']],
      include: [
        {
          model: Application,
          as: 'application',
          include: [
            { model: Department, as: 'department' },
            { model: PersonalInfo, as: 'personalInfo' },
          ],
        },
        { model: User, as: 'decidedByAdmin', attributes: ['id', 'email'] },
      ],
    });

    // Recent Applications
    const recentApplications = await Application.findAll({
      limit: 10,
      order: [['created_at', 'DESC']],
      include: [
        { model: Department, as: 'department' },
        { model: PersonalInfo, as: 'personalInfo' },
      ],
    });

    return {
      overview: {
        totalApplications,
        draftCount,
        submittedCount,
        underReviewCount,
        acceptedCount,
        rejectedCount,
      },
      departmentStats,
      recentDecisions,
      recentApplications,
    };
  }

  /**
   * Search, filter, and paginate applications
   */
  static async getApplications({ status, department_id, search, page = 1, limit = 10, sort = 'created_at', order = 'DESC' }) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const where = {};
    if (status && Object.values(APPLICATION_STATUS).includes(status)) {
      where.status = status;
    }
    if (department_id) {
      where.department_id = parseInt(department_id, 10);
    }

    const applicantWhere = {};
    if (search) {
      where[Op.or] = [
        { application_id: { [Op.like]: `%${search}%` } },
        { '$personalInfo.first_name$': { [Op.like]: `%${search}%` } },
        { '$personalInfo.last_name$': { [Op.like]: `%${search}%` } },
        { '$contactInfo.email$': { [Op.like]: `%${search}%` } },
        { '$contactInfo.phone$': { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Application.findAndCountAll({
      where,
      include: [
        { model: Department, as: 'department' },
        { model: Applicant, as: 'applicant' },
        { model: PersonalInfo, as: 'personalInfo' },
        { model: ContactInfo, as: 'contactInfo' },
        { model: AcademicInfo, as: 'academicInfo' },
        { model: ApplicationDecision, as: 'decision' },
      ],
      order: [[sort, order.toUpperCase()]],
      limit: limitNum,
      offset,
      distinct: true,
    });

    return {
      total: count,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(count / limitNum),
      applications: rows,
    };
  }

  /**
   * Move application status from SUBMITTED to UNDER_REVIEW
   */
  static async markUnderReview(idOrAppId, adminId) {
    const isNumeric = !isNaN(idOrAppId);
    const whereClause = isNumeric ? { id: parseInt(idOrAppId, 10) } : { application_id: idOrAppId };

    const application = await Application.findOne({ where: whereClause });
    if (!application) {
      throw new AppError('Application not found.', 404, ERROR_CODES.NOT_FOUND);
    }

    if (application.status === APPLICATION_STATUS.DRAFT) {
      throw new AppError('Cannot review a draft application that has not been submitted by the candidate.', 400, ERROR_CODES.VALIDATION_ERROR);
    }

    if ([APPLICATION_STATUS.ACCEPTED, APPLICATION_STATUS.REJECTED].includes(application.status)) {
      throw new AppError('This application has already received a final decision.', 400, ERROR_CODES.VALIDATION_ERROR);
    }

    const previousStatus = application.status;
    await application.update({ status: APPLICATION_STATUS.UNDER_REVIEW });

    await StatusHistory.create({
      application_id: application.id,
      from_status: previousStatus,
      to_status: APPLICATION_STATUS.UNDER_REVIEW,
      changed_by: adminId,
      remarks: 'Application moved to active review under admissions committee.',
    });

    return application;
  }

  /**
   * Accept application with strict transaction and row lock on seat allocation
   */
  static async acceptApplication(idOrAppId, adminId, notes = '') {
    const isNumeric = !isNaN(idOrAppId);
    const whereClause = isNumeric ? { id: parseInt(idOrAppId, 10) } : { application_id: idOrAppId };

    const t = await sequelize.transaction();

    try {
      const application = await Application.findOne({
        where: whereClause,
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      if (!application) {
        throw new AppError('Application not found.', 404, ERROR_CODES.NOT_FOUND);
      }

      if (application.status === APPLICATION_STATUS.ACCEPTED) {
        throw new AppError('Application is already accepted.', 400, ERROR_CODES.CONFLICT);
      }

      if (application.status === APPLICATION_STATUS.REJECTED) {
        throw new AppError('Application is currently marked as rejected. A decided application cannot be accepted directly.', 400, ERROR_CODES.VALIDATION_ERROR);
      }

      // Check Seat Allocation with row lock
      const seatAllocation = await SeatAllocation.findOne({
        where: { department_id: application.department_id },
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      if (!seatAllocation || seatAllocation.available_seats <= 0) {
        throw new AppError(
          'Admission cannot be offered. No available seats remaining in this department.',
          400,
          ERROR_CODES.NO_SEATS_AVAILABLE
        );
      }

      // Decrement available seats, increment occupied seats
      const newAvailable = seatAllocation.available_seats - 1;
      const newOccupied = seatAllocation.occupied_seats + 1;
      const newStatus = newAvailable === 0 ? 'FULL' : newAvailable <= 10 ? 'FILLING_FAST' : 'AVAILABLE';

      await seatAllocation.update(
        {
          available_seats: newAvailable,
          occupied_seats: newOccupied,
          status: newStatus,
        },
        { transaction: t }
      );

      const previousStatus = application.status;
      await application.update(
        { status: APPLICATION_STATUS.ACCEPTED },
        { transaction: t }
      );

      // Record Decision
      await ApplicationDecision.create(
        {
          application_id: application.id,
          decision: 'ACCEPTED',
          rejection_reason: null,
          decided_by: adminId,
          notes: notes || 'Candidate offered provisional admission based on merit.',
        },
        { transaction: t }
      );

      // Record Status History
      await StatusHistory.create(
        {
          application_id: application.id,
          from_status: previousStatus,
          to_status: APPLICATION_STATUS.ACCEPTED,
          changed_by: adminId,
          remarks: `Admission offered. Department seats updated (Available: ${newAvailable}).`,
        },
        { transaction: t }
      );

      await t.commit();
      return application;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Flag application for candidate correction / re-upload
   */
  static async flagApplication(idOrAppId, adminId, reason, notes = '') {
    if (!reason || reason.trim() === '') {
      throw new AppError('A valid correction remark/reason is mandatory when flagging an application.', 400, ERROR_CODES.VALIDATION_ERROR);
    }

    const isNumeric = !isNaN(idOrAppId);
    const whereClause = isNumeric ? { id: parseInt(idOrAppId, 10) } : { application_id: idOrAppId };

    const t = await sequelize.transaction();

    try {
      const application = await Application.findOne({
        where: whereClause,
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      if (!application) {
        throw new AppError('Application not found.', 404, ERROR_CODES.NOT_FOUND);
      }

      if (application.status === APPLICATION_STATUS.DRAFT) {
        throw new AppError('Cannot flag a draft application that has not been submitted by candidate.', 400, ERROR_CODES.VALIDATION_ERROR);
      }

      if (application.status === APPLICATION_STATUS.ACCEPTED) {
        throw new AppError('This application has already received an acceptance decision and seat allocation.', 400, ERROR_CODES.VALIDATION_ERROR);
      }

      const previousStatus = application.status;
      await application.update(
        { status: APPLICATION_STATUS.FLAGGED },
        { transaction: t }
      );

      // Record in ApplicationDecision (upsert)
      const existingDecision = await ApplicationDecision.findOne({
        where: { application_id: application.id },
        transaction: t,
      });

      if (existingDecision) {
        await existingDecision.update(
          {
            decision: 'FLAGGED',
            rejection_reason: reason.trim(),
            decided_by: adminId,
            notes: notes || 'Flagged for candidate correction / document re-upload.',
          },
          { transaction: t }
        );
      } else {
        await ApplicationDecision.create(
          {
            application_id: application.id,
            decision: 'FLAGGED',
            rejection_reason: reason.trim(),
            decided_by: adminId,
            notes: notes || 'Flagged for candidate correction / document re-upload.',
          },
          { transaction: t }
        );
      }

      await StatusHistory.create(
        {
          application_id: application.id,
          from_status: previousStatus,
          to_status: APPLICATION_STATUS.FLAGGED,
          changed_by: adminId,
          remarks: `Flagged for revision: ${reason.trim()}`,
        },
        { transaction: t }
      );

      await t.commit();
      return application;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Reject application with required non-empty reason
   */
  static async rejectApplication(idOrAppId, adminId, reason, notes = '') {
    if (!reason || reason.trim() === '') {
      throw new AppError('A valid rejection reason is mandatory.', 400, ERROR_CODES.VALIDATION_ERROR);
    }

    const isNumeric = !isNaN(idOrAppId);
    const whereClause = isNumeric ? { id: parseInt(idOrAppId, 10) } : { application_id: idOrAppId };

    const t = await sequelize.transaction();

    try {
      const application = await Application.findOne({
        where: whereClause,
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      if (!application) {
        throw new AppError('Application not found.', 404, ERROR_CODES.NOT_FOUND);
      }

      if (application.status === APPLICATION_STATUS.ACCEPTED) {
        throw new AppError('This application was already accepted. Modifying finalized acceptances requires administrative overrides.', 400, ERROR_CODES.VALIDATION_ERROR);
      }

      const previousStatus = application.status;
      await application.update(
        { status: APPLICATION_STATUS.REJECTED },
        { transaction: t }
      );

      await ApplicationDecision.create(
        {
          application_id: application.id,
          decision: 'REJECTED',
          rejection_reason: reason.trim(),
          decided_by: adminId,
          notes: notes || 'Application did not meet admission criteria.',
        },
        { transaction: t }
      );

      await StatusHistory.create(
        {
          application_id: application.id,
          from_status: previousStatus,
          to_status: APPLICATION_STATUS.REJECTED,
          changed_by: adminId,
          remarks: `Application rejected. Reason: ${reason.trim()}`,
        },
        { transaction: t }
      );

      await t.commit();
      return application;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * List all registered applicants
   */
  static async getApplicantsList({ search, page = 1, limit = 20 }) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const where = {};
    if (search) {
      where[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
        { '$user.email$': { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Applicant.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'email', 'created_at', 'is_active'] },
        { model: Application, as: 'applications', include: [{ model: Department, as: 'department' }] },
      ],
      order: [['created_at', 'DESC']],
      limit: limitNum,
      offset,
      distinct: true,
    });

    return {
      total: count,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(count / limitNum),
      applicants: rows,
    };
  }

  /**
   * Generate comprehensive admissions report
   */
  static async getReports() {
    const departments = await Department.findAll({
      include: [
        { model: SeatAllocation, as: 'seatAllocation' },
        { model: Application, as: 'applications' },
      ],
    });

    const report = departments.map((d) => {
      const total = d.applications?.length || 0;
      const accepted = d.applications?.filter((a) => a.status === APPLICATION_STATUS.ACCEPTED).length || 0;
      const rejected = d.applications?.filter((a) => a.status === APPLICATION_STATUS.REJECTED).length || 0;
      const underReview = d.applications?.filter((a) => a.status === APPLICATION_STATUS.UNDER_REVIEW).length || 0;
      const submitted = d.applications?.filter((a) => a.status === APPLICATION_STATUS.SUBMITTED).length || 0;
      const draft = d.applications?.filter((a) => a.status === APPLICATION_STATUS.DRAFT).length || 0;

      return {
        departmentCode: d.code,
        departmentName: d.name,
        totalSeats: d.seatAllocation?.total_seats || 0,
        occupiedSeats: d.seatAllocation?.occupied_seats || 0,
        availableSeats: d.seatAllocation?.available_seats || 0,
        fillRate: d.seatAllocation?.total_seats
          ? Math.round((d.seatAllocation.occupied_seats / d.seatAllocation.total_seats) * 100)
          : 0,
        applications: {
          total,
          accepted,
          rejected,
          underReview,
          submitted,
          draft,
        },
      };
    });

    return report;
  }
}

export default AdminService;
