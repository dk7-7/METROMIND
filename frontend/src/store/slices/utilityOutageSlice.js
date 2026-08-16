import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import utilityOutageService from "../../services/utilityOutageService";

const extractError = (error, fallback) =>
  (error.response && error.response.data && error.response.data.error) ||
  error.message ||
  fallback;

export const fetchAll = createAsyncThunk(
  "utilityOutage/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await utilityOutageService.getAll();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractError(error, "Unable to load outages"));
    }
  }
);

export const createOutage = createAsyncThunk(
  "utilityOutage/createOutage",
  async (data, thunkAPI) => {
    try {
      const response = await utilityOutageService.create(data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractError(error, "Overlapping outage registered"));
    }
  }
);

const utilityOutageSlice = createSlice({
  name: "utilityOutage",
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
      .addCase(createOutage.fulfilled, (state) => {
        state.successMessage = "UtilityOutage registered successfully.";
      })
      .addCase(createOutage.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = utilityOutageSlice.actions;
export default utilityOutageSlice.reducer;
