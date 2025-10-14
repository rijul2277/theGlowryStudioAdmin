// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'https://theglowrystudiobackend-2.onrender.com/api/v1',
  TIMEOUT: 10000,
};

// Admin Roles
export const ADMIN_ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
};

// Product Status
export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ALL: 'all',
};

// Category Status
export const CATEGORY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ALL: 'all',
};

// Banner Status
export const BANNER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ALL: 'all',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  MAX_FILES: 10,
};

// Form Validation
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 1000,
  SLUG_MAX_LENGTH: 200,
};

// Routes
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  BANNERS: '/banners',
  ORDERS: '/orders',
  ADMINS: '/admins',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ADMIN_TOKEN: 'adminToken',
  ADMIN_REFRESH_TOKEN: 'adminRefreshToken',
};

// Toast Messages
export const TOAST_MESSAGES = {
  SUCCESS: {
    LOGIN: 'Login successful!',
    LOGOUT: 'Logged out successfully!',
    CREATE: 'Created successfully!',
    UPDATE: 'Updated successfully!',
    DELETE: 'Deleted successfully!',
    PASSWORD_CHANGE: 'Password changed successfully!',
  },
  ERROR: {
    LOGIN: 'Login failed. Please check your credentials.',
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    VALIDATION: 'Please check your input and try again.',
    GENERIC: 'Something went wrong. Please try again.',
  },
};

// Table Configuration
export const TABLE_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  SORT_DIRECTIONS: {
    ASC: 'asc',
    DESC: 'desc',
  },
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'MMM DD, YYYY HH:mm',
};

// Image Upload Folders
export const UPLOAD_FOLDERS = {
  PRODUCTS: 'theglowrystudio/products',
  BANNERS: 'theglowrystudio/banners',
  CATEGORIES: 'theglowrystudio/categories',
  GENERAL: 'theglowrystudio',
};
