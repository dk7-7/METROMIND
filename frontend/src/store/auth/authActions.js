import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const data = await authService.login(credentials);
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || 'Login failed');
    }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const data = await authService.register(userData);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || 'Registration failed');
    }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
    authService.logout();
    return null;
});
