import { createSlice } from '@reduxjs/toolkit';
import { fetchAllZones } from './trafficZoneActions';

const initialState = {
    zones: [],
    loading: false,
    error: null,
};

const trafficZoneSlice = createSlice({
    name: 'trafficZone',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllZones.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllZones.fulfilled, (state, action) => {
                state.loading = false;
                state.zones = action.payload;
            })
            .addCase(fetchAllZones.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default trafficZoneSlice.reducer;
