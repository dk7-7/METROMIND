import api from "./api";

const getAll = () => api.get("/outages");

const utilityOutageService = { getAll };
export default utilityOutageService;
