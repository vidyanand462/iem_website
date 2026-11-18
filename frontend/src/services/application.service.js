import api from './api';

export const applicationService = {
  async getMyApplications() {
    return api.get('/applications');
  },

  async createApplication(departmentId) {
    return api.post('/applications', { department_id: departmentId });
  },

  async getApplicationById(id) {
    return api.get(`/applications/${id}`);
  },

  async updatePersonalInfo(id, data) {
    return api.put(`/applications/${id}/personal`, data);
  },

  async updateContactInfo(id, data) {
    return api.put(`/applications/${id}/contact`, data);
  },

  async updateGuardianInfo(id, data) {
    return api.put(`/applications/${id}/guardian`, data);
  },

  async updateAcademicInfo(id, data) {
    return api.put(`/applications/${id}/academic`, data);
  },

  async submitApplication(id) {
    return api.post(`/applications/${id}/submit`);
  },

  async getApplicationStatus(id) {
    return api.get(`/applications/${id}/status`);
  },

  async getApplicationAcknowledgement(id) {
    return api.get(`/applications/${id}/acknowledgement`);
  },
};

export default applicationService;
