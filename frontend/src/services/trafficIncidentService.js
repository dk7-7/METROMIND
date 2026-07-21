import * as incidentService from './incidentService';

export * from './incidentService';

const trafficIncidentService = {
  ...incidentService,
  fetchAll: incidentService.getIncidents,
  getAll: incidentService.getIncidents,
  getById: incidentService.getIncidentById,
  create: incidentService.createIncident,
  update: incidentService.updateIncident,
  delete: incidentService.deleteIncident,
};

export default trafficIncidentService;
