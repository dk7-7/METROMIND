import { createSlice } from '@reduxjs/toolkit';

const trafficIncidentSlice = createSlice({
  name: 'trafficIncidents',
  initialState: {
    items: [],
    selectedItem: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    setItems(state, action) {
      state.items = action.payload;
      state.loading = false;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    setSelectedItem(state, action) {
      state.selectedItem = action.payload;
    },
    setSuccessMessage(state, action) {
      state.successMessage = action.payload;
    },
    clearMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
    addItem(state, action) {
      state.items.unshift(action.payload);
    },
    updateItem(state, action) {
      const index = state.items.findIndex(
        (item) => item.incidentId === action.payload.incidentId
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeItem(state, action) {
      state.items = state.items.filter(
        (item) => item.incidentId !== action.payload
      );
    },
  },
});

export const {
  setItems,
  setLoading,
  setError,
  setSelectedItem,
  setSuccessMessage,
  clearMessages,
  addItem,
  updateItem,
  removeItem,
} = trafficIncidentSlice.actions;

export default trafficIncidentSlice.reducer;
