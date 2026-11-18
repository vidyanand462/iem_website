import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { sequelize } from '../config/db.js';
import User from '../models/user.model.js';
import Applicant from '../models/applicant.model.js';
import AppError from '../utils/AppError.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { ROLES } from '../constants/roles.js';

const formatCapName = (val) => {
  if (!val) return '';
  const trimmed = String(val).trim();
  const noNumbers = trimmed.replace(/[0-9]/g, '');
  const cleaned = noNumbers.replace(/[^A-Za-z\s.'-]/g, '').replace(/^\s+/, '');
  if (!cleaned) return '';
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

// In-memory store for password reset verification codes
const passwordResetStore = new Map();

export class AuthService {
  /**
   * Generate JWT Token
   */
  static generateToken(userId, role) {
    return jwt.sign({ id: userId, role }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });
  }

  /**
   * Register a new applicant user
   */
  static async register({ email, password, first_name, last_name, phone }) {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      throw new AppError('An account with this email address already exists.', 409, ERROR_CODES.CONFLICT);
    }

    const t = await sequelize.transaction();

    try {
      const passwordHash = await bcrypt.hash(password, 10);

      const user = await User.create(
        {
          email,
          password_hash: passwordHash,
          role: ROLES.APPLICANT,
          is_active: true,
        },
        { transaction: t }
      );

      const applicant = await Applicant.create(
        {
          user_id: user.id,
          first_name: formatCapName(first_name),
          last_name: formatCapName(last_name),
          phone,
        },
        { transaction: t }
      );

      await t.commit();

      const token = this.generateToken(user.id, user.role);

      return {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          applicant: {
            id: applicant.id,
            first_name: applicant.first_name,
            last_name: applicant.last_name,
            phone: applicant.phone,
          },
        },
        token,
      };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Login applicant or user
   */
  static async login({ email, password }) {
    const user = await User.findOne({
      where: { email },
      include: [{ model: Applicant, as: 'applicantProfile' }],
    });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new AppError('Invalid email or password.', 401, ERROR_CODES.UNAUTHENTICATED);
    }

    if (!user.is_active) {
      throw new AppError('Your account has been deactivated. Please contact admissions.', 403, ERROR_CODES.UNAUTHORIZED);
    }

    const token = this.generateToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        applicant: user.applicantProfile || null,
      },
      token,
    };
  }

  /**
   * Admin Login specifically verifying ADMIN role
   */
  static async adminLogin({ email, password }) {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new AppError('Invalid admin credentials.', 401, ERROR_CODES.UNAUTHENTICATED);
    }

    if (user.role !== ROLES.ADMIN) {
      throw new AppError('Access denied. Administrator privileges required.', 403, ERROR_CODES.UNAUTHORIZED);
    }

    if (!user.is_active) {
      throw new AppError('Administrator account is inactive.', 403, ERROR_CODES.UNAUTHORIZED);
    }

    const token = this.generateToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  /**
   * Get Current User details
   */
  static async getCurrentUser(userId) {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'email', 'role', 'is_active', 'created_at'],
      include: [{ model: Applicant, as: 'applicantProfile' }],
    });

    if (!user) {
      throw new AppError('User not found.', 404, ERROR_CODES.NOT_FOUND);
    }

    return user;
  }

  /**
   * Request password reset code
   */
  static async requestPasswordReset(email) {
    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      throw new AppError('No registered candidate account found with this email address.', 404, ERROR_CODES.NOT_FOUND);
    }

    if (!user.is_active) {
      throw new AppError('This account is currently deactivated. Please contact admissions cell.', 403, ERROR_CODES.UNAUTHORIZED);
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins validity

    passwordResetStore.set(email.toLowerCase().trim(), { otp, expiresAt, attempts: 0 });

    console.log(`[AUTH] Password reset verification code for ${email}: ${otp}`);

    return {
      message: 'Verification code generated successfully.',
      email: email.toLowerCase().trim(),
      otp, // provided directly for testing/development display
      expiresInMinutes: 15,
    };
  }

  /**
   * Reset Password with OTP
   */
  static async resetPassword({ email, otp, new_password }) {
    const normEmail = email.toLowerCase().trim();
    const record = passwordResetStore.get(normEmail);

    if (!record) {
      throw new AppError('No active password reset request found for this email. Please request a new verification code.', 400, ERROR_CODES.VALIDATION_ERROR);
    }

    if (Date.now() > record.expiresAt) {
      passwordResetStore.delete(normEmail);
      throw new AppError('The verification code has expired. Please request a new code.', 400, ERROR_CODES.VALIDATION_ERROR);
    }

    if (record.otp !== String(otp).trim()) {
      record.attempts = (record.attempts || 0) + 1;
      if (record.attempts >= 5) {
        passwordResetStore.delete(normEmail);
        throw new AppError('Too many invalid attempts. Please request a new verification code.', 429, ERROR_CODES.RATE_LIMIT);
      }
      throw new AppError('Invalid verification code. Please check the 6-digit code.', 400, ERROR_CODES.VALIDATION_ERROR);
    }

    const user = await User.findOne({ where: { email: normEmail } });
    if (!user) {
      throw new AppError('User account not found.', 404, ERROR_CODES.NOT_FOUND);
    }

    const passwordHash = await bcrypt.hash(new_password, 10);
    await user.update({ password_hash: passwordHash });

    passwordResetStore.delete(normEmail);
    console.log(`[AUTH] Password reset completed successfully for ${normEmail}`);

    return {
      message: 'Password has been reset successfully. Please sign in with your new password.',
    };
  }
}

export default AuthService;
