import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import utilityGridService from "../../services/utilityGridService";

const extractError = (error, fallback) =>
  (error.response && error.response.data && error.response.data.error) ||
  error.message ||
  fallback;

export const fetchAll = createAsyncThunk(
  "utilityGrid/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await utilityGridService.getAll();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractError(error, "Unable to load grids"));
    }
  }
);

export const updateGrid = createAsyncThunk(
  "utilityGrid/updateGrid",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await utilityGridService.update(id, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractError(error, "Unable to update grid"));
    }
  }
);

export const registerOutageOnGrid = createAsyncThunk(
  "utilityGrid/registerOutageOnGrid",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await utilityGridService.registerOutage(id, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractError(error, "Unable to register outage"));
    }
  }
);

const utilityGridSlice = createSlice({
  name: "utilityGrid",
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
      .addCase(updateGrid.fulfilled, (state, action) => {
        state.successMessage = "UtilityGrid updated successfully.";
        const idx = state.items.findIndex((g) => g.gridId === action.payload.gridId);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateGrid.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(registerOutageOnGrid.fulfilled, (state) => {
        state.successMessage = "Outage registered successfully.";
      })
      .addCase(registerOutageOnGrid.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = utilityGridSlice.actions;
export default utilityGridSlice.reducer;
