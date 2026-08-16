import { createSlice } from '@reduxjs/toolkit';
import { fetchAllIncidents, createIncident, updateIncident, deleteIncident } from './trafficIncidentActions';

const initialState = {
    incidents: [],
    selectedIncident: null,
    loading: false,
    error: null,
};

const trafficIncidentSlice = createSlice({
    name: 'trafficIncident',
    initialState,
    reducers: {
        setSelectedIncident: (state, action) => {
            state.selectedIncident = action.payload;
        },
        clearIncidentError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllIncidents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllIncidents.fulfilled, (state, action) => {
                state.loading = false;
                state.incidents = action.payload;
            })
            .addCase(fetchAllIncidents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createIncident.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createIncident.fulfilled, (state, action) => {
                state.loading = false;
                // incidents are usually re-fetched after create according to spec, but we can also push
            })
            .addCase(createIncident.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteIncident.fulfilled, (state, action) => {
                state.incidents = state.incidents.filter(i => i.id !== action.meta.arg);
            });
    }
});

export const { setSelectedIncident, clearIncidentError } = trafficIncidentSlice.actions;
export default trafficIncidentSlice.reducer;
