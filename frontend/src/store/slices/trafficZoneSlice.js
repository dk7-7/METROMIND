import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import trafficZoneService from '../../services/trafficZoneService';

export const fetchAll = createAsyncThunk(
  'trafficZone/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await trafficZoneService.getAll();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch traffic zones';
      return rejectWithValue(message);
    }
  }
);

export const fetchById = createAsyncThunk(
  'trafficZone/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await trafficZoneService.getById(id);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch traffic zone';
      return rejectWithValue(message);
    }
  }
);

export const fetchCongested = createAsyncThunk(
  'trafficZone/fetchCongested',
  async (_, { rejectWithValue }) => {
    try {
      return await trafficZoneService.getCongested();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch congested zones';
      return rejectWithValue(message);
    }
  }
);

export const create = createAsyncThunk(
  'trafficZone/create',
  async (data, { rejectWithValue }) => {
    try {
      return await trafficZoneService.create(data);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to create traffic zone';
      return rejectWithValue(message);
    }
  }
);

export const update = createAsyncThunk(
  'trafficZone/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await trafficZoneService.update(id, data);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to update traffic zone';
      return rejectWithValue(message);
    }
  }
);

export const deleteRecord = createAsyncThunk(
  'trafficZone/deleteRecord',
  async (id, { rejectWithValue }) => {
    try {
      await trafficZoneService.deleteRecord(id);
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to delete traffic zone';
      return rejectWithValue(message);
    }
  }
);

const trafficZoneSlice = createSlice({
  name: 'trafficZone',
  initialState: {
    items: [],
    selectedItem: null,
    congestedZones: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAll
      .addCase(fetchAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAll.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch traffic zones';
      })
      // fetchById
      .addCase(fetchById.fulfilled, (state, action) => {
        state.selectedItem = action.payload;
      })
      // fetchCongested
      .addCase(fetchCongested.fulfilled, (state, action) => {
        state.congestedZones = Array.isArray(action.payload) ? action.payload : [];
      })
      // create
      .addCase(create.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(create.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(create.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create traffic zone';
      })
      // update
      .addCase(update.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(update.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(update.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update traffic zone';
      })
      // deleteRecord
      .addCase(deleteRecord.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => (item.zoneId || item.id) !== action.payload
        );
      });
  },
});

export const { clearError, setSelectedItem } = trafficZoneSlice.actions;
export default trafficZoneSlice.reducer;