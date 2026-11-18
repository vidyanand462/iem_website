import { body } from 'express-validator';
import { isValidIndianState, validateIndianCity } from '../constants/indiaGeoData.js';

export const createApplicationValidator = [
  body('department_id')
    .notEmpty().withMessage('Department ID is required.')
    .isInt({ min: 1 }).withMessage('Valid Department ID must be provided.'),
];

export const personalInfoValidator = [
  body('first_name')
    .trim()
    .notEmpty().withMessage('First name is required.')
    .matches(/^[^0-9]+$/).withMessage('First name must not contain numbers.')
    .matches(/^[A-Z]/).withMessage('First letter of first name must be a capital letter (A-Z).')
    .matches(/^[A-Z][A-Za-z\s.'-]*$/).withMessage('First letter must be capital; remaining letters may be capital or small.'),
  body('last_name')
    .trim()
    .notEmpty().withMessage('Last name is required.')
    .matches(/^[^0-9]+$/).withMessage('Last name must not contain numbers.')
    .matches(/^[A-Z]/).withMessage('First letter of last name must be a capital letter (A-Z).')
    .matches(/^[A-Z][A-Za-z\s.'-]*$/).withMessage('First letter must be capital; remaining letters may be capital or small.'),
  body('middle_name')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[^0-9]+$/).withMessage('Middle name must not contain numbers.')
    .matches(/^[A-Z]/).withMessage('First letter of middle name must be a capital letter (A-Z).')
    .matches(/^[A-Z][A-Za-z\s.'-]*$/).withMessage('First letter must be capital; remaining letters may be capital or small.'),
  body('date_of_birth')
    .notEmpty().withMessage('Date of birth is required.')
    .isISO8601().withMessage('Date of birth must be a valid date (YYYY-MM-DD).')
    .custom((val) => {
      const dob = new Date(val);
      const today = new Date();
      if (dob > today) {
        throw new Error('Date of birth cannot be in the future (age cannot be negative).');
      }
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (age < 16 || age > 30) {
        throw new Error(`Age must be between 16 and 30 years (cannot be negative). Calculated age: ${age} years.`);
      }
      return true;
    }),
  body('gender')
    .notEmpty().withMessage('Gender is required.')
    .isIn(['MALE', 'FEMALE', 'OTHER']).withMessage('Gender must be MALE, FEMALE, or OTHER.'),
  body('blood_group')
    .optional({ checkFalsy: true })
    .matches(/^(A|B|AB|O)[+-]$/).withMessage('Blood group must be a valid ABO type with Rh factor (e.g., A+, A-, B+, B-, AB+, AB-, O+, O-).'),
  body('category')
    .optional()
    .isIn(['GENERAL', 'OBC', 'SC', 'ST', 'EWS']).withMessage('Category must be GENERAL, OBC, SC, ST, or EWS.'),
];

export const contactInfoValidator = [
  body('email').trim().notEmpty().isEmail().withMessage('Valid email address is required.'),
  body('phone').trim().notEmpty().withMessage('Phone number is required.'),
  body('address_line1')
    .trim()
    .notEmpty().withMessage('Permanent address line 1 is required.')
    .custom((val) => {
      if (/(?:^|\s|#|;|,|\/)-[0-9]+/.test(val) || /-[0-9]+/.test(val)) {
        throw new Error('Address Line 1 cannot contain negative numbers (e.g. -1, -5). Please enter positive building/plot/street numbers.');
      }
      return true;
    }),
  body('address_line2')
    .optional({ checkFalsy: true })
    .trim()
    .custom((val) => {
      if (val && (/(?:^|\s|#|;|,|\/)-[0-9]+/.test(val) || /-[0-9]+/.test(val))) {
        throw new Error('Address Line 2 cannot contain negative numbers.');
      }
      return true;
    }),
  body('state')
    .trim()
    .notEmpty().withMessage('State is required.')
    .custom((val) => {
      if (!isValidIndianState(val)) {
        throw new Error('Please select a valid Indian State from the 28 states of India or recognized Union Territories.');
      }
      return true;
    }),
  body('city')
    .trim()
    .notEmpty().withMessage('City is required.')
    .custom((val, { req }) => {
      const state = req.body?.state;
      const res = validateIndianCity(val, state);
      if (!res.valid) {
        throw new Error(res.reason || 'Please enter a valid recognized Indian city or district.');
      }
      return true;
    }),
  body('pincode')
    .trim()
    .notEmpty().withMessage('Pincode is required.')
    .matches(/^[1-9][0-9]{5}$/).withMessage('Pincode must be a positive 6-digit Indian postal code (cannot be negative or start with 0).'),
];

export const guardianInfoValidator = [
  body('father_name')
    .trim()
    .notEmpty().withMessage("Father's name is required.")
    .matches(/^[^0-9]+$/).withMessage("Father's name must not contain numbers.")
    .matches(/^[A-Z]/).withMessage("First letter of father's name must be a capital letter (A-Z).")
    .matches(/^[A-Z][A-Za-z\s.'-]*$/).withMessage("First letter must be capital; remaining letters may be capital or small."),
  body('mother_name')
    .trim()
    .notEmpty().withMessage("Mother's name is required.")
    .matches(/^[^0-9]+$/).withMessage("Mother's name must not contain numbers.")
    .matches(/^[A-Z]/).withMessage("First letter of mother's name must be a capital letter (A-Z).")
    .matches(/^[A-Z][A-Za-z\s.'-]*$/).withMessage("First letter must be capital; remaining letters may be capital or small."),
  body('guardian_name')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[^0-9]+$/).withMessage("Guardian's name must not contain numbers.")
    .matches(/^[A-Z]/).withMessage("First letter of guardian's name must be a capital letter (A-Z).")
    .matches(/^[A-Z][A-Za-z\s.'-]*$/).withMessage("First letter must be capital; remaining letters may be capital or small."),
];

export const academicInfoValidator = [
  body('tenth_board').trim().notEmpty().withMessage('Class 10th Board is required.'),
  body('tenth_school').trim().notEmpty().withMessage('Class 10th School is required.'),
  body('tenth_year').notEmpty().isInt({ min: 1990, max: 2030 }).withMessage('Valid 10th passing year required.'),
  body('tenth_percentage')
    .notEmpty().withMessage('Class 10th percentage is required.')
    .isFloat().withMessage('Class 10th percentage must be a valid number.')
    .custom((val) => {
      const num = parseFloat(val);
      if (num < 0) {
        throw new Error('10th percentage must be a positive number (cannot be negative).');
      }
      if (num < 50) {
        throw new Error('Minimum requirement not fulfilled: Minimum 50% required in Class 10th.');
      }
      if (num > 100) {
        throw new Error('10th percentage cannot exceed 100%.');
      }
      return true;
    }),
  body('twelfth_board').trim().notEmpty().withMessage('Class 12th Board is required.'),
  body('twelfth_school').trim().notEmpty().withMessage('Class 12th School is required.'),
  body('twelfth_year').notEmpty().isInt({ min: 1990, max: 2030 }).withMessage('Valid 12th passing year required.'),
  body('twelfth_percentage')
    .notEmpty().withMessage('Class 12th percentage is required.')
    .isFloat().withMessage('Class 12th percentage must be a valid number.')
    .custom((val) => {
      const num = parseFloat(val);
      if (num < 0) {
        throw new Error('12th percentage must be a positive number (cannot be negative).');
      }
      if (num < 60) {
        throw new Error('Minimum requirement not fulfilled: Minimum 60% aggregate required in Class 12th for admission.');
      }
      if (num > 100) {
        throw new Error('12th percentage cannot exceed 100%.');
      }
      return true;
    }),
  body('entrance_rank')
    .optional({ checkFalsy: true })
    .custom((val) => {
      if (val !== null && val !== undefined && val !== '') {
        const num = Number(val);
        if (isNaN(num) || num <= 0 || !Number.isInteger(num)) {
          throw new Error('General Merit Rank (GMR) must be a positive number greater than 0 (cannot be negative or zero).');
        }
        if (num > 1000000) {
          throw new Error('General Merit Rank (GMR) must be below 10 Lakhs (maximum 1,000,000).');
        }
      }
      return true;
    }),
];
