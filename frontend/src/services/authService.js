import api from "./api";

const login = (credentials) => api.post("/auth/login", credentials);
const register = (userData) => api.post("/auth/register", userData);
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
};

const authService = { login, register, logout };
export default authService;
