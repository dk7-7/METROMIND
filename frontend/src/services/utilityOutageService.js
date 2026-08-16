import api from "./api";

const getAll = () => api.get("/outages");
const create = (data) => api.post("/outages", data);

const utilityOutageService = { getAll, create };
export default utilityOutageService;
