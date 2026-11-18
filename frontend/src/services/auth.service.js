import api from './api';

export const authService = {
  async register(data) {
    return api.post('/auth/register', data);
  },

  async login(credentials) {
    return api.post('/auth/login', credentials);
  },

  async adminLogin(credentials) {
    return api.post('/auth/admin/login', credentials);
  },

  async forgotPassword(email) {
    return api.post('/auth/forgot-password', { email });
  },

  async resetPassword({ email, otp, new_password }) {
    return api.post('/auth/reset-password', { email, otp, new_password });
  },

  async logout() {
    return api.post('/auth/logout');
  },

  async getMe() {
    return api.get('/auth/me');
  },
};

export default authService;
