import ApplicationDeadline from '../models/deadline.model.js';
import AppError from '../utils/AppError.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import asyncHandler from '../utils/asyncHandler.js';

export const checkApplicationDeadline = asyncHandler(async (req, res, next) => {
  // Admins bypass deadline checks
  if (req.user && req.user.role === 'ADMIN') {
    return next();
  }

  const activeDeadline = await ApplicationDeadline.findOne({
    where: { status: 'OPEN' },
    order: [['end_date', 'DESC']],
  });

  if (!activeDeadline) {
    return next(
      new AppError(
        'Application window is currently closed. No active admissions cycle found.',
        403,
        ERROR_CODES.DEADLINE_PASSED
      )
    );
  }

  const now = new Date();
  if (now > new Date(activeDeadline.end_date)) {
    return next(
      new AppError(
        `The application deadline for cycle ${activeDeadline.academic_year} expired on ${new Date(activeDeadline.end_date).toLocaleDateString()}. New submissions and edits are no longer accepted.`,
        403,
        ERROR_CODES.DEADLINE_PASSED
      )
    );
  }

  next();
});

export default checkApplicationDeadline;
