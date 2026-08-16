import { createAsyncThunk } from '@reduxjs/toolkit';
import utilityGridService from '../../services/utilityGridService';

export const fetchAllGrids = createAsyncThunk(
    'utilityGrid/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await utilityGridService.getAll();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch grids');
        }
    }
);
