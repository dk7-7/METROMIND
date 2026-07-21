import api from './api';

const MOCK_OUTAGES_KEY = 'utility_mock_outages';

const getMockOutages = () => {
  const data = localStorage.getItem(MOCK_OUTAGES_KEY);
  if (!data) {
    // Seed initial mock outages
    const initial = [
      {
        id: 'out-201',
        title: 'Emergency Substation Maintenance',
        description: 'Critical switch replacement. Power will be shut down temporarily.',
        type: 'POWER',
        affectedCustomers: 1250,
        status: 'ACTIVE',
        gridId: 'grid-1',
        startTime: new Date(Date.now() - 3600000).toISOString(), // 1 hr ago
        estimatedRestoration: new Date(Date.now() + 3600000 * 2).toISOString(), // 2 hrs from now
      },
      {
        id: 'out-202',
        title: 'Scheduled Water Main Flushing',
        description: 'Hydrant and pressure flushing. Low pressure to be expected.',
        type: 'WATER',
        affectedCustomers: 450,
        status: 'SCHEDULED',
        gridId: 'grid-2',
        startTime: new Date(Date.now() + 3600000 * 24).toISOString(), // Tomorrow
        estimatedRestoration: new Date(Date.now() + 3600000 * 28).toISOString(), // Tomorrow + 4 hrs
      },
      {
        id: 'out-203',
        title: 'Unplanned Grid Interruption',
        description: 'Sudden gas pressure safety trigger. Technicians are on-site.',
        type: 'GAS',
        affectedCustomers: 3100,
        status: 'ACTIVE',
        gridId: 'grid-3',
        startTime: new Date(Date.now() - 3600000 * 3).toISOString(), // 3 hrs ago
        estimatedRestoration: new Date(Date.now() + 300000).toISOString(), // 5 mins from now
      }
    ];
    localStorage.setItem(MOCK_OUTAGES_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

const saveMockOutages = (outages) => {
  localStorage.setItem(MOCK_OUTAGES_KEY, JSON.stringify(outages));
};

const mapStatusToFrontend = (status, type) => {
  if (status === 'RESTORED') return 'RESOLVED';
  if (type === 'PLANNED' && status === 'ACTIVE') return 'SCHEDULED';
  return status || 'ACTIVE';
};

const mapBackendOutageToFrontend = (o) => {
  if (!o) return null;
  return {
    id: o.outageId?.toString() || o.id,
    title: o.affectedArea || o.title || 'Outage Event',
    description: o.description || `Grid segment outage of type ${o.outageType}`,
    type: o.grid?.gridType || o.type || 'POWER',
    affectedCustomers: o.grid?.capacityUnits || 100,
    status: mapStatusToFrontend(o.status, o.outageType),
    gridId: o.grid?.gridId?.toString() || o.gridId || '1',
    startTime: o.startTime || new Date().toISOString(),
    estimatedRestoration: o.estimatedRestorationTime || o.estimatedRestoration || new Date().toISOString()
  };
};

export const getUtilityOutages = async () => {
  try {
    const response = await api.get('/outages');
    return Array.isArray(response.data) ? response.data.map(mapBackendOutageToFrontend) : [];
  } catch (error) {
    console.warn('Real API getUtilityOutages failed, returning mock data');
    return getMockOutages();
  }
};

export const getUtilityOutageById = async (id) => {
  try {
    const response = await api.get(`/outages/${id}`);
    return mapBackendOutageToFrontend(response.data);
  } catch (error) {
    console.warn(`Real API getUtilityOutageById (${id}) failed, returning mock outage`);
    return getMockOutages().find(o => o.id === id) || null;
  }
};

export const createUtilityOutage = async (outage) => {
  try {
    const gridId = parseInt(outage.gridId) || 1;
    const outageDto = {
      outageType: outage.status === 'SCHEDULED' ? 'PLANNED' : 'UNPLANNED',
      affectedArea: outage.title,
      severity: 'MEDIUM',
      estimatedRestorationTime: outage.estimatedRestoration ? new Date(outage.estimatedRestoration).toISOString() : null
    };
    const response = await api.post(`/grids/${gridId}/outages`, outageDto);
    return mapBackendOutageToFrontend(response.data);
  } catch (error) {
    console.warn('Real API createUtilityOutage failed, saving mock outage');
    const list = getMockOutages();
    const newOutage = {
      ...outage,
      id: `out-${Date.now().toString().slice(-4)}`,
      status: outage.status || 'SCHEDULED'
    };
    list.unshift(newOutage);
    saveMockOutages(list);
    return newOutage;
  }
};

export const updateUtilityOutage = async (id, outage) => {
  try {
    if (outage.status === 'RESOLVED') {
      const response = await api.put(`/outages/${id}/resolve`, {});
      return mapBackendOutageToFrontend(response.data);
    }
    const outageDto = {
      outageType: outage.status === 'SCHEDULED' ? 'PLANNED' : 'UNPLANNED',
      affectedArea: outage.title,
      severity: 'MEDIUM',
      estimatedRestorationTime: outage.estimatedRestoration ? new Date(outage.estimatedRestoration).toISOString() : null
    };
    const response = await api.put(`/outages/${id}`, outageDto);
    return mapBackendOutageToFrontend(response.data);
  } catch (error) {
    console.warn(`Real API updateUtilityOutage (${id}) failed, updating mock outage`);
    const list = getMockOutages();
    const index = list.findIndex(o => o.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...outage };
      saveMockOutages(list);
      return list[index];
    }
    throw new Error('Outage not found');
  }
};

export const deleteUtilityOutage = async (id) => {
  try {
    const response = await api.delete(`/outages/${id}`);
    return response.data;
  } catch (error) {
    console.warn(`Real API deleteUtilityOutage (${id}) failed, deleting mock outage`);
    const list = getMockOutages();
    const filtered = list.filter(o => o.id !== id);
    saveMockOutages(filtered);
    return { success: true };
  }
};
