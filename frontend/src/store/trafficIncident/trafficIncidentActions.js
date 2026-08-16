import { createAsyncThunk } from '@reduxjs/toolkit';
import trafficIncidentService from '../../services/trafficIncidentService';

export const fetchAllIncidents = createAsyncThunk('trafficIncident/fetchAll', async (_, { rejectWithValue }) => {
    try {
        return await trafficIncidentService.getAll();
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch incidents');
    }
});

export const createIncident = createAsyncThunk('trafficIncident/create', async (data, { rejectWithValue }) => {
    try {
        return await trafficIncidentService.create(data);
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || 'unable to save incident');
    }
});

export const updateIncident = createAsyncThunk('trafficIncident/update', async ({id, data}, { rejectWithValue }) => {
    try {
        return await trafficIncidentService.update(id, data);
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || 'unable to update incident');
    }
});

export const deleteIncident = createAsyncThunk('trafficIncident/delete', async (id, { rejectWithValue }) => {
    try {
        await trafficIncidentService.delete(id);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || 'Failed to delete incident');
    }
});
