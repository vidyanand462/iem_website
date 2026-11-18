import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import User from '../models/user.model.js';
import Applicant from '../models/applicant.model.js';
import AppError from '../utils/AppError.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import asyncHandler from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError('Authentication required. Please log in.', 401, ERROR_CODES.UNAUTHENTICATED));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const currentUser = await User.findByPk(decoded.id, {
      include: [{ model: Applicant, as: 'applicantProfile' }],
    });

    if (!currentUser || !currentUser.is_active) {
      return next(new AppError('The account belonging to this token no longer exists or is disabled.', 401, ERROR_CODES.UNAUTHENTICATED));
    }

    req.user = currentUser;
    next();
  } catch (err) {
    return next(new AppError('Invalid or expired authentication token.', 401, ERROR_CODES.UNAUTHENTICATED));
  }
});
