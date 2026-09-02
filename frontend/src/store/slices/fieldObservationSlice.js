import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fieldObservationService from '../../services/fieldObservationService';

export const fetchAll = createAsyncThunk(
  'fieldObservation/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await fieldObservationService.getAll();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch field observations';
      return rejectWithValue(message);
    }
  }
);

export const fetchById = createAsyncThunk(
  'fieldObservation/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await fieldObservationService.getById(id);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch field observation';
      return rejectWithValue(message);
    }
  }
);

export const create = createAsyncThunk(
  'fieldObservation/create',
  async (data, { rejectWithValue }) => {
    try {
      return await fieldObservationService.create(data);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to create field observation';
      return rejectWithValue(message);
    }
  }
);

const fieldObservationSlice = createSlice({
  name: 'fieldObservation',
  initialState: {
    items: [],
    selectedItem: null,
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
        state.error = action.payload || 'Failed to fetch field observations';
      })
      // fetchById
      .addCase(fetchById.fulfilled, (state, action) => {
        state.selectedItem = action.payload;
      })
      // create
      .addCase(create.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(create.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.items.unshift(action.payload);
        }
      })
      .addCase(create.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create field observation';
      });
  },
});

export const { clearError, setSelectedItem } = fieldObservationSlice.actions;
export default fieldObservationSlice.reducer;