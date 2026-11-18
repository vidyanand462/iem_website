import { Router } from 'express';
import DepartmentController from '../controllers/department.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { restrictTo } from '../middleware/role.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { updateSeatsValidator } from '../validators/admin.validator.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

// Publicly readable departments
router.get('/', DepartmentController.getDepartments);

// Admin-only seat modification
router.put('/:id/seats', protect, restrictTo(ROLES.ADMIN), validate(updateSeatsValidator), DepartmentController.updateSeats);

export default router;
