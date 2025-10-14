import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';

// Async thunks
export const fetchAdmins = createAsyncThunk(
  'admins/fetchAdmins',
  async (params, { rejectWithValue }) => {
    try {
      const response = await authService.getAdmins(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admins');
    }
  }
);

export const createAdmin = createAsyncThunk(
  'admins/createAdmin',
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await authService.createAdmin(adminData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create admin');
    }
  }
);

export const updateAdmin = createAsyncThunk(
  'admins/updateAdmin',
  async ({ id, adminData }, { rejectWithValue }) => {
    try {
      const response = await authService.updateAdmin(id, adminData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update admin');
    }
  }
);

export const deleteAdmin = createAsyncThunk(
  'admins/deleteAdmin',
  async (id, { rejectWithValue }) => {
    try {
      await authService.deleteAdmin(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete admin');
    }
  }
);

export const fetchAdminStats = createAsyncThunk(
  'admins/fetchAdminStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getAdminStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin stats');
    }
  }
);

const initialState = {
  admins: [],
  currentAdmin: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  stats: null,
};

const adminSlice = createSlice({
  name: 'admins',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentAdmin: (state, action) => {
      state.currentAdmin = action.payload;
    },
    clearCurrentAdmin: (state) => {
      state.currentAdmin = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Admins
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Admin
      .addCase(createAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admins.unshift(action.payload.admin);
        state.error = null;
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Admin
      .addCase(updateAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdmin.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.admins.findIndex(a => a._id === action.payload.admin._id);
        if (index !== -1) {
          state.admins[index] = action.payload.admin;
        }
        if (state.currentAdmin && state.currentAdmin._id === action.payload.admin._id) {
          state.currentAdmin = action.payload.admin;
        }
        state.error = null;
      })
      .addCase(updateAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Admin
      .addCase(deleteAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = state.admins.filter(a => a._id !== action.payload);
        if (state.currentAdmin && state.currentAdmin._id === action.payload) {
          state.currentAdmin = null;
        }
        state.error = null;
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Admin Stats
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentAdmin, clearCurrentAdmin } = adminSlice.actions;
export default adminSlice.reducer;
