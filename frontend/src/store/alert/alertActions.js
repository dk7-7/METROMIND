import { createAsyncThunk } from '@reduxjs/toolkit';
import alertService from '../../services/alertService';

export const fetchAllAlerts = createAsyncThunk('alert/fetchAll', async (_, { rejectWithValue }) => {
    try {
        return await alertService.getAll();
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch alerts');
    }
});

export const markAlertRead = createAsyncThunk('alert/markRead', async (id, { rejectWithValue }) => {
    try {
        await alertService.markRead(id);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || 'Failed to mark alert as read');
    }
});
