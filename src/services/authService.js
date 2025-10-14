import api from './api';

export const authService = {
  // Login admin
  login: async (credentials) => {
    const response = await api.post('/admin/login', credentials);
    return response;
  },

  // Get current admin profile
  getProfile: async () => {
    const response = await api.get('/admin/me');
    return response;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.post('/admin/change-password', passwordData);
    return response;
  },

  // Create admin (SuperAdmin only)
  createAdmin: async (adminData) => {
    const response = await api.post('/admin/create-admin', adminData);
    return response;
  },

  // Get all admins (SuperAdmin only)
  getAdmins: async (params = {}) => {
    const response = await api.get('/admin/admins', { params });
    return response;
  },

  // Update admin (SuperAdmin only)
  updateAdmin: async (id, adminData) => {
    const response = await api.put(`/admin/admins/${id}`, adminData);
    return response;
  },

  // Delete admin (SuperAdmin only)
  deleteAdmin: async (id) => {
    const response = await api.delete(`/admin/admins/${id}`);
    return response;
  },

  // Get admin statistics (SuperAdmin only)
  getAdminStats: async () => {
    const response = await api.get('/admin/stats');
    return response;
  },
};
