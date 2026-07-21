import api from './api';

const MOCK_GRIDS_KEY = 'utility_mock_grids';

const getMockGrids = () => {
  const data = localStorage.getItem(MOCK_GRIDS_KEY);
  if (!data) {
    // Seed initial mock grid sectors
    const initial = [
      {
        id: 'grid-1',
        name: 'Substation 4B (North Sector)',
        type: 'POWER',
        capacity: '450 MW',
        currentLoad: '380 MW',
        status: 'WARNING',
        location: 'Downtown North / Metro Area',
        lastMaintenance: '2026-03-15',
      },
      {
        id: 'grid-2',
        name: 'Metro Water Reservoirs (East Zone)',
        type: 'WATER',
        capacity: '120k Gal/m',
        currentLoad: '95k Gal/m',
        status: 'OPTIMAL',
        location: 'Eastgate Heights',
        lastMaintenance: '2026-05-10',
      },
      {
        id: 'grid-3',
        name: 'Gas Distribution Hub C',
        type: 'GAS',
        capacity: '500k CF/h',
        currentLoad: '480k CF/h',
        status: 'CRITICAL',
        location: 'Industrial Park West',
        lastMaintenance: '2026-01-20',
      },
      {
        id: 'grid-4',
        name: 'Telecom Node Alpha',
        type: 'TELECOM',
        capacity: '10 Gbps',
        currentLoad: '7.8 Gbps',
        status: 'OPTIMAL',
        location: 'Tech Ridge Core',
        lastMaintenance: '2026-06-01',
      }
    ];
    localStorage.setItem(MOCK_GRIDS_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

const saveMockGrids = (grids) => {
  localStorage.setItem(MOCK_GRIDS_KEY, JSON.stringify(grids));
};

const mapStatusToFrontend = (status) => {
  if (status === 'OPERATIONAL') return 'OPTIMAL';
  if (status === 'DEGRADED') return 'WARNING';
  if (status === 'OFFLINE') return 'CRITICAL';
  return status || 'OPTIMAL';
};

const mapStatusToBackend = (status) => {
  if (status === 'OPTIMAL') return 'OPERATIONAL';
  if (status === 'WARNING') return 'DEGRADED';
  if (status === 'CRITICAL') return 'OFFLINE';
  return status || 'OPERATIONAL';
};

const mapBackendGridToFrontend = (g) => {
  if (!g) return null;
  return {
    id: g.gridId?.toString() || g.id,
    name: g.gridName || g.name,
    type: g.gridType || g.type,
    capacity: g.capacityUnits ? `${g.capacityUnits} MW` : g.capacity,
    currentLoad: g.currentLoad !== undefined ? `${g.currentLoad} MW` : g.currentLoad,
    status: mapStatusToFrontend(g.status),
    location: g.district || g.location || 'Unknown',
    lastMaintenance: g.lastInspectedAt ? g.lastInspectedAt.split('T')[0] : (g.lastMaintenance || new Date().toISOString().split('T')[0])
  };
};

export const getUtilityGrids = async () => {
  try {
    const response = await api.get('/grids');
    return Array.isArray(response.data) ? response.data.map(mapBackendGridToFrontend) : [];
  } catch (error) {
    console.warn('Real API getUtilityGrids failed, returning mock data');
    return getMockGrids();
  }
};

export const getUtilityGridById = async (id) => {
  try {
    const response = await api.get(`/grids/${id}`);
    return mapBackendGridToFrontend(response.data);
  } catch (error) {
    console.warn(`Real API getUtilityGridById (${id}) failed, returning mock grid`);
    return getMockGrids().find(g => g.id === id) || null;
  }
};

export const createUtilityGrid = async (grid) => {
  try {
    const backendGrid = {
      gridName: grid.name,
      gridType: grid.type,
      district: grid.location,
      capacityUnits: parseFloat(grid.capacity) || 0,
      currentLoad: parseFloat(grid.currentLoad) || 0,
      status: mapStatusToBackend(grid.status || 'OPTIMAL'),
      lastInspectedAt: grid.lastMaintenance ? new Date(grid.lastMaintenance).toISOString() : new Date().toISOString()
    };
    const response = await api.post('/grids', backendGrid);
    return mapBackendGridToFrontend(response.data);
  } catch (error) {
    console.warn('Real API createUtilityGrid failed, saving mock grid');
    const list = getMockGrids();
    const newGrid = {
      ...grid,
      id: `grid-${Date.now().toString().slice(-4)}`,
      status: grid.status || 'OPTIMAL'
    };
    list.unshift(newGrid);
    saveMockGrids(list);
    return newGrid;
  }
};

export const updateUtilityGrid = async (id, grid) => {
  try {
    const backendGrid = {
      gridId: parseInt(id),
      gridName: grid.name,
      gridType: grid.type,
      district: grid.location,
      capacityUnits: parseFloat(grid.capacity) || 0,
      currentLoad: parseFloat(grid.currentLoad) || 0,
      status: mapStatusToBackend(grid.status || 'OPTIMAL'),
      lastInspectedAt: grid.lastMaintenance ? new Date(grid.lastMaintenance).toISOString() : new Date().toISOString()
    };
    const response = await api.put(`/grids/${id}`, backendGrid);
    return mapBackendGridToFrontend(response.data);
  } catch (error) {
    console.warn(`Real API updateUtilityGrid (${id}) failed, updating mock grid`);
    const list = getMockGrids();
    const index = list.findIndex(g => g.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...grid };
      saveMockGrids(list);
      return list[index];
    }
    throw new Error('Grid sector not found');
  }
};

export const deleteUtilityGrid = async (id) => {
  try {
    const response = await api.delete(`/grids/${id}`);
    return response.data;
  } catch (error) {
    console.warn(`Real API deleteUtilityGrid (${id}) failed, deleting mock grid`);
    const list = getMockGrids();
    const filtered = list.filter(g => g.id !== id);
    saveMockGrids(filtered);
    return { success: true };
  }
};
