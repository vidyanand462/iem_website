import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from '../validators/auth.validator.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.post('/register', authLimiter, validate(registerValidator), AuthController.register);
router.post('/login', authLimiter, validate(loginValidator), AuthController.login);
router.post('/admin/login', authLimiter, validate(loginValidator), AuthController.adminLogin);
router.post('/forgot-password', authLimiter, validate(forgotPasswordValidator), AuthController.forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordValidator), AuthController.resetPassword);
router.post('/logout', AuthController.logout);
router.get('/me', protect, AuthController.getMe);

export default router;
