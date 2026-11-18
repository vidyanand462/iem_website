import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// All payment routes require authentication
router.use(protect);

// Pay Application Fee (₹500)
router.post('/application/:id/application-fee', PaymentController.payApplicationFee);

// Pay Admission Fee (₹1,20,000)
router.post('/application/:id/admission-fee', PaymentController.payAdmissionFee);

// List Payments for Application
router.get('/application/:id', PaymentController.getApplicationPayments);

// Get Official Admission Letter Data
router.get('/application/:id/admission-letter', PaymentController.getAdmissionLetter);

// Get Payment Proof Data (Money Receipt)
router.get('/application/:id/payment-proof', PaymentController.getPaymentProof);

export default router;
