import { createAsyncThunk } from '@reduxjs/toolkit';
import trafficZoneService from '../../services/trafficZoneService';

export const fetchAllZones = createAsyncThunk(
    'trafficZone/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await trafficZoneService.getAll();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch zones');
        }
    }
);
