import { createSlice } from '@reduxjs/toolkit';
import { fetchAllIncidents, createIncident, updateIncident, deleteIncident } from './trafficIncidentActions';

const trafficIncidentSlice = createSlice({
    name: 'trafficIncident',
    initialState: {
        incidents: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearIncidentError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllIncidents.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAllIncidents.fulfilled, (state, action) => { state.loading = false; state.incidents = action.payload; })
            .addCase(fetchAllIncidents.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(createIncident.rejected, (state, action) => { state.error = action.payload; })
            .addCase(updateIncident.rejected, (state, action) => { state.error = action.payload; })
            .addCase(deleteIncident.fulfilled, (state, action) => {
                state.incidents = state.incidents.filter(i => i.id !== action.payload);
            })
            .addCase(deleteIncident.rejected, (state, action) => { state.error = action.payload; });
    }
});
export const { clearIncidentError } = trafficIncidentSlice.actions;
export default trafficIncidentSlice.reducer;
