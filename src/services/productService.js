import api from './api';

export const productService = {
  // Get all products for admin
  getProducts: async (params = {}) => {
    const response = await api.get('/products/admin/products', { params });
    return response;
  },

  // Get product by ID
  getProductById: async (id) => {
    const response = await api.get(`/products/get-product-by-id/${id}`);
    return response;
  },

  // Create product
  createProduct: async (productData) => {
    const response = await api.post('/products/create-product', productData);
    return response;
  },

  // Create multiple products
  createProductsBulk: async (products) => {
    const response = await api.post('/products/create-products-bulk', { products });
    return response;
  },

  // Update product
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/admin/products/${id}`, productData);
    return response;
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/admin/products/${id}`);
    return response;
  },

  // Toggle product active status
  toggleProductActive: async (id) => {
    const response = await api.patch(`/products/admin/products/${id}/toggle-active`);
    return response;
  },

  // Get product statistics
  getProductStats: async () => {
    const response = await api.get('/products/admin/products/stats');
    return response;
  },

  // Get products by category
  getProductsByCategory: async (categoryId, params = {}) => {
    const response = await api.get(`/products/get-product-by-category/${categoryId}`, { params });
    return response;
  },
};
