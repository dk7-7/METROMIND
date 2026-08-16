import utilityGridService from './utilityGridService';

const outageService = {
    register: async (gridId, data) => {
        return utilityGridService.registerOutage(gridId, data);
    }
};

export default outageService;
