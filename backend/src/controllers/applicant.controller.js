import Applicant from '../models/applicant.model.js';
import User from '../models/user.model.js';
import { sendSuccess } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import { ERROR_CODES } from '../constants/errorCodes.js';

export class ApplicantController {
  static getProfile = asyncHandler(async (req, res) => {
    const applicant = await Applicant.findOne({
      where: { user_id: req.user.id },
      include: [{ model: User, as: 'user', attributes: ['email', 'role', 'created_at'] }],
    });

    if (!applicant) {
      throw new AppError('Applicant profile not found.', 404, ERROR_CODES.NOT_FOUND);
    }

    return sendSuccess(res, applicant, 'Applicant profile retrieved.');
  });

  static updateProfile = asyncHandler(async (req, res) => {
    const applicant = await Applicant.findOne({ where: { user_id: req.user.id } });
    if (!applicant) {
      throw new AppError('Applicant profile not found.', 404, ERROR_CODES.NOT_FOUND);
    }

    const { first_name, last_name, phone } = req.body;
    await applicant.update({
      ...(first_name && { first_name }),
      ...(last_name && { last_name }),
      ...(phone && { phone }),
    });

    return sendSuccess(res, applicant, 'Profile updated successfully.');
  });
}

export default ApplicantController;
