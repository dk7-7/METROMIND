import { createAsyncThunk } from '@reduxjs/toolkit';
import alertService from '../../services/alertService';

export const fetchAllAlerts = createAsyncThunk(
    'alert/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await alertService.getAll();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch alerts');
        }
    }
);

export const markAlertRead = createAsyncThunk(
    'alert/markRead',
    async (id, { rejectWithValue }) => {
        try {
            return await alertService.markRead(id);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to mark alert as read');
        }
    }
);
