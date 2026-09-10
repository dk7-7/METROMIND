import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import trafficIncidentService from '../../services/trafficIncidentService';

export const fetchAll = createAsyncThunk(
  'trafficIncident/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await trafficIncidentService.getAll();
      return Array.isArray(data) ? data : data?.data || data?.incidents || [];
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
      const res = await trafficIncidentService.create(data);
      return {
        ...(typeof res === 'object' ? res : {}),
        message:
          (typeof res === 'string' ? res : null) ||
          res?.message ||
          'TrafficIncident created successfully.',
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (error.response?.status === 409 ? 'Incident already exists' : null) ||
        (error.response?.status === 500 ? 'Unable to save traffic incident' : null) ||
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
      const res = await trafficIncidentService.update(id, data);
      return {
        id,
        ...(typeof res === 'object' ? res : {}),
        message:
          (typeof res === 'string' ? res : null) ||
          res?.message ||
          'TrafficIncident updated successfully.',
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (error.response?.status === 409 ? 'Incident already exists' : null) ||
        (error.response?.status === 500 ? 'Unable to save traffic incident' : null) ||
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
      const res = await trafficIncidentService.deleteRecord(id);
      const message =
        (typeof res === 'string' ? res : null) ||
        (typeof res === 'object' && (res?.message || res?.data?.message)) ||
        'TrafficIncident deleted successfully.';
      return { id, message };
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
        state.error = null;
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
        state.error = null;
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
        state.error = null;
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
        state.error = null;
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
        state.error = null;
        const targetId = action.payload?.id ?? action.payload;
        state.items = state.items.filter(
          (item) => (item.incidentId || item.id) !== targetId
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