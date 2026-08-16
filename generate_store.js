const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');

const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const write = (filePath, content) => {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
};

const authActionsJs = `
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
`;

const authSliceJs = `
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
`;

const trafficIncidentActionsJs = `
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
`;

const trafficIncidentSliceJs = `
import { createSlice } from '@reduxjs/toolkit';
import { fetchAllIncidents, createIncident, updateIncident, deleteIncident } from './trafficIncidentActions';

const trafficIncidentSlice = createSlice({
    name: 'trafficIncident',
    initialState: {
        incidents: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearIncidentError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllIncidents.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAllIncidents.fulfilled, (state, action) => { state.loading = false; state.incidents = action.payload; })
            .addCase(fetchAllIncidents.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(createIncident.rejected, (state, action) => { state.error = action.payload; })
            .addCase(updateIncident.rejected, (state, action) => { state.error = action.payload; })
            .addCase(deleteIncident.fulfilled, (state, action) => {
                state.incidents = state.incidents.filter(i => i.id !== action.payload);
            })
            .addCase(deleteIncident.rejected, (state, action) => { state.error = action.payload; });
    }
});
export const { clearIncidentError } = trafficIncidentSlice.actions;
export default trafficIncidentSlice.reducer;
`;

const trafficZoneActionsJs = `
import { createAsyncThunk } from '@reduxjs/toolkit';
import trafficZoneService from '../../services/trafficZoneService';

export const fetchAllZones = createAsyncThunk('trafficZone/fetchAll', async (_, { rejectWithValue }) => {
    try {
        return await trafficZoneService.getAll();
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch zones');
    }
});

export const deleteZone = createAsyncThunk('trafficZone/delete', async (id, { rejectWithValue }) => {
    try {
        await trafficZoneService.delete(id);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || 'Failed to delete zone');
    }
});
`;

const trafficZoneSliceJs = `
import { createSlice } from '@reduxjs/toolkit';
import { fetchAllZones, deleteZone } from './trafficZoneActions';

const trafficZoneSlice = createSlice({
    name: 'trafficZone',
    initialState: {
        zones: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearZoneError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllZones.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAllZones.fulfilled, (state, action) => { state.loading = false; state.zones = action.payload; })
            .addCase(fetchAllZones.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(deleteZone.fulfilled, (state, action) => {
                state.zones = state.zones.filter(z => z.id !== action.payload);
            })
            .addCase(deleteZone.rejected, (state, action) => { state.error = action.payload; });
    }
});
export const { clearZoneError } = trafficZoneSlice.actions;
export default trafficZoneSlice.reducer;
`;


const utilityGridActionsJs = `
import { createAsyncThunk } from '@reduxjs/toolkit';
import utilityGridService from '../../services/utilityGridService';

export const fetchAllGrids = createAsyncThunk('utilityGrid/fetchAll', async (_, { rejectWithValue }) => {
    try {
        return await utilityGridService.getAll();
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch utility grids');
    }
});
`;

const utilityGridSliceJs = `
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
`;

const alertActionsJs = `
import { createAsyncThunk } from '@reduxjs/toolkit';
import alertService from '../../services/alertService';

export const fetchAllAlerts = createAsyncThunk('alert/fetchAll', async (_, { rejectWithValue }) => {
    try {
        return await alertService.getAll();
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch alerts');
    }
});

export const markAlertRead = createAsyncThunk('alert/markRead', async (id, { rejectWithValue }) => {
    try {
        await alertService.markRead(id);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || 'Failed to mark alert as read');
    }
});
`;

const alertSliceJs = `
import { createSlice } from '@reduxjs/toolkit';
import { fetchAllAlerts, markAlertRead } from './alertActions';

const alertSlice = createSlice({
    name: 'alert',
    initialState: {
        alerts: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearAppAlertError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllAlerts.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAllAlerts.fulfilled, (state, action) => { state.loading = false; state.alerts = action.payload; })
            .addCase(fetchAllAlerts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(markAlertRead.fulfilled, (state, action) => {
                const alert = state.alerts.find(a => a.id === action.payload);
                if (alert) alert.read = true;
            });
    }
});
export const { clearAppAlertError } = alertSlice.actions;
export default alertSlice.reducer;
`;

const storeJs = `
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import trafficIncidentReducer from './trafficIncident/trafficIncidentSlice';
import trafficZoneReducer from './trafficZone/trafficZoneSlice';
import utilityGridReducer from './utilityGrid/utilityGridSlice';
import alertReducer from './alert/alertSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        trafficIncident: trafficIncidentReducer,
        trafficZone: trafficZoneReducer,
        utilityGrid: utilityGridReducer,
        alert: alertReducer,
    }
});
export default store;
`;

write(path.join(srcDir, 'store', 'auth', 'authActions.js'), authActionsJs);
write(path.join(srcDir, 'store', 'auth', 'authSlice.js'), authSliceJs);
write(path.join(srcDir, 'store', 'trafficIncident', 'trafficIncidentActions.js'), trafficIncidentActionsJs);
write(path.join(srcDir, 'store', 'trafficIncident', 'trafficIncidentSlice.js'), trafficIncidentSliceJs);
write(path.join(srcDir, 'store', 'trafficZone', 'trafficZoneActions.js'), trafficZoneActionsJs);
write(path.join(srcDir, 'store', 'trafficZone', 'trafficZoneSlice.js'), trafficZoneSliceJs);
write(path.join(srcDir, 'store', 'utilityGrid', 'utilityGridActions.js'), utilityGridActionsJs);
write(path.join(srcDir, 'store', 'utilityGrid', 'utilityGridSlice.js'), utilityGridSliceJs);
write(path.join(srcDir, 'store', 'alert', 'alertActions.js'), alertActionsJs);
write(path.join(srcDir, 'store', 'alert', 'alertSlice.js'), alertSliceJs);
write(path.join(srcDir, 'store', 'store.js'), storeJs);

// Remove old store slice dir if it exists
const oldSlicesPath = path.join(srcDir, 'store', 'slices');
if (fs.existsSync(oldSlicesPath)) {
    fs.rmSync(oldSlicesPath, { recursive: true, force: true });
}

console.log("Store generated successfully.");
