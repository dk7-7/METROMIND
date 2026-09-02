import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import trafficIncidentReducer from './slices/trafficIncidentSlice';
import trafficZoneReducer from './slices/trafficZoneSlice';
import utilityGridReducer from './slices/utilityGridSlice';
import utilityOutageReducer from './slices/utilityOutageSlice';
import fieldObservationReducer from './slices/fieldObservationSlice';
import alertNotificationReducer from './slices/alertNotificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trafficIncident: trafficIncidentReducer,
    trafficIncidents: trafficIncidentReducer,
    trafficZone: trafficZoneReducer,
    trafficZones: trafficZoneReducer,
    utilityGrid: utilityGridReducer,
    utilityGrids: utilityGridReducer,
    utilityOutage: utilityOutageReducer,
    utilityOutages: utilityOutageReducer,
    fieldObservation: fieldObservationReducer,
    fieldObservations: fieldObservationReducer,
    alertNotification: alertNotificationReducer,
    alertNotifications: alertNotificationReducer,
  },
});

export default store;