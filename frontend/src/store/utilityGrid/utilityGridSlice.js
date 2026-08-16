import { createSlice } from '@reduxjs/toolkit';
import { fetchAllGrids } from './utilityGridActions';

const initialState = {
    grids: [],
    loading: false,
    error: null,
};

const utilityGridSlice = createSlice({
    name: 'utilityGrid',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllGrids.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllGrids.fulfilled, (state, action) => {
                state.loading = false;
                state.grids = action.payload;
            })
            .addCase(fetchAllGrids.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default utilityGridSlice.reducer;
