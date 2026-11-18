import AppError from '../utils/AppError.js';
import { ERROR_CODES } from '../constants/errorCodes.js';

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403, ERROR_CODES.UNAUTHORIZED)
      );
    }
    next();
  };
};

export default restrictTo;
