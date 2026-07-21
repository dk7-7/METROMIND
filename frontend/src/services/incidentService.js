import api from './api';

const MOCK_INCIDENTS_KEY = 'utility_mock_incidents';

const getMockIncidents = () => {
  const data = localStorage.getItem(MOCK_INCIDENTS_KEY);
  if (!data) {
    // Seed initial high quality mock data
    const initial = [
      {
        id: 'inc-101',
        title: 'High Voltage Transformer Sparking',
        description: 'Substation 4B main transformer has visible sparking and oil pressure warning.',
        type: 'POWER',
        severity: 'CRITICAL',
        status: 'INVESTIGATING',
        reporter: 'Admin',
        gridId: 'grid-1',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hrs ago
      },
      {
        id: 'inc-102',
        title: 'Water Main Pipe Fracture',
        description: '6-inch water main burst causing low pressure and minor street flooding.',
        type: 'WATER',
        severity: 'HIGH',
        status: 'IN_PROGRESS',
        reporter: 'Sarah Jenkins',
        gridId: 'grid-2',
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(), // 8 hrs ago
      },
      {
        id: 'inc-103',
        title: 'Gas Line Pressure Anomaly',
        description: 'Customer reports odor of gas. Pressure sensors detect minor drop.',
        type: 'GAS',
        severity: 'CRITICAL',
        status: 'OPEN',
        reporter: 'Operator 1',
        gridId: 'grid-3',
        createdAt: new Date(Date.now() - 600000).toISOString(), // 10 mins ago
      },
      {
        id: 'inc-104',
        title: 'Fiber Cable Severed',
        description: 'Fiber line cut during road excavation work. Major telecom outage in sector 12.',
        type: 'TELECOM',
        severity: 'HIGH',
        status: 'RESOLVED',
        reporter: 'Mark R.',
        gridId: 'grid-4',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
      }
    ];
    localStorage.setItem(MOCK_INCIDENTS_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

const saveMockIncidents = (incidents) => {
  localStorage.setItem(MOCK_INCIDENTS_KEY, JSON.stringify(incidents));
};

const mapBackendIncidentToFrontend = (inc) => {
  if (!inc) return null;
  return {
    id: inc.incidentId?.toString() || inc.id,
    title: inc.title,
    description: inc.description,
    type: inc.incidentType || inc.type,
    severity: inc.severity,
    status: inc.status,
    reporter: inc.reportedBy?.fullName || inc.reporter || 'Operator',
    gridId: inc.zone?.zoneId?.toString() || inc.gridId || '1',
    createdAt: inc.reportedAt || inc.createdAt,
  };
};

export const getIncidents = async () => {
  try {
    const response = await api.get('/incidents');
    return Array.isArray(response.data) ? response.data.map(mapBackendIncidentToFrontend) : [];
  } catch (error) {
    console.warn('Real API getIncidents failed, returning mock data');
    return getMockIncidents();
  }
};

export const getIncidentById = async (id) => {
  try {
    const response = await api.get(`/incidents/${id}`);
    return mapBackendIncidentToFrontend(response.data);
  } catch (error) {
    console.warn(`Real API getIncidentById (${id}) failed, returning mock item`);
    return getMockIncidents().find(i => i.id === id) || null;
  }
};

export const createIncident = async (incident) => {
  try {
    const zoneId = parseInt(incident.gridId) || 1;
    const backendIncident = {
      title: incident.title,
      description: incident.description,
      incidentType: incident.type,
      severity: incident.severity,
      status: incident.status || 'REPORTED',
      zone: { zoneId }
    };
    const response = await api.post('/incidents', backendIncident);
    return response.data;
  } catch (error) {
    console.warn('Real API createIncident failed, saving to mock storage');
    const list = getMockIncidents();
    const newIncident = {
      ...incident,
      id: `inc-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      status: incident.status || 'OPEN'
    };
    list.unshift(newIncident);
    saveMockIncidents(list);
    return newIncident;
  }
};

export const updateIncident = async (id, incident) => {
  try {
    const zoneId = parseInt(incident.gridId) || 1;
    const backendIncident = {
      incidentId: parseInt(id),
      title: incident.title,
      description: incident.description,
      incidentType: incident.type,
      severity: incident.severity,
      status: incident.status,
      zone: { zoneId }
    };
    const response = await api.put(`/incidents/${id}`, backendIncident);
    return response.data;
  } catch (error) {
    console.warn(`Real API updateIncident (${id}) failed, updating mock storage`);
    const list = getMockIncidents();
    const index = list.findIndex(i => i.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...incident };
      saveMockIncidents(list);
      return list[index];
    }
    throw new Error('Incident not found');
  }
};

export const deleteIncident = async (id) => {
  try {
    const response = await api.delete(`/incidents/${id}`);
    return response.data;
  } catch (error) {
    console.warn(`Real API deleteIncident (${id}) failed, deleting from mock storage`);
    const list = getMockIncidents();
    const filtered = list.filter(i => i.id !== id);
    saveMockIncidents(filtered);
    return { success: true };
  }
};
