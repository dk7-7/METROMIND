import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import alertNotificationService from "../../services/alertNotificationService";

const extractError = (error, fallback) =>
  (error.response && error.response.data && error.response.data.error) ||
  error.message ||
  fallback;

export const fetchAll = createAsyncThunk(
  "alertNotification/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await alertNotificationService.getAll();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractError(error, "Unable to load alerts"));
    }
  }
);

export const createAlert = createAsyncThunk(
  "alertNotification/createAlert",
  async (data, thunkAPI) => {
    try {
      const response = await alertNotificationService.create(data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractError(error, "Unable to create alert"));
    }
  }
);

export const markRead = createAsyncThunk(
  "alertNotification/markRead",
  async (id, thunkAPI) => {
    try {
      const response = await alertNotificationService.markRead(id);
      return { id, message: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(extractError(error, "Unable to update alert"));
    }
  }
);

const alertNotificationSlice = createSlice({
  name: "alertNotification",
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
      .addCase(createAlert.fulfilled, (state) => {
        state.successMessage = "AlertNotification created successfully.";
      })
      .addCase(createAlert.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(markRead.fulfilled, (state, action) => {
        state.successMessage = action.payload.message || "Alert marked as read";
        const idx = state.items.findIndex((a) => a.alertId === action.payload.id);
        if (idx !== -1) state.items[idx].isRead = true;
      })
      .addCase(markRead.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = alertNotificationSlice.actions;
export default alertNotificationSlice.reducer;
