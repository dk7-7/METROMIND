import { createSlice } from '@reduxjs/toolkit';
import { fetchAllZones, deleteZone } from './trafficZoneActions';

const trafficZoneSlice = createSlice({
    name: 'trafficZone',
    initialState: {
        zones: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearZoneError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllZones.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAllZones.fulfilled, (state, action) => { state.loading = false; state.zones = action.payload; })
            .addCase(fetchAllZones.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(deleteZone.fulfilled, (state, action) => {
                state.zones = state.zones.filter(z => z.id !== action.payload);
            })
            .addCase(deleteZone.rejected, (state, action) => { state.error = action.payload; });
    }
});
export const { clearZoneError } = trafficZoneSlice.actions;
export default trafficZoneSlice.reducer;
