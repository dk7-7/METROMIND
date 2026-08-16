import { createAsyncThunk } from '@reduxjs/toolkit';
import trafficZoneService from '../../services/trafficZoneService';

export const fetchAllZones = createAsyncThunk('trafficZone/fetchAll', async (_, { rejectWithValue }) => {
    try {
        return await trafficZoneService.getAll();
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch zones');
    }
});

export const deleteZone = createAsyncThunk('trafficZone/delete', async (id, { rejectWithValue }) => {
    try {
        await trafficZoneService.delete(id);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || 'Failed to delete zone');
    }
});
