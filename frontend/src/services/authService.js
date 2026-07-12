import api from './api';

// Simple mock users storage for demonstration if API is down
const MOCK_USERS_KEY = 'utility_mock_users';
const CURRENT_USER_KEY = 'utility_current_user';

const getMockUsers = () => JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
const saveMockUser = (user) => {
  const users = getMockUsers();
  users.push(user);
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

export const login = async (email, password) => {
  try {
    // Attempt real API login
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.warn('Real API Login failed, falling back to mock authentication', error);
    
    // Mock authentication fallback
    const users = getMockUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    // Seed default admin if no users exist
    if (!user && email === 'admin@utility.com' && password === 'admin123') {
      const defaultAdmin = {
        id: '1',
        name: 'System Admin',
        email: 'admin@utility.com',
        role: 'Admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
      };
      localStorage.setItem('token', 'mock-jwt-token-admin');
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(defaultAdmin));
      return { token: 'mock-jwt-token-admin', user: defaultAdmin };
    }

    if (user) {
      const sanitizedUser = { id: user.id, name: user.name, email: user.email, role: user.role || 'Operator' };
      localStorage.setItem('token', `mock-jwt-token-${user.id}`);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sanitizedUser));
      return { token: `mock-jwt-token-${user.id}`, user: sanitizedUser };
    }
    
    throw new Error('Invalid email or password');
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  } catch (error) {
    console.warn('Real API Registration failed, falling back to mock registration', error);
    
    const users = getMockUsers();
    if (users.some(u => u.email === email)) {
      throw new Error('Email already registered');
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role: 'Operator'
    };
    saveMockUser(newUser);
    return { success: true, message: 'Registration successful' };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = () => {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};
