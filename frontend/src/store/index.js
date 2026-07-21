import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import trafficIncidentReducer from './slices/trafficIncidentSlice';
import trafficZoneReducer from './slices/trafficZoneSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    trafficIncidents: trafficIncidentReducer,
    trafficZones: trafficZoneReducer,
  },
});

export default store;
