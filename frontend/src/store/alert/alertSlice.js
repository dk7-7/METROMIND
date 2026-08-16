import { createSlice } from '@reduxjs/toolkit';
import { fetchAllAlerts, markAlertRead } from './alertActions';

const initialState = {
    alerts: [],
    loading: false,
    error: null,
};

const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllAlerts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllAlerts.fulfilled, (state, action) => {
                state.loading = false;
                state.alerts = action.payload;
            })
            .addCase(fetchAllAlerts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(markAlertRead.fulfilled, (state, action) => {
                const index = state.alerts.findIndex(a => a.id === action.meta.arg);
                if (index !== -1) {
                    state.alerts[index].isRead = true;
                }
            });
    }
});

export default alertSlice.reducer;
