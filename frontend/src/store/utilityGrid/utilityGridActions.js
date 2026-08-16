import { createAsyncThunk } from '@reduxjs/toolkit';
import utilityGridService from '../../services/utilityGridService';

export const fetchAllGrids = createAsyncThunk('utilityGrid/fetchAll', async (_, { rejectWithValue }) => {
    try {
        return await utilityGridService.getAll();
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch utility grids');
    }
});
