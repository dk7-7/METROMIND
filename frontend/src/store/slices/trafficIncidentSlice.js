import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import trafficIncidentService from '../../services/trafficIncidentService';

export const fetchAll = createAsyncThunk(
  'trafficIncident/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await trafficIncidentService.getAll();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch incidents';
      return rejectWithValue(message);
    }
  }
);

export const fetchById = createAsyncThunk(
  'trafficIncident/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await trafficIncidentService.getById(id);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch incident';
      return rejectWithValue(message);
    }
  }
);

export const create = createAsyncThunk(
  'trafficIncident/create',
  async (data, { rejectWithValue }) => {
    try {
      return await trafficIncidentService.create(data);
    } catch (error) {
      if (error.response?.status === 409) {
        return rejectWithValue(error.response.data?.message || error.response.data?.error || 'Traffic incident already exists');
      }
      if (error.response?.status === 500) {
        return rejectWithValue(error.response.data?.message || error.response.data?.error || 'Unable to save traffic incident');
      }
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Unable to save traffic incident';
      return rejectWithValue(message);
    }
  }
);

export const update = createAsyncThunk(
  'trafficIncident/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await trafficIncidentService.update(id, data);
    } catch (error) {
      if (error.response?.status === 409) {
        return rejectWithValue(error.response.data?.message || error.response.data?.error || 'Traffic incident already exists');
      }
      if (error.response?.status === 500) {
        return rejectWithValue(error.response.data?.message || error.response.data?.error || 'Unable to save traffic incident');
      }
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Unable to save traffic incident';
      return rejectWithValue(message);
    }
  }
);

export const deleteRecord = createAsyncThunk(
  'trafficIncident/deleteRecord',
  async (id, { rejectWithValue }) => {
    try {
      await trafficIncidentService.deleteRecord(id);
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to delete incident';
      return rejectWithValue(message);
    }
  }
);

export const dispatchResponse = createAsyncThunk(
  'trafficIncident/dispatchResponse',
  async (id, { rejectWithValue }) => {
    try {
      return await trafficIncidentService.dispatchResponse(id);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to dispatch incident response';
      return rejectWithValue(message);
    }
  }
);

const trafficIncidentSlice = createSlice({
  name: 'trafficIncident',
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
        state.error = action.payload || 'Failed to fetch traffic incidents';
      })
      // fetchById
      .addCase(fetchById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch incident';
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
        state.error = action.payload || 'Unable to save traffic incident';
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
        state.error = action.payload || 'Unable to save traffic incident';
      })
      // deleteRecord
      .addCase(deleteRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (item) => (item.incidentId || item.id) !== action.payload
        );
      })
      .addCase(deleteRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete incident';
      })
      // dispatchResponse
      .addCase(dispatchResponse.fulfilled, (state, action) => {
        if (action.payload) {
          const updated = action.payload;
          const id = updated.incidentId || updated.id;
          state.items = state.items.map((item) =>
            (item.incidentId || item.id) === id ? updated : item
          );
        }
      });
  },
});

export const { clearError, setSelectedItem } = trafficIncidentSlice.actions;
export default trafficIncidentSlice.reducer;