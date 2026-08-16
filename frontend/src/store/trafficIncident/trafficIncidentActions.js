import { createAsyncThunk } from '@reduxjs/toolkit';
import trafficIncidentService from '../../services/trafficIncidentService';

export const fetchAllIncidents = createAsyncThunk(
    'trafficIncident/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await trafficIncidentService.getAll();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch incidents');
        }
    }
);

export const createIncident = createAsyncThunk(
    'trafficIncident/create',
    async (data, { rejectWithValue }) => {
        try {
            return await trafficIncidentService.create(data);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create incident');
        }
    }
);

export const updateIncident = createAsyncThunk(
    'trafficIncident/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            return await trafficIncidentService.update(id, data);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update incident');
        }
    }
);

export const deleteIncident = createAsyncThunk(
    'trafficIncident/delete',
    async (id, { rejectWithValue }) => {
        try {
            return await trafficIncidentService.delete(id);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete incident');
        }
    }
);
