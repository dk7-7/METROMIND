import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import trafficZoneService from "../../services/trafficZoneService";

const extractError = (error, fallback) =>
  (error.response && error.response.data && error.response.data.error) ||
  error.message ||
  fallback;

export const fetchAll = createAsyncThunk(
  "trafficZone/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await trafficZoneService.getAll();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractError(error, "Unable to load zones"));
    }
  }
);

export const createZone = createAsyncThunk(
  "trafficZone/createZone",
  async (data, thunkAPI) => {
    try {
      const response = await trafficZoneService.create(data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractError(error, "Unable to save zone"));
    }
  }
);

export const updateZone = createAsyncThunk(
  "trafficZone/updateZone",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await trafficZoneService.update(id, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractError(error, "Unable to save zone"));
    }
  }
);

export const deleteZone = createAsyncThunk(
  "trafficZone/deleteZone",
  async (id, thunkAPI) => {
    try {
      const response = await trafficZoneService.remove(id);
      return { id, message: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(extractError(error, "Unable to delete zone"));
    }
  }
);

const trafficZoneSlice = createSlice({
  name: "trafficZone",
  initialState: { items: [], loading: false, error: null, successMessage: null },
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
      .addCase(createZone.fulfilled, (state, action) => {
        state.successMessage = "TrafficZone created successfully.";
      })
      .addCase(createZone.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateZone.fulfilled, (state) => {
        state.successMessage = "TrafficZone updated successfully.";
      })
      .addCase(updateZone.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteZone.fulfilled, (state, action) => {
        state.successMessage = action.payload.message || "TrafficZone deleted successfully.";
        state.items = state.items.filter((z) => z.zoneId !== action.payload.id);
      })
      .addCase(deleteZone.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = trafficZoneSlice.actions;
export default trafficZoneSlice.reducer;
