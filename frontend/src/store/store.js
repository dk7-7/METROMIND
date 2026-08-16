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
