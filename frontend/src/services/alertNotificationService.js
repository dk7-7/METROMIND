import api from "./api";

const getAll = () => api.get("/alerts");
const create = (data) => api.post("/alerts", data);
const markRead = (id) => api.put(`/alerts/${id}/read`);

const alertNotificationService = { getAll, create, markRead };
export default alertNotificationService;
