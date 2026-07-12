import { getIncidents } from './incidentService';
import { getUtilityGrids } from './utilityGridService';
import { getUtilityOutages } from './utilityOutageService';

export const getDashboardStats = async () => {
  try {
    const [incidents, grids, outages] = await Promise.all([
      getIncidents(),
      getUtilityGrids(),
      getUtilityOutages(),
    ]);

    const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED').length;
    const resolvedIncidents = incidents.filter(i => i.status === 'RESOLVED').length;
    const criticalGrids = grids.filter(g => g.status === 'CRITICAL').length;
    const activeOutages = outages.filter(o => o.status === 'ACTIVE').length;
    const totalAffectedCustomers = outages
      .filter(o => o.status === 'ACTIVE')
      .reduce((sum, o) => sum + (Number(o.affectedCustomers) || 0), 0);

    return {
      activeIncidents,
      resolvedIncidents,
      criticalGrids,
      activeOutages,
      totalAffectedCustomers,
      totalIncidents: incidents.length,
      totalGrids: grids.length,
      totalOutages: outages.length,
      recentIncidents: incidents.slice(0, 5),
      recentOutages: outages.slice(0, 5),
      grids: grids
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};
