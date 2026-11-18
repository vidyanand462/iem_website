import { Router } from 'express';
import authRoutes from './auth.routes.js';
import applicantRoutes from './applicant.routes.js';
import applicationRoutes from './application.routes.js';
import documentRoutes from './document.routes.js';
import adminRoutes from './admin.routes.js';
import departmentRoutes from './department.routes.js';
import deadlineRoutes from './deadline.routes.js';
import publicRoutes from './public.routes.js';
import paymentRoutes from './payment.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/applicants', applicantRoutes);
router.use('/applications', applicationRoutes);
router.use('/documents', documentRoutes);
router.use('/admin', adminRoutes);
router.use('/departments', departmentRoutes);
router.use('/deadline', deadlineRoutes);
router.use('/public', publicRoutes);
router.use('/payments', paymentRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'IEM Admission System API',
  });
});

export default router;
