import { Router } from 'express';
import DeadlineController from '../controllers/deadline.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { restrictTo } from '../middleware/role.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { updateDeadlineValidator } from '../validators/admin.validator.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

// Publicly viewable deadline
router.get('/', DeadlineController.getDeadline);

// Admin-only deadline modification
router.put('/', protect, restrictTo(ROLES.ADMIN), validate(updateDeadlineValidator), DeadlineController.updateDeadline);

export default router;
