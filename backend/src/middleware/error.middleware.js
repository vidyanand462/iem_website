import { env } from '../config/env.js';
import { ERROR_CODES } from '../constants/errorCodes.js';

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorCode = err.errorCode || ERROR_CODES.INTERNAL_SERVER_ERROR;
  let errors = err.errors || null;

  // Handle Sequelize Unique Constraint Error
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    errorCode = ERROR_CODES.CONFLICT;
    message = 'A record with this information already exists.';
    errors = err.errors?.map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Handle Sequelize Validation Error
  if (err.name === 'SequelizeValidationError') {
    statusCode = 422;
    errorCode = ERROR_CODES.VALIDATION_ERROR;
    message = 'Validation failed.';
    errors = err.errors?.map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Handle JWT Error
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorCode = ERROR_CODES.UNAUTHENTICATED;
    message = 'Invalid token. Please authenticate again.';
  }

  // Handle Multer Size Limit Error
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    errorCode = ERROR_CODES.FILE_UPLOAD_ERROR;
    message = `File size exceeds the limit of ${env.MAX_FILE_SIZE_MB}MB.`;
  }

  if (env.NODE_ENV !== 'test' && statusCode === 500) {
    console.error('[ERROR HANDLER]', err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorCode,
    errors,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
