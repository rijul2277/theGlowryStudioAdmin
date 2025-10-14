import api from './api';

export const categoryService = {
  // Get all categories for admin
  getCategories: async (params = {}) => {
    const response = await api.get('/category/admin/categories', { params });
    return response;
  },

  // Get active categories (for dropdowns)
  getActiveCategories: async (params = {}) => {
    const response = await api.get('/category/admin/get-categories', { params });
    return response;
  },

  // Create category
  createCategory: async (categoryData) => {
    const response = await api.post('/category/create-category', categoryData);
    return response;
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/category/admin/category/${id}`, categoryData);
    return response;
  },

  // Delete category
  deleteCategory: async (id) => {
    const response = await api.delete(`/category/admin/category/${id}`);
    return response;
  },

  // Toggle category active status
  toggleCategoryActive: async (id) => {
    const response = await api.patch(`/category/admin/category/${id}/toggle-active`);
    return response;
  },

  // Get category statistics
  getCategoryStats: async () => {
    const response = await api.get('/category/admin/categories/stats');
    return response;
  },
};
