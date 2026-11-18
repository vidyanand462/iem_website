import { Router } from 'express';
import AdminController from '../controllers/admin.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { restrictTo } from '../middleware/role.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { rejectApplicationValidator } from '../validators/admin.validator.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

// Restrict all routes to authenticated ADMIN
router.use(protect, restrictTo(ROLES.ADMIN));

router.get('/dashboard', AdminController.getDashboard);
router.get('/applications', AdminController.getApplications);
router.get('/applications/:id', AdminController.getApplicationById);

router.post('/applications/:id/review', AdminController.markUnderReview);
router.post('/applications/:id/accept', AdminController.acceptApplication);
router.post('/applications/:id/reject', validate(rejectApplicationValidator), AdminController.rejectApplication);
router.post('/applications/:id/flag', AdminController.flagApplication);

router.get('/applicants', AdminController.getApplicants);
router.get('/reports', AdminController.getReports);

export default router;
