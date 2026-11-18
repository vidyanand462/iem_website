import api from './api';

export const paymentService = {
  /**
   * Pay Application Form Filling Fee (₹500)
   */
  payApplicationFee: (applicationId, paymentData = {}) =>
    api.post(`/payments/application/${applicationId}/application-fee`, paymentData),

  /**
   * Pay Admission Fee (₹1,20,000)
   */
  payAdmissionFee: (applicationId, paymentData = {}) =>
    api.post(`/payments/application/${applicationId}/admission-fee`, paymentData),

  /**
   * Get all payments recorded for an application
   */
  getPayments: (applicationId) =>
    api.get(`/payments/application/${applicationId}`),

  /**
   * Get official Admission Letter data
   */
  getAdmissionLetter: (applicationId) =>
    api.get(`/payments/application/${applicationId}/admission-letter`),

  /**
   * Get official Payment Proof / Fee Receipt data
   */
  getPaymentProof: (applicationId) =>
    api.get(`/payments/application/${applicationId}/payment-proof`),
};

export default paymentService;
