import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bannerService } from '../../services/bannerService';

// Async thunks
export const fetchBanners = createAsyncThunk(
  'banners/fetchBanners',
  async (params, { rejectWithValue }) => {
    try {
      const response = await bannerService.getBanners(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch banners');
    }
  }
);

export const fetchActiveBanners = createAsyncThunk(
  'banners/fetchActiveBanners',
  async (_, { rejectWithValue }) => {
    try {
      const response = await bannerService.getActiveBanners();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active banners');
    }
  }
);

export const createBanner = createAsyncThunk(
  'banners/createBanner',
  async (bannerData, { rejectWithValue }) => {
    try {
      const response = await bannerService.createBanner(bannerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create banner');
    }
  }
);

export const updateBanner = createAsyncThunk(
  'banners/updateBanner',
  async ({ id, bannerData }, { rejectWithValue }) => {
    try {
      const response = await bannerService.updateBanner(id, bannerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update banner');
    }
  }
);

export const deleteBanner = createAsyncThunk(
  'banners/deleteBanner',
  async (id, { rejectWithValue }) => {
    try {
      await bannerService.deleteBanner(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete banner');
    }
  }
);

export const toggleBannerActive = createAsyncThunk(
  'banners/toggleBannerActive',
  async (id, { rejectWithValue }) => {
    try {
      const response = await bannerService.toggleBannerActive(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle banner status');
    }
  }
);

export const fetchBannerStats = createAsyncThunk(
  'banners/fetchBannerStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await bannerService.getBannerStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch banner stats');
    }
  }
);

const initialState = {
  banners: [],
  activeBanners: [],
  currentBanner: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filters: {
    search: '',
    status: '',
  },
  stats: null,
};

const bannerSlice = createSlice({
  name: 'banners',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        status: '',
      };
    },
    setCurrentBanner: (state, action) => {
      state.currentBanner = action.payload;
    },
    clearCurrentBanner: (state) => {
      state.currentBanner = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Banners
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Active Banners
      .addCase(fetchActiveBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.activeBanners = action.payload;
        state.error = null;
      })
      .addCase(fetchActiveBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Banner
      .addCase(createBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners.unshift(action.payload.data);
        state.error = null;
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Banner
      .addCase(updateBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.banners.findIndex(b => b._id === action.payload.data._id);
        if (index !== -1) {
          state.banners[index] = action.payload.data;
        }
        if (state.currentBanner && state.currentBanner._id === action.payload.data._id) {
          state.currentBanner = action.payload.data;
        }
        state.error = null;
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Banner
      .addCase(deleteBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = state.banners.filter(b => b._id !== action.payload);
        if (state.currentBanner && state.currentBanner._id === action.payload) {
          state.currentBanner = null;
        }
        state.error = null;
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle Banner Active
      .addCase(toggleBannerActive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleBannerActive.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.banners.findIndex(b => b._id === action.payload.data._id);
        if (index !== -1) {
          state.banners[index] = action.payload.data;
        }
        if (state.currentBanner && state.currentBanner._id === action.payload.data._id) {
          state.currentBanner = action.payload.data;
        }
        state.error = null;
      })
      .addCase(toggleBannerActive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Banner Stats
      .addCase(fetchBannerStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBannerStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
        state.error = null;
      })
      .addCase(fetchBannerStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setFilters, clearFilters, setCurrentBanner, clearCurrentBanner } = bannerSlice.actions;
export default bannerSlice.reducer;
