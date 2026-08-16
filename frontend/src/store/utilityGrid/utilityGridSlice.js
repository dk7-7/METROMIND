import { createSlice } from '@reduxjs/toolkit';
import { fetchAllGrids } from './utilityGridActions';

const utilityGridSlice = createSlice({
    name: 'utilityGrid',
    initialState: {
        grids: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearGridError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllGrids.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAllGrids.fulfilled, (state, action) => { state.loading = false; state.grids = action.payload; })
            .addCase(fetchAllGrids.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    }
});
export const { clearGridError } = utilityGridSlice.actions;
export default utilityGridSlice.reducer;
