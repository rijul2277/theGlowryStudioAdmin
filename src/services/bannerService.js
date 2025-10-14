import api from './api';

export const bannerService = {
  // Get all banners for admin
  getBanners: async (params = {}) => {
    const response = await api.get('/banners/admin/banners', { params });
    return response;
  },

  // Get active banners (for frontend)
  getActiveBanners: async () => {
    const response = await api.get('/banners');
    return response;
  },

  // Create banner
  createBanner: async (bannerData) => {
    const response = await api.post('/banners', bannerData);
    return response;
  },

  // Update banner
  updateBanner: async (id, bannerData) => {
    const response = await api.put(`/banners/${id}`, bannerData);
    return response;
  },

  // Delete banner
  deleteBanner: async (id) => {
    const response = await api.delete(`/banners/${id}`);
    return response;
  },

  // Toggle banner active status
  toggleBannerActive: async (id) => {
    const response = await api.patch(`/banners/admin/banners/${id}/toggle-active`);
    return response;
  },

  // Get banner statistics
  getBannerStats: async () => {
    const response = await api.get('/banners/admin/banners/stats');
    return response;
  },
};
