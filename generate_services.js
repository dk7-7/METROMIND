const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');

const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const write = (filePath, content) => {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
};

const apiJs = `
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
            localStorage.removeItem('username');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
`;

const authServiceJs = `
import api from './api';

const authService = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data; // Expected: token, username, role
    },
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
    }
};
export default authService;
`;

const trafficIncidentServiceJs = `
import api from './api';

const trafficIncidentService = {
    getAll: () => api.get('/incidents').then(res => res.data),
    getById: (id) => api.get(\`/incidents/\${id}\`).then(res => res.data),
    create: (data) => api.post('/incidents', data).then(res => res.data),
    update: (id, data) => api.put(\`/incidents/\${id}\`, data).then(res => res.data),
    delete: (id) => api.delete(\`/incidents/\${id}\`).then(res => res.data),
    dispatch: (id) => api.put(\`/incidents/\${id}/dispatch\`).then(res => res.data),
};
export default trafficIncidentService;
`;

const trafficZoneServiceJs = `
import api from './api';

const trafficZoneService = {
    getAll: () => api.get('/zones').then(res => res.data),
    getById: (id) => api.get(\`/zones/\${id}\`).then(res => res.data),
    getCongested: () => api.get('/zones/congested').then(res => res.data),
    delete: (id) => api.delete(\`/zones/\${id}\`).then(res => res.data),
};
export default trafficZoneService;
`;

const utilityGridServiceJs = `
import api from './api';

const utilityGridService = {
    getAll: () => api.get('/grids').then(res => res.data),
    getById: (id) => api.get(\`/grids/\${id}\`).then(res => res.data),
    update: (id, data) => api.put(\`/grids/\${id}\`, data).then(res => res.data),
    registerOutage: (id, data) => api.post(\`/grids/\${id}/outages\`, data).then(res => res.data),
};
export default utilityGridService;
`;

const outageServiceJs = `
import api from './api';
// Mostly handled by utilityGridService registerOutage, but if needed:
const outageService = {
    register: (gridId, data) => api.post(\`/grids/\${gridId}/outages\`, data).then(res => res.data),
};
export default outageService;
`;

const alertServiceJs = `
import api from './api';

const alertService = {
    getAll: () => api.get('/alerts').then(res => res.data),
    markRead: (id) => api.put(\`/alerts/\${id}/read\`).then(res => res.data),
};
export default alertService;
`;

write(path.join(srcDir, 'services', 'api.js'), apiJs);
write(path.join(srcDir, 'services', 'authService.js'), authServiceJs);
write(path.join(srcDir, 'services', 'trafficIncidentService.js'), trafficIncidentServiceJs);
write(path.join(srcDir, 'services', 'trafficZoneService.js'), trafficZoneServiceJs);
write(path.join(srcDir, 'services', 'utilityGridService.js'), utilityGridServiceJs);
write(path.join(srcDir, 'services', 'outageService.js'), outageServiceJs);
write(path.join(srcDir, 'services', 'alertService.js'), alertServiceJs);

console.log("Services generated successfully.");
