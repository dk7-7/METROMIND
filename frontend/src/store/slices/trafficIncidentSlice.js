import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import trafficIncidentService from "../../services/trafficIncidentService";

const extractError = (error, fallback) =>
  (error.response && error.response.data && error.response.data.error) ||
  error.message ||
  fallback;

export const fetchAll = createAsyncThunk(
  "trafficIncident/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await trafficIncidentService.getAll();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractError(error, "Unable to load incidents"));
    }
  }
);

export const createRecord = createAsyncThunk(
  "trafficIncident/createRecord",
  async (data, thunkAPI) => {
    try {
      const response = await trafficIncidentService.create(data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractError(error, "Unable to save incident"));
    }
  }
);

export const updateRecord = createAsyncThunk(
  "trafficIncident/updateRecord",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await trafficIncidentService.update(id, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractError(error, "Unable to save incident"));
    }
  }
);

export const deleteRecord = createAsyncThunk(
  "trafficIncident/deleteRecord",
  async (id, thunkAPI) => {
    try {
      const response = await trafficIncidentService.remove(id);
      return { id, message: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(extractError(error, "Unable to delete incident"));
    }
  }
);

export const dispatchIncident = createAsyncThunk(
  "trafficIncident/dispatchIncident",
  async (id, thunkAPI) => {
    try {
      const response = await trafficIncidentService.dispatchIncident(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractError(error, "Unable to dispatch incident"));
    }
  }
);

const trafficIncidentSlice = createSlice({
  name: "trafficIncident",
  initialState: {
    items: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAll.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAll.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createRecord.fulfilled, (state, action) => {
        state.successMessage = action.payload;
      })
      .addCase(createRecord.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateRecord.fulfilled, (state, action) => {
        state.successMessage = action.payload;
      })
      .addCase(updateRecord.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteRecord.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
        state.items = state.items.filter(
          (item) => item.incidentId !== action.payload.id
        );
      })
      .addCase(deleteRecord.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(dispatchIncident.fulfilled, (state, action) => {
        state.successMessage = "Incident dispatched successfully.";
        const idx = state.items.findIndex(
          (i) => i.incidentId === action.payload.incidentId
        );
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(dispatchIncident.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = trafficIncidentSlice.actions;
export default trafficIncidentSlice.reducer;
