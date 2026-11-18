import { Router } from 'express';
import ApplicantController from '../controllers/applicant.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { restrictTo } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

router.use(protect, restrictTo(ROLES.APPLICANT));

router.get('/profile', ApplicantController.getProfile);
router.put('/profile', ApplicantController.updateProfile);

export default router;
