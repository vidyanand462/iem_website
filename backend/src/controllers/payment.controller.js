import { PaymentService } from '../services/payment.service.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class PaymentController {
  /**
   * Pay Application Form Filling Fee (₹500)
   */
  static payApplicationFee = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const paymentData = req.body || {};
    const result = await PaymentService.payApplicationFee(id, req.user, paymentData);
    return sendSuccess(res, result, result.message, result.alreadyPaid ? 200 : 201);
  });

  /**
   * Pay Admission Fee (₹1,20,000)
   */
  static payAdmissionFee = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const paymentData = req.body || {};
    const result = await PaymentService.payAdmissionFee(id, req.user, paymentData);
    return sendSuccess(res, result, result.message, result.alreadyPaid ? 200 : 201);
  });

  /**
   * Get payments for an application
   */
  static getApplicationPayments = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const payments = await PaymentService.getPaymentsForApplication(id, req.user);
    return sendSuccess(res, payments, 'Application payments retrieved successfully.');
  });

  /**
   * Get Admission Letter Data
   */
  static getAdmissionLetter = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await PaymentService.getAdmissionLetterData(id, req.user);
    return sendSuccess(res, data, 'Admission letter details retrieved successfully.');
  });

  /**
   * Get Payment Proof Data (Fee Receipt)
   */
  static getPaymentProof = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await PaymentService.getPaymentProofData(id, req.user);
    return sendSuccess(res, data, 'Payment proof details retrieved successfully.');
  });
}

export default PaymentController;
