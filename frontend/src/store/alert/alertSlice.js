import { createSlice } from '@reduxjs/toolkit';
import { fetchAllAlerts, markAlertRead } from './alertActions';

const alertSlice = createSlice({
    name: 'alert',
    initialState: {
        alerts: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearAppAlertError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllAlerts.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAllAlerts.fulfilled, (state, action) => { state.loading = false; state.alerts = action.payload; })
            .addCase(fetchAllAlerts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(markAlertRead.fulfilled, (state, action) => {
                const alert = state.alerts.find(a => a.id === action.payload);
                if (alert) alert.read = true;
            });
    }
});
export const { clearAppAlertError } = alertSlice.actions;
export default alertSlice.reducer;
