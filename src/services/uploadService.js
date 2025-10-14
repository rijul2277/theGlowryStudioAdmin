import api from './api';

export const uploadService = {
  // Upload single image
  uploadImage: async (file, folder = 'theglowrystudio') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    
    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Upload multiple images
  uploadImages: async (files, folder = 'theglowrystudio') => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    formData.append('folder', folder);
    
    const response = await api.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Upload product images
  uploadProductImages: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    
    const response = await api.post('/upload/product-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Upload banner image
  uploadBannerImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/upload/banner-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Upload category banner
  uploadCategoryBanner: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/upload/category-banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Delete image
  deleteImage: async (publicId) => {
    const response = await api.delete('/upload/image', {
      data: { publicId }
    });
    return response;
  },

  // Delete multiple images
  deleteImages: async (publicIds) => {
    const response = await api.delete('/upload/images', {
      data: { publicIds }
    });
    return response;
  },
};
