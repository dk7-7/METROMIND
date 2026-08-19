import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import trafficIncidentReducer from "./slices/trafficIncidentSlice";
import trafficZoneReducer from "./slices/trafficZoneSlice";
import utilityGridReducer from "./slices/utilityGridSlice";
import utilityOutageReducer from "./slices/utilityOutageSlice";
import alertNotificationReducer from "./slices/alertNotificationSlice";
import fieldObservationReducer from "./slices/fieldObservationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    trafficIncident: trafficIncidentReducer,
    trafficZone: trafficZoneReducer,
    utilityGrid: utilityGridReducer,
    utilityOutage: utilityOutageReducer,
    alertNotification: alertNotificationReducer,
    fieldObservation: fieldObservationReducer,
  },
});

export default store;
