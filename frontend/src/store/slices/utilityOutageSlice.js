import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import utilityOutageService from '../../services/utilityOutageService';

export const fetchAll = createAsyncThunk(
  'utilityOutage/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await utilityOutageService.getAll();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch utility outages';
      return rejectWithValue(message);
    }
  }
);

export const fetchById = createAsyncThunk(
  'utilityOutage/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await utilityOutageService.getById(id);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch utility outage';
      return rejectWithValue(message);
    }
  }
);

export const create = createAsyncThunk(
  'utilityOutage/create',
  async (data, { rejectWithValue }) => {
    try {
      return await utilityOutageService.create(data);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to register outage';
      return rejectWithValue(message);
    }
  }
);

export const registerOutage = create;

export const update = createAsyncThunk(
  'utilityOutage/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await utilityOutageService.update(id, data);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to update outage';
      return rejectWithValue(message);
    }
  }
);

export const resolveOutage = createAsyncThunk(
  'utilityOutage/resolveOutage',
  async (id, { rejectWithValue }) => {
    try {
      return await utilityOutageService.resolveOutage(id);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to resolve outage';
      return rejectWithValue(message);
    }
  }
);

export const deleteRecord = createAsyncThunk(
  'utilityOutage/deleteRecord',
  async (id, { rejectWithValue }) => {
    try {
      await utilityOutageService.deleteRecord(id);
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to delete outage';
      return rejectWithValue(message);
    }
  }
);

const utilityOutageSlice = createSlice({
  name: 'utilityOutage',
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
        state.error = action.payload || 'Failed to fetch outages';
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
        state.error = action.payload || 'Failed to register outage';
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
        state.error = action.payload || 'Failed to update outage';
      })
      // resolveOutage
      .addCase(resolveOutage.fulfilled, (state, action) => {
        if (action.payload) {
          const updated = action.payload;
          const id = updated.outageId || updated.id;
          state.items = state.items.map((item) =>
            (item.outageId || item.id) === id ? updated : item
          );
        }
      })
      // deleteRecord
      .addCase(deleteRecord.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => (item.outageId || item.id) !== action.payload
        );
      });
  },
});

export const { clearError, setSelectedItem } = utilityOutageSlice.actions;
export default utilityOutageSlice.reducer;