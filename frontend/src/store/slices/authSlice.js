import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { API_BASE_URL as API_URL } from '../../utils/constants';

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { username, password });
      const data = response.data;
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
      }
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    role: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.user = {
          username: action.payload.username,
          role: action.payload.role,
        };
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
