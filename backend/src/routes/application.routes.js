import { Router } from 'express';
import ApplicationController from '../controllers/application.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import checkApplicationDeadline from '../middleware/deadline.middleware.js';
import {
  createApplicationValidator,
  personalInfoValidator,
  contactInfoValidator,
  guardianInfoValidator,
  academicInfoValidator,
} from '../validators/application.validator.js';

const router = Router();

// All application routes require authentication
router.use(protect);

router.route('/')
  .get(ApplicationController.getMyApplications)
  .post(checkApplicationDeadline, validate(createApplicationValidator), ApplicationController.createApplication);

router.route('/:id')
  .get(ApplicationController.getApplicationById);

router.put('/:id/personal', checkApplicationDeadline, validate(personalInfoValidator), ApplicationController.updatePersonalInfo);
router.put('/:id/contact', checkApplicationDeadline, validate(contactInfoValidator), ApplicationController.updateContactInfo);
router.put('/:id/guardian', checkApplicationDeadline, validate(guardianInfoValidator), ApplicationController.updateGuardianInfo);
router.put('/:id/academic', checkApplicationDeadline, validate(academicInfoValidator), ApplicationController.updateAcademicInfo);

router.post('/:id/submit', checkApplicationDeadline, ApplicationController.submitApplication);
router.get('/:id/status', ApplicationController.getApplicationStatus);
router.get('/:id/acknowledgement', ApplicationController.getApplicationAcknowledgement);

export default router;
