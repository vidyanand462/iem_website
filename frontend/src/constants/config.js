export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const APPLICATION_STATUS = Object.freeze({
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  FLAGGED: 'FLAGGED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
});

export const ROLES = Object.freeze({
  APPLICANT: 'APPLICANT',
  ADMIN: 'ADMIN',
});

export const DOCUMENT_TYPES = [
  { id: 'photograph', label: 'Passport Size Photograph', required: true, accept: '.jpg,.jpeg,.png' },
  { id: 'id_proof', label: 'Government ID Proof (Aadhaar / Passport)', required: true, accept: '.pdf,.jpg,.jpeg,.png' },
  { id: 'marksheet_10th', label: 'Class 10th Marksheet & Certificate', required: true, accept: '.pdf,.jpg,.jpeg,.png' },
  { id: 'marksheet_12th', label: 'Class 12th / Diploma Marksheet', required: true, accept: '.pdf,.jpg,.jpeg,.png' },
  { id: 'entrance_rank_card', label: 'WBJEE / JEE Main / IEMJEE Rank Card', required: false, accept: '.pdf,.jpg,.jpeg,.png' },
  { id: 'other', label: 'Supporting Certificates / Achievements', required: false, accept: '.pdf,.jpg,.jpeg,.png' },
];
