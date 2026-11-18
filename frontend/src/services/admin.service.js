import api from './api';

export const adminService = {
  async getDashboard() {
    return api.get('/admin/dashboard');
  },

  async getApplications(params = {}) {
    return api.get('/admin/applications', { params });
  },

  async getApplicationById(id) {
    return api.get(`/admin/applications/${id}`);
  },

  async markUnderReview(id) {
    return api.post(`/admin/applications/${id}/review`);
  },

  async acceptApplication(id, notes = '') {
    return api.post(`/admin/applications/${id}/accept`, { notes });
  },

  async rejectApplication(id, reason, notes = '') {
    return api.post(`/admin/applications/${id}/reject`, { reason, notes });
  },

  async flagApplication(id, reason, notes = '') {
    return api.post(`/admin/applications/${id}/flag`, { reason, notes });
  },

  async getApplicants(params = {}) {
    return api.get('/admin/applicants', { params });
  },

  async getReports() {
    return api.get('/admin/reports');
  },

  async getDepartments() {
    return api.get('/departments');
  },

  async updateSeats(departmentId, totalSeats, occupiedSeats) {
    return api.put(`/departments/${departmentId}/seats`, {
      total_seats: totalSeats,
      occupied_seats: occupiedSeats,
    });
  },

  async getDeadline() {
    return api.get('/deadline');
  },

  async updateDeadline(data) {
    return api.put('/deadline', data);
  },
};

export default adminService;
