import { body } from 'express-validator';

export const rejectApplicationValidator = [
  body('reason')
    .trim()
    .notEmpty().withMessage('Rejection reason is required and cannot be empty.')
    .isLength({ min: 5 }).withMessage('Rejection reason must be at least 5 characters long.'),
];

export const updateSeatsValidator = [
  body('total_seats')
    .notEmpty().withMessage('Total seats is required.')
    .isInt({ min: 1 }).withMessage('Total seats must be a positive integer.'),
  body('occupied_seats')
    .optional()
    .isInt({ min: 0 }).withMessage('Occupied seats cannot be negative.'),
];

export const updateDeadlineValidator = [
  body('academic_year').trim().notEmpty().withMessage('Academic year is required.'),
  body('start_date').notEmpty().isISO8601().withMessage('Valid start date is required.'),
  body('end_date').notEmpty().isISO8601().withMessage('Valid end date is required.'),
  body('status')
    .optional()
    .isIn(['UPCOMING', 'OPEN', 'CLOSING_SOON', 'CLOSED'])
    .withMessage('Status must be UPCOMING, OPEN, CLOSING_SOON, or CLOSED.'),
];
