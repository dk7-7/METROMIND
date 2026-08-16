import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fieldObservationService from "../../services/fieldObservationService";

const extractError = (error, fallback) =>
  (error.response && error.response.data && error.response.data.error) ||
  error.message ||
  fallback;

export const fetchAll = createAsyncThunk(
  "fieldObservation/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await fieldObservationService.getAll();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractError(error, "Unable to load observations"));
    }
  }
);

export const createObservation = createAsyncThunk(
  "fieldObservation/createObservation",
  async (data, thunkAPI) => {
    try {
      const response = await fieldObservationService.create(data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractError(error, "Unable to save observation"));
    }
  }
);

const fieldObservationSlice = createSlice({
  name: "fieldObservation",
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
      .addCase(createObservation.fulfilled, (state) => {
        state.successMessage = "FieldObservation submitted successfully.";
      })
      .addCase(createObservation.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = fieldObservationSlice.actions;
export default fieldObservationSlice.reducer;
