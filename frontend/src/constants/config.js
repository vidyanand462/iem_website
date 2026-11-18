const getApiBaseUrl = () => {
  // 1. Explicit environment variable takes top precedence
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // 2. Client-side browser execution
  if (typeof window !== 'undefined') {
    const { hostname, port } = window.location;

    // When accessed via Vite dev server (port 5173 on localhost or local Wi-Fi IP),
    // use the relative URL '/api/v1'. The Vite dev server proxies this directly to
    // http://localhost:5000, completely eliminating CORS and cross-device network issues!
    if (port === '5173' || port === '5000') {
      return '/api/v1';
    }

    // If accessed from mobile/other device on local Wi-Fi via IP address (e.g. 192.168.x.x) on other ports
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
      return `http://${hostname}:5000/api/v1`;
    }

    // If deployed on Vercel or cloud domain, use relative endpoint '/api/v1'
    return '/api/v1';
  }

  return 'http://localhost:5000/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();

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
