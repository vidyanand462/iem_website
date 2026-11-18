import { body } from 'express-validator';

export const registerValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
  body('first_name')
    .trim()
    .notEmpty().withMessage('First name is required.')
    .isLength({ max: 100 }).withMessage('First name cannot exceed 100 characters.')
    .matches(/^[^0-9]+$/).withMessage('First name must not contain numbers.')
    .matches(/^[A-Z]/).withMessage('First letter of first name must be a capital letter (A-Z).')
    .matches(/^[A-Z][A-Za-z\s.'-]*$/).withMessage('First letter must be capital; remaining letters may be capital or small.'),
  body('last_name')
    .trim()
    .notEmpty().withMessage('Last name is required.')
    .isLength({ max: 100 }).withMessage('Last name cannot exceed 100 characters.')
    .matches(/^[^0-9]+$/).withMessage('Last name must not contain numbers.')
    .matches(/^[A-Z]/).withMessage('First letter of last name must be a capital letter (A-Z).')
    .matches(/^[A-Z][A-Za-z\s.'-]*$/).withMessage('First letter must be capital; remaining letters may be capital or small.'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required.')
    .matches(/^[0-9+\-\s()]{7,20}$/).withMessage('Please provide a valid phone number.'),
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required.'),
];

export const forgotPasswordValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),
];

export const resetPasswordValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('otp')
    .trim()
    .notEmpty().withMessage('Verification code is required.')
    .isLength({ min: 6, max: 6 }).withMessage('Verification code must be a 6-digit number.'),
  body('new_password')
    .notEmpty().withMessage('New password is required.')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters long.'),
];
