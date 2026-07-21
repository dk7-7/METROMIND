import { createSlice } from '@reduxjs/toolkit';

const trafficZoneSlice = createSlice({
  name: 'trafficZones',
  initialState: {
    items: [],
    loading: false,
    error: null,
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
  },
});

export const { setItems, setLoading, setError } = trafficZoneSlice.actions;
export default trafficZoneSlice.reducer;
