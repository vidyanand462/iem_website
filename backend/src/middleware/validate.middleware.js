import { validationResult } from 'express-validator';
import AppError from '../utils/AppError.js';
import { ERROR_CODES } from '../constants/errorCodes.js';

export const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    return next(
      new AppError(
        'Validation failed. Please correct the highlighted errors.',
        422,
        ERROR_CODES.VALIDATION_ERROR,
        formattedErrors
      )
    );
  };
};

export default validate;
