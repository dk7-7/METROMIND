import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import utilityGridService from '../../services/utilityGridService';

export const fetchAll = createAsyncThunk(
  'utilityGrid/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await utilityGridService.getAll();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch utility grids';
      return rejectWithValue(message);
    }
  }
);

export const fetchById = createAsyncThunk(
  'utilityGrid/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await utilityGridService.getById(id);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch utility grid';
      return rejectWithValue(message);
    }
  }
);

export const create = createAsyncThunk(
  'utilityGrid/create',
  async (data, { rejectWithValue }) => {
    try {
      return await utilityGridService.create(data);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to create utility grid';
      return rejectWithValue(message);
    }
  }
);

export const update = createAsyncThunk(
  'utilityGrid/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await utilityGridService.update(id, data);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to update utility grid';
      return rejectWithValue(message);
    }
  }
);

export const registerOutage = createAsyncThunk(
  'utilityGrid/registerOutage',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await utilityGridService.registerOutage(id, data);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to register outage on grid';
      return rejectWithValue(message);
    }
  }
);

export const deleteRecord = createAsyncThunk(
  'utilityGrid/deleteRecord',
  async (id, { rejectWithValue }) => {
    try {
      await utilityGridService.deleteRecord(id);
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to delete utility grid';
      return rejectWithValue(message);
    }
  }
);

const utilityGridSlice = createSlice({
  name: 'utilityGrid',
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
        state.error = action.payload || 'Failed to fetch utility grids';
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
      .addCase(create.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(create.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create utility grid';
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
        state.error = action.payload || 'Failed to update utility grid';
      })
      // deleteRecord
      .addCase(deleteRecord.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => (item.gridId || item.id) !== action.payload
        );
      });
  },
});

export const { clearError, setSelectedItem } = utilityGridSlice.actions;
export default utilityGridSlice.reducer;