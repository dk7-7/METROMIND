import { createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser, logoutUser } from './authActions';

const initialState = {
    token: localStorage.getItem('token') || null,
    username: localStorage.getItem('username') || null,
    role: localStorage.getItem('role') || null,
    user: localStorage.getItem('username') ? { username: localStorage.getItem('username'), role: localStorage.getItem('role') } : null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.username = action.payload.username;
                state.role = action.payload.role;
                state.user = { username: action.payload.username, role: action.payload.role };
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.token = null;
                state.username = null;
                state.role = null;
                state.user = null;
            });
    }
});
export const { clearError } = authSlice.actions;
export default authSlice.reducer;
