import {
  Application,
  Applicant,
  Department,
  PersonalInfo,
  ContactInfo,
  GuardianInfo,
  AcademicInfo,
  ApplicationDecision,
  StatusHistory,
  Payment,
  SQLDocument,
} from '../models/index.js';
import { APPLICATION_STATUS } from '../constants/applicationStatus.js';
import { ROLES } from '../constants/roles.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { AppError } from '../utils/AppError.js';
import { sequelize } from '../config/db.js';

export class PaymentService {
  /**
   * Helper: verify user access to application
   */
  static async verifyApplicationAccess(application, user) {
    if (!application) {
      throw new AppError('Application record not found.', 404, ERROR_CODES.NOT_FOUND);
    }
    if (user.role === ROLES.ADMIN) {
      return true;
    }
    const applicant = await Applicant.findOne({ where: { user_id: user.id } });
    if (!applicant || applicant.id !== application.applicant_id) {
      throw new AppError('Unauthorized access to application payments.', 403, ERROR_CODES.FORBIDDEN);
    }
    return applicant;
  }

  /**
   * Pay Application Form Filling Fee (₹500)
   */
  static async payApplicationFee(idOrAppId, user, paymentData = {}) {
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
        { model: ApplicationDecision, as: 'decision' },
      ],
    });

    const applicant = await this.verifyApplicationAccess(application, user);

    // Check if application fee already paid
    const existingPayment = await Payment.findOne({
      where: {
        application_id: application.id,
        payment_type: 'APPLICATION_FEE',
        status: 'SUCCESS',
      },
    });

    if (existingPayment) {
      return {
        alreadyPaid: true,
        payment: existingPayment,
        application,
        message: 'Application form fee of ₹500 was already paid successfully.',
      };
    }

    const t = await sequelize.transaction();
    try {
      const txnSuffix = `${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const transactionId = `TXN-IEM-APP-${txnSuffix}`;
      const paymentId = `PAY-APP-${application.id}-${Date.now()}`;
      const amount = 500.00;
      const paymentMethod = paymentData.paymentMethod || 'UPI';

      const payment = await Payment.create(
        {
          payment_id: paymentId,
          application_id: application.id,
          applicant_id: application.applicant_id,
          payment_type: 'APPLICATION_FEE',
          amount: amount,
          currency: 'INR',
          transaction_id: transactionId,
          payment_method: paymentMethod,
          payment_details: {
            method: paymentMethod,
            provider: paymentData.provider || 'BillDesk / Razorpay Secure Gateway',
            upiId: paymentData.upiId || 'candidate@upi',
            cardLast4: paymentData.cardLast4 || '4242',
            bankName: paymentData.bankName || 'State Bank of India',
            timestamp: new Date().toISOString(),
          },
          status: 'SUCCESS',
          paid_at: new Date(),
        },
        { transaction: t }
      );

      // Transition application to SUBMITTED if in DRAFT or FLAGGED
      const isDraftOrFlagged = application.status === APPLICATION_STATUS.DRAFT || application.status === APPLICATION_STATUS.FLAGGED;
      if (isDraftOrFlagged) {
        const submittedAt = new Date();
        const prevStatus = application.status;
        await application.update(
          {
            status: APPLICATION_STATUS.SUBMITTED,
            submitted_at: submittedAt,
            current_step: 7,
          },
          { transaction: t }
        );

        await StatusHistory.create(
          {
            application_id: application.id,
            from_status: prevStatus,
            to_status: APPLICATION_STATUS.SUBMITTED,
            changed_by: user.id,
            remarks: `Application fee of ₹500 paid successfully (Txn ID: ${transactionId}). Application submitted for Admissions Committee review.`,
          },
          { transaction: t }
        );
      }

      await t.commit();

      const updatedApp = await Application.findByPk(application.id, {
        include: [
          { model: Department, as: 'department' },
          { model: Applicant, as: 'applicant' },
          { model: PersonalInfo, as: 'personalInfo' },
          { model: ContactInfo, as: 'contactInfo' },
          { model: GuardianInfo, as: 'guardianInfo' },
          { model: AcademicInfo, as: 'academicInfo' },
          { model: ApplicationDecision, as: 'decision' },
          { model: Payment, as: 'payments' },
        ],
      });

      return {
        alreadyPaid: false,
        payment,
        application: updatedApp,
        message: 'Application form fee of ₹500 paid successfully. Form submitted!',
      };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  /**
   * Pay Admission Fee (₹1,20,000) after acceptance
   */
  static async payAdmissionFee(idOrAppId, user, paymentData = {}) {
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
        { model: ApplicationDecision, as: 'decision' },
      ],
    });

    await this.verifyApplicationAccess(application, user);

    // Validate that application is ACCEPTED
    if (application.status !== APPLICATION_STATUS.ACCEPTED) {
      throw new AppError(
        'Admission fee can only be paid after your application is accepted by the Admissions Committee.',
        400,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    // Check if admission fee already paid
    const existingPayment = await Payment.findOne({
      where: {
        application_id: application.id,
        payment_type: 'ADMISSION_FEE',
        status: 'SUCCESS',
      },
    });

    if (existingPayment) {
      return {
        alreadyPaid: true,
        payment: existingPayment,
        application,
        message: 'Admission fee of ₹1,20,000 was already paid successfully.',
      };
    }

    const t = await sequelize.transaction();
    try {
      const txnSuffix = `${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const transactionId = `TXN-IEM-ADM-${txnSuffix}`;
      const paymentId = `PAY-ADM-${application.id}-${Date.now()}`;
      const amount = 120000.00;
      const paymentMethod = paymentData.paymentMethod || 'NET_BANKING';

      const payment = await Payment.create(
        {
          payment_id: paymentId,
          application_id: application.id,
          applicant_id: application.applicant_id,
          payment_type: 'ADMISSION_FEE',
          amount: amount,
          currency: 'INR',
          transaction_id: transactionId,
          payment_method: paymentMethod,
          payment_details: {
            method: paymentMethod,
            provider: paymentData.provider || 'BillDesk / HDFC Payment Gateway',
            bankName: paymentData.bankName || 'HDFC Bank',
            upiId: paymentData.upiId || null,
            cardLast4: paymentData.cardLast4 || '8899',
            challanNumber: paymentData.challanNumber || null,
            timestamp: new Date().toISOString(),
          },
          status: 'SUCCESS',
          paid_at: new Date(),
        },
        { transaction: t }
      );

      await StatusHistory.create(
        {
          application_id: application.id,
          from_status: application.status,
          to_status: application.status,
          changed_by: user.id,
          remarks: `Provisional admission fee of ₹1,20,000 paid successfully (Txn ID: ${transactionId}). Seat officially confirmed.`,
        },
        { transaction: t }
      );

      await t.commit();

      const updatedApp = await Application.findByPk(application.id, {
        include: [
          { model: Department, as: 'department' },
          { model: Applicant, as: 'applicant' },
          { model: PersonalInfo, as: 'personalInfo' },
          { model: ContactInfo, as: 'contactInfo' },
          { model: GuardianInfo, as: 'guardianInfo' },
          { model: AcademicInfo, as: 'academicInfo' },
          { model: ApplicationDecision, as: 'decision' },
          { model: Payment, as: 'payments' },
        ],
      });

      return {
        alreadyPaid: false,
        payment,
        application: updatedApp,
        message: 'Provisional admission fee of ₹1,20,000 paid successfully! Seat confirmed.',
      };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  /**
   * Get all payments for an application
   */
  static async getPaymentsForApplication(idOrAppId, user) {
    const isNumeric = !isNaN(idOrAppId);
    const whereClause = isNumeric ? { id: parseInt(idOrAppId, 10) } : { application_id: idOrAppId };

    const application = await Application.findOne({ where: whereClause });
    await this.verifyApplicationAccess(application, user);

    const payments = await Payment.findAll({
      where: { application_id: application.id },
      order: [['created_at', 'ASC']],
    });

    return payments;
  }

  /**
   * Get Official Admission Letter Data
   */
  static async getAdmissionLetterData(idOrAppId, user) {
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
        { model: ApplicationDecision, as: 'decision' },
        { model: Payment, as: 'payments' },
      ],
    });

    await this.verifyApplicationAccess(application, user);

    if (application.status !== APPLICATION_STATUS.ACCEPTED) {
      throw new AppError(
        'Admission offer letter is only available for accepted applications.',
        400,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    // Check admission fee payment
    const admissionPayment = application.payments?.find(
      (p) => p.payment_type === 'ADMISSION_FEE' && p.status === 'SUCCESS'
    );

    if (!admissionPayment) {
      throw new AppError(
        'Admission letter is generated only after payment of the provisional admission fee of ₹1,20,000.',
        400,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    const appFeePayment = application.payments?.find(
      (p) => p.payment_type === 'APPLICATION_FEE' && p.status === 'SUCCESS'
    );

    const rollNumber = `2026${application.department?.code || 'BTECH'}${String(application.id).padStart(4, '0')}`;
    const letterRef = `IEM/ADM/2026/${application.department?.code || 'ENG'}/${String(application.id).padStart(5, '0')}`;

    return {
      institution: {
        name: 'Institute of Engineering & Management (IEM), Kolkata',
        tagline: 'Good Education, Good Jobs',
        campus: 'Management House, D-1, Sector-V, Salt Lake Electronics Complex, Kolkata - 700091, West Bengal, India',
        phone: '+91 33 2357 2059 / +91 33 2357 2995',
        email: 'admissions@iemcal.com',
        website: 'https://iem.edu.in',
        affiliations: 'Affiliated to MAKAUT (formerly WBUT), Approved by AICTE, Accredited by NAAC with Grade "A" & NBA',
      },
      letterReference: letterRef,
      issueDate: new Date().toISOString(),
      rollNumber,
      candidate: {
        fullName: `${application.personalInfo?.first_name || ''} ${application.personalInfo?.last_name || ''}`.trim() || application.applicant?.first_name,
        applicationId: application.application_id,
        fatherName: application.guardianInfo?.father_name || 'N/A',
        motherName: application.guardianInfo?.mother_name || 'N/A',
        dob: application.personalInfo?.date_of_birth,
        gender: application.personalInfo?.gender,
        category: application.personalInfo?.category || 'GENERAL',
        bloodGroup: application.personalInfo?.blood_group || 'N/A',
        email: application.contactInfo?.email || application.applicant?.email,
        phone: application.contactInfo?.phone,
        address: `${application.contactInfo?.address_line1 || ''}, ${application.contactInfo?.city || ''}, ${application.contactInfo?.state || ''} - ${application.contactInfo?.pincode || ''}`,
      },
      program: {
        departmentName: application.department?.name,
        code: application.department?.code,
        degree: application.department?.degree,
        duration: `${application.department?.duration_years} Years (8 Semesters)`,
        academicSession: '2026-2027',
        seatCategory: 'General / Central Merit Allocation',
      },
      academicRecords: {
        tenthBoard: application.academicInfo?.tenth_board,
        tenthPercentage: application.academicInfo?.tenth_percentage,
        twelfthBoard: application.academicInfo?.twelfth_board,
        twelfthPercentage: application.academicInfo?.twelfth_percentage,
        entranceExam: application.academicInfo?.entrance_exam_name || 'WBJEE / JEE Main',
        entranceRank: application.academicInfo?.entrance_rank || 'N/A',
      },
      payments: {
        applicationFee: {
          amount: 500,
          transactionId: appFeePayment?.transaction_id || 'EXEMPT/PAID',
          date: appFeePayment?.paid_at || application.submitted_at,
          status: 'PAID',
        },
        admissionFee: {
          amount: 120000,
          transactionId: admissionPayment.transaction_id,
          date: admissionPayment.paid_at,
          paymentMethod: admissionPayment.payment_method,
          status: 'PAID & CONFIRMED',
        },
      },
      reportingInstructions: [
        'Report to the Central Admissions Cell, IEM Ashram Building, GN-34/2, Sector-V, Salt Lake, Kolkata 700091 on or before July 25, 2026 at 10:00 AM.',
        'Carry 4 self-attested copies of Class 10th and 12th original marksheets and pass certificates for physical document verification.',
        'Carry original Entrance Examination (WBJEE / JEE Main) Rank Card and Admit Card.',
        'Carry Original Aadhaar Card and 6 recent passport-size colour photographs.',
        'Carry Medical Fitness Certificate and Blood Group Certificate issued by a registered medical practitioner.',
        'Orientation and commencement of 1st Semester academic sessions shall begin from August 1, 2026.',
      ],
      signatories: {
        deanName: 'Prof. (Dr.) Satyajit Chakrabarti',
        deanTitle: 'Dean of Admissions, IEM Kolkata',
        directorName: 'Prof. (Dr.) A. K. Nayak',
        directorTitle: 'Principal & Director, IEM Kolkata',
      },
    };
  }

  /**
   * Get Official Payment Proof Data (Money Receipt)
   */
  static async getPaymentProofData(idOrAppId, user) {
    const isNumeric = !isNaN(idOrAppId);
    const whereClause = isNumeric ? { id: parseInt(idOrAppId, 10) } : { application_id: idOrAppId };

    const application = await Application.findOne({
      where: whereClause,
      include: [
        { model: Department, as: 'department' },
        { model: Applicant, as: 'applicant' },
        { model: PersonalInfo, as: 'personalInfo' },
        { model: ContactInfo, as: 'contactInfo' },
        { model: Payment, as: 'payments' },
      ],
    });

    await this.verifyApplicationAccess(application, user);

    const admissionPayment = application.payments?.find(
      (p) => p.payment_type === 'ADMISSION_FEE' && p.status === 'SUCCESS'
    );

    if (!admissionPayment) {
      throw new AppError(
        'Payment proof is generated only after payment of the admission fee of ₹1,20,000.',
        400,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    const appFeePayment = application.payments?.find(
      (p) => p.payment_type === 'APPLICATION_FEE' && p.status === 'SUCCESS'
    );

    const receiptNo = `IEM-REC-2026-${String(admissionPayment.id).padStart(5, '0')}`;

    return {
      receiptNumber: receiptNo,
      receiptDate: admissionPayment.paid_at,
      financialYear: '2026-2027',
      gstin: '19AAATI1234F1Z5',
      pan: 'AAATI1234F',
      candidate: {
        fullName: `${application.personalInfo?.first_name || ''} ${application.personalInfo?.last_name || ''}`.trim() || application.applicant?.first_name,
        applicationId: application.application_id,
        email: application.contactInfo?.email || application.applicant?.email,
        phone: application.contactInfo?.phone,
        department: `${application.department?.name} (${application.department?.degree})`,
      },
      paymentDetails: {
        transactionId: admissionPayment.transaction_id,
        paymentMethod: admissionPayment.payment_method,
        status: 'SUCCESSFUL / CONFIRMED',
        currency: 'INR',
        amountInWords: 'Rupees One Lakh Twenty Thousand Only',
        breakdown: [
          { description: 'Tuition Fee (1st Semester)', amount: 90000.00 },
          { description: 'Admission, Registration & Development Fee', amount: 20000.00 },
          { description: 'Laboratory, Library & Caution Deposit (Refundable)', amount: 10000.00 },
        ],
        totalAmount: 120000.00,
      },
      applicationFeePaid: appFeePayment ? {
        amount: 500.00,
        transactionId: appFeePayment.transaction_id,
        date: appFeePayment.paid_at,
      } : null,
      bankReference: {
        bankName: admissionPayment.payment_details?.bankName || 'HDFC Bank, Salt Lake Sector-V Branch',
        ifscCode: 'HDFC0000123',
        accountName: 'Institute of Engineering & Management Admissions A/C',
      },
    };
  }
}

export default PaymentService;
