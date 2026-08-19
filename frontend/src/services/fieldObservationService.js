import api from "./api";

const getAll = () => api.get("/observations");
const create = (data) => api.post("/observations", data);

const fieldObservationService = { getAll, create };
export default fieldObservationService;
