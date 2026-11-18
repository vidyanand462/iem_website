import { sequelize } from '../config/db.js';
import Application from '../models/application.model.js';
import Applicant from '../models/applicant.model.js';
import Department from '../models/department.model.js';
import PersonalInfo from '../models/personalInfo.model.js';
import ContactInfo from '../models/contactInfo.model.js';
import GuardianInfo from '../models/guardianInfo.model.js';
import AcademicInfo from '../models/academicInfo.model.js';
import ApplicationDecision from '../models/decision.model.js';
import StatusHistory from '../models/statusHistory.model.js';
import Payment from '../models/payment.model.js';
import { SQLDocument } from '../models/document.model.js';
import { generateApplicationId } from '../utils/applicationId.js';
import AppError from '../utils/AppError.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { APPLICATION_STATUS, isValidTransition } from '../constants/applicationStatus.js';
import { ROLES } from '../constants/roles.js';

const formatCapName = (val) => {
  if (!val) return '';
  const trimmed = String(val).trim();
  const noNumbers = trimmed.replace(/[0-9]/g, '');
  const cleaned = noNumbers.replace(/[^A-Za-z\s.'-]/g, '').replace(/^\s+/, '');
  if (!cleaned) return '';
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

export class ApplicationService {
  /**
   * Helper: verify ownership or admin privilege
   */
  static async verifyApplicationAccess(appRecord, user) {
    if (!appRecord) {
      throw new AppError('Application not found.', 404, ERROR_CODES.NOT_FOUND);
    }

    if (user.role === ROLES.ADMIN) {
      return true;
    }

    const applicant = await Applicant.findOne({ where: { user_id: user.id } });
    if (!applicant || appRecord.applicant_id !== applicant.id) {
      throw new AppError('Access denied. You can only view or manage your own applications.', 403, ERROR_CODES.UNAUTHORIZED);
    }

    return true;
  }

  /**
   * Create a new draft application
   */
  static async createApplication(userId, departmentId) {
    const applicant = await Applicant.findOne({ where: { user_id: userId } });
    if (!applicant) {
      throw new AppError('Applicant profile not found for this account.', 404, ERROR_CODES.NOT_FOUND);
    }

    const dept = await Department.findByPk(departmentId);
    if (!dept || !dept.is_active) {
      throw new AppError('The selected department does not exist or is not currently accepting admissions.', 400, ERROR_CODES.VALIDATION_ERROR);
    }

    // Generate unique ID in specific institutional non-repeating pattern (e.g. IEM-2026-CSE-00001)
    const appId = await generateApplicationId(dept.code);

    const application = await Application.create({
      application_id: appId,
      applicant_id: applicant.id,
      department_id: departmentId,
      status: APPLICATION_STATUS.DRAFT,
      current_step: 1,
    });

    // Record initial status history
    await StatusHistory.create({
      application_id: application.id,
      from_status: null,
      to_status: APPLICATION_STATUS.DRAFT,
      changed_by: userId,
      remarks: 'Application initiated in draft state.',
    });

    // Auto-populate default personal info from profile if not filled
    await PersonalInfo.create({
      application_id: application.id,
      first_name: applicant.first_name,
      last_name: applicant.last_name,
      date_of_birth: '2005-01-01',
      gender: 'MALE',
      nationality: 'Indian',
      category: 'GENERAL',
    });

    // Auto-populate contact info
    await ContactInfo.create({
      application_id: application.id,
      email: (await applicant.getUser())?.email || '',
      phone: applicant.phone,
      address_line1: '',
      city: '',
      state: '',
      pincode: '',
    });

    return this.getApplicationById(application.id, { id: userId, role: ROLES.APPLICANT });
  }

  /**
   * Get application by ID or application_id with all related sections
   */
  static async getApplicationById(idOrAppId, user) {
    const isNumeric = !isNaN(idOrAppId);
    const whereClause = isNumeric ? { id: parseInt(idOrAppId, 10) } : { application_id: idOrAppId };

    const application = await Application.findOne({
      where: whereClause,
      include: [
        { model: Department, as: 'department' },
        { model: Applicant, as: 'applicant' },
        { model: PersonalInfo, as: 'personalInfo' },
        { model: ContactInfo, as: 'contactInfo' },
        { model: GuardianInfo, as: 'guardianInfo' },
        { model: AcademicInfo, as: 'academicInfo' },
        {
          model: ApplicationDecision,
          as: 'decision',
        },
        {
          model: Payment,
          as: 'payments',
        },
        {
          model: StatusHistory,
          as: 'statusLogs',
          order: [['created_at', 'ASC']],
        },
      ],
    });

    await this.verifyApplicationAccess(application, user);

    // Fetch documents
    const documents = await SQLDocument.findAll({
      where: { application_id: application.application_id },
    });

    const plain = application.toJSON();
    plain.documents = documents;

    return plain;
  }

  /**
   * List all applications for the current applicant
   */
  static async getMyApplications(userId) {
    const applicant = await Applicant.findOne({ where: { user_id: userId } });
    if (!applicant) {
      return [];
    }

    const applications = await Application.findAll({
      where: { applicant_id: applicant.id },
      include: [
        { model: Department, as: 'department' },
        { model: ApplicationDecision, as: 'decision' },
        { model: Payment, as: 'payments' },
      ],
      order: [['created_at', 'DESC']],
    });

    return applications;
  }

  /**
   * Save / Update Personal Information
   */
  static async updatePersonalInfo(idOrAppId, userId, data) {
    const app = await this.getApplicationById(idOrAppId, { id: userId, role: ROLES.APPLICANT });

    if (app.status !== APPLICATION_STATUS.DRAFT && app.status !== APPLICATION_STATUS.FLAGGED) {
      throw new AppError('Cannot modify an application that is not in draft or flagged state.', 400, ERROR_CODES.VALIDATION_ERROR);
    }

    const [record] = await PersonalInfo.upsert({
      application_id: app.id,
      first_name: formatCapName(data.first_name),
      middle_name: data.middle_name ? formatCapName(data.middle_name) : null,
      last_name: formatCapName(data.last_name),
      date_of_birth: data.date_of_birth,
      gender: data.gender,
      blood_group: data.blood_group ? data.blood_group.trim().toUpperCase() : null,
      category: data.category || 'GENERAL',
      nationality: data.nationality || 'Indian',
      aadhar_number: data.aadhar_number || null,
    });

    if (app.current_step < 2) {
      await Application.update({ current_step: 2 }, { where: { id: app.id } });
    }

    return record;
  }

  /**
   * Save / Update Contact Information
   */
  static async updateContactInfo(idOrAppId, userId, data) {
    const app = await this.getApplicationById(idOrAppId, { id: userId, role: ROLES.APPLICANT });

    if (app.status !== APPLICATION_STATUS.DRAFT && app.status !== APPLICATION_STATUS.FLAGGED) {
      throw new AppError('Cannot modify an application that is not in draft or flagged state.', 400, ERROR_CODES.VALIDATION_ERROR);
    }

    const [record] = await ContactInfo.upsert({
      application_id: app.id,
      email: data.email,
      phone: data.phone,
      alternate_phone: data.alternate_phone || null,
      address_line1: data.address_line1,
      address_line2: data.address_line2 || null,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      country: data.country || 'India',
    });

    if (app.current_step < 3) {
      await Application.update({ current_step: 3 }, { where: { id: app.id } });
    }

    return record;
  }

  /**
   * Save / Update Guardian Information
   */
  static async updateGuardianInfo(idOrAppId, userId, data) {
    const app = await this.getApplicationById(idOrAppId, { id: userId, role: ROLES.APPLICANT });

    if (app.status !== APPLICATION_STATUS.DRAFT && app.status !== APPLICATION_STATUS.FLAGGED) {
      throw new AppError('Cannot modify an application that is not in draft or flagged state.', 400, ERROR_CODES.VALIDATION_ERROR);
    }

    const [record] = await GuardianInfo.upsert({
      application_id: app.id,
      father_name: formatCapName(data.father_name),
      father_occupation: data.father_occupation || null,
      father_phone: data.father_phone || null,
      mother_name: formatCapName(data.mother_name),
      mother_occupation: data.mother_occupation || null,
      mother_phone: data.mother_phone || null,
      guardian_name: data.guardian_name ? formatCapName(data.guardian_name) : null,
      guardian_relation: data.guardian_relation || null,
      annual_income: data.annual_income || null,
    });

    if (app.current_step < 4) {
      await Application.update({ current_step: 4 }, { where: { id: app.id } });
    }

    return record;
  }

  /**
   * Save / Update Academic Information
   */
  static async updateAcademicInfo(idOrAppId, userId, data) {
    const app = await this.getApplicationById(idOrAppId, { id: userId, role: ROLES.APPLICANT });

    if (app.status !== APPLICATION_STATUS.DRAFT && app.status !== APPLICATION_STATUS.FLAGGED) {
      throw new AppError('Cannot modify an application that is not in draft or flagged state.', 400, ERROR_CODES.VALIDATION_ERROR);
    }

    const [record] = await AcademicInfo.upsert({
      application_id: app.id,
      tenth_board: data.tenth_board,
      tenth_school: data.tenth_school,
      tenth_year: parseInt(data.tenth_year, 10),
      tenth_percentage: parseFloat(data.tenth_percentage),
      twelfth_board: data.twelfth_board,
      twelfth_school: data.twelfth_school,
      twelfth_year: parseInt(data.twelfth_year, 10),
      twelfth_percentage: parseFloat(data.twelfth_percentage),
      physics_marks: data.physics_marks ? parseFloat(data.physics_marks) : null,
      chemistry_marks: data.chemistry_marks ? parseFloat(data.chemistry_marks) : null,
      maths_marks: data.maths_marks ? parseFloat(data.maths_marks) : null,
      entrance_exam_name: data.entrance_exam_name || null,
      entrance_roll_number: data.entrance_roll_number || null,
      entrance_rank: data.entrance_rank ? parseInt(data.entrance_rank, 10) : null,
    });

    if (app.current_step < 5) {
      await Application.update({ current_step: 5 }, { where: { id: app.id } });
    }

    return record;
  }

  /**
   * Final Submit Application
   */
  static async submitApplication(idOrAppId, userId) {
    const app = await this.getApplicationById(idOrAppId, { id: userId, role: ROLES.APPLICANT });

    if (app.status !== APPLICATION_STATUS.DRAFT && app.status !== APPLICATION_STATUS.FLAGGED) {
      throw new AppError('This application has already been submitted and cannot be modified.', 400, ERROR_CODES.VALIDATION_ERROR);
    }

    // Validate completeness of all mandatory sections
    const missing = [];
    if (!app.personalInfo?.first_name || !app.personalInfo?.date_of_birth) missing.push('Personal Details');
    if (!app.contactInfo?.address_line1 || !app.contactInfo?.city || !app.contactInfo?.pincode) missing.push('Contact Details');
    if (!app.guardianInfo?.father_name || !app.guardianInfo?.mother_name) missing.push('Guardian Details');
    if (!app.academicInfo?.tenth_board || !app.academicInfo?.twelfth_board) missing.push('Academic Records');

    // Check mandatory documents (at least photograph and marksheets)
    const docs = await SQLDocument.findAll({ where: { application_id: app.application_id } });
    const hasPhoto = docs.some((d) => d.document_type === 'photograph');
    const hasId = docs.some((d) => d.document_type === 'id_proof');
    const hasMarksheet = docs.some((d) => d.document_type === 'marksheet_12th' || d.document_type === 'marksheet_10th');

    if (!hasPhoto || !hasId || !hasMarksheet) {
      missing.push('Mandatory Documents (Photograph, ID Proof, and Marksheet)');
    }

    if (missing.length > 0) {
      throw new AppError(
        `Cannot submit incomplete application. Please complete: ${missing.join(', ')}.`,
        422,
        ERROR_CODES.VALIDATION_ERROR,
        missing
      );
    }

    const t = await sequelize.transaction();

    try {
      const submittedAt = new Date();

      await Application.update(
        {
          status: APPLICATION_STATUS.SUBMITTED,
          submitted_at: submittedAt,
          current_step: 7,
        },
        { where: { id: app.id }, transaction: t }
      );

      const isResubmission = app.status === APPLICATION_STATUS.FLAGGED;
      await StatusHistory.create(
        {
          application_id: app.id,
          from_status: app.status,
          to_status: APPLICATION_STATUS.SUBMITTED,
          changed_by: userId,
          remarks: isResubmission
            ? 'Corrected application & documents resubmitted by candidate after revision.'
            : 'Application submitted successfully by candidate for review.',
        },
        { transaction: t }
      );

      await t.commit();

      return this.getApplicationById(app.id, { id: userId, role: ROLES.APPLICANT });
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Get status & timeline details
   */
  static async getApplicationStatus(idOrAppId, user) {
    const app = await this.getApplicationById(idOrAppId, user);

    const steps = [
      {
        key: APPLICATION_STATUS.DRAFT,
        label: 'Application Created',
        date: app.created_at,
        completed: true,
      },
      {
        key: APPLICATION_STATUS.SUBMITTED,
        label: 'Submitted for Review',
        date: app.submitted_at,
        completed: app.status !== APPLICATION_STATUS.DRAFT,
      },
      {
        key: APPLICATION_STATUS.UNDER_REVIEW,
        label: 'Admissions Committee Review',
        date: app.statusLogs?.find((l) => l.to_status === APPLICATION_STATUS.UNDER_REVIEW)?.created_at || null,
        completed: [APPLICATION_STATUS.UNDER_REVIEW, APPLICATION_STATUS.ACCEPTED, APPLICATION_STATUS.REJECTED].includes(app.status),
      },
      {
        key: app.status === APPLICATION_STATUS.REJECTED ? APPLICATION_STATUS.REJECTED : APPLICATION_STATUS.ACCEPTED,
        label: app.status === APPLICATION_STATUS.REJECTED ? 'Application Rejected' : 'Admission Offer Accepted',
        date: app.decision?.decided_at || null,
        completed: [APPLICATION_STATUS.ACCEPTED, APPLICATION_STATUS.REJECTED].includes(app.status),
        rejectionReason: app.decision?.rejection_reason || null,
      },
    ];

    return {
      applicationId: app.application_id,
      department: app.department?.name,
      degree: app.department?.degree,
      currentStatus: app.status,
      submittedAt: app.submitted_at,
      decision: app.decision,
      payments: app.payments || [],
      timeline: steps,
      statusLogs: app.statusLogs,
    };
  }

  /**
   * Get Acknowledgement Slip Data
   */
  static async getApplicationAcknowledgement(idOrAppId, user) {
    const app = await this.getApplicationById(idOrAppId, user);

    if (app.status === APPLICATION_STATUS.DRAFT) {
      throw new AppError('Acknowledgement is only available after formal application submission.', 400, ERROR_CODES.VALIDATION_ERROR);
    }

    return {
      institutionName: 'Institute of Engineering & Management (IEM), Kolkata',
      campusAddress: 'Sector V, Salt Lake Electronics Complex, Kolkata, West Bengal 700091',
      applicationId: app.application_id,
      submissionDate: app.submitted_at,
      status: app.status,
      candidate: {
        fullName: `${app.personalInfo?.first_name || ''} ${app.personalInfo?.last_name || ''}`.trim(),
        email: app.contactInfo?.email || '',
        phone: app.contactInfo?.phone || '',
        category: app.personalInfo?.category || 'GENERAL',
        gender: app.personalInfo?.gender || '',
        dob: app.personalInfo?.date_of_birth || '',
        bloodGroup: app.personalInfo?.blood_group || 'N/A',
      },
      program: {
        departmentName: app.department?.name,
        code: app.department?.code,
        degree: app.department?.degree,
        duration: `${app.department?.duration_years} Years`,
      },
      academicRecord: {
        tenthBoard: app.academicInfo?.tenth_board,
        tenthPercentage: `${app.academicInfo?.tenth_percentage}%`,
        twelfthBoard: app.academicInfo?.twelfth_board,
        twelfthPercentage: `${app.academicInfo?.twelfth_percentage}%`,
        entranceExam: app.academicInfo?.entrance_exam_name || 'N/A',
        rank: app.academicInfo?.entrance_rank || 'N/A',
      },
      payments: app.payments || [],
      importantNotice: [
        'Please preserve this acknowledgement slip and application ID for all future counseling communications.',
        'Seat allocation is subject to document verification and minimum eligibility criteria stipulated by IEM Kolkata and MAKAUT/AICTE.',
        'Selected candidates will receive further counseling date intimations via their registered email address.',
      ],
    };
  }
}

export default ApplicationService;
