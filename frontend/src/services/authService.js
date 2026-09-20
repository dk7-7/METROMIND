import api from './api';

const decodeJwt = (token) => {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("JWT Decode Error:", error);
    return null;
  }
};

export const login = async (credentials) => {
  const email = credentials?.email || credentials?.username || null;

  console.group("========== LOGIN START ==========");
  console.log("Login Credentials:", {
    email: email
  });
  console.groupEnd();

  let response;
  try {
    response = await api.post('/auth/login', credentials);
  } catch (error) {
    console.error("========== LOGIN FAILED ==========");
    console.error("Login Error:", error);
    throw error;
  }

  console.log("API Response:", response.data);

  const token = response.data?.token || null;
  console.log("Token received:", token);

  const role = response.data?.role !== undefined ? response.data.role : null;
  console.log("Initial Role:", role);

  const name = response.data?.name || response.data?.fullName || null;
  console.log("Email:", email);
  console.log("Name:", name);

  let decodedToken = null;
  if (token) {
    decodedToken = decodeJwt(token);
  }
  console.log("Decoded JWT:", decodedToken);

  const finalRole = response.data?.role || decodedToken?.role || (Array.isArray(decodedToken?.roles) ? decodedToken.roles[0] : null) || null;
  const finalEmail = response.data?.email || decodedToken?.email || response.data?.username || email || decodedToken?.sub || null;
  const finalName = name || decodedToken?.name || null;

  console.group("Final Authentication Details:");
  console.log("Role:", finalRole);
  console.log("Email:", finalEmail);
  console.log("Name:", finalName);
  console.groupEnd();

  if (response.data && response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('username', response.data.username);
    localStorage.setItem('role', response.data.role);
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
};

const authService = {
  login,
  register,
  logout,
};

export default authService;