import { API_BASE_URL } from '../utils/constants';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.interceptors = {
      request: null,
      response: null,
    };
  }

  async request(endpoint, options = {}) {
    let url = `${this.baseUrl}${endpoint}`;
    let config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Apply request interceptor if set
    if (this.interceptors.request) {
      config = this.interceptors.request(config);
    }

    try {
      const response = await fetch(url, config);
      let data = null;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const error = new Error(data?.message || 'Something went wrong');
        error.response = { 
          status: response.status, 
          data: data || { message: 'Something went wrong' } 
        };
        throw error;
      }

      return { data, status: response.status };
    } catch (error) {
      if (error.response) {
        throw error;
      }
      const networkError = new Error(error.message || 'Network Error');
      networkError.response = { status: 500, data: { message: error.message || 'Network Error' } };
      throw networkError;
    }
  }

  get(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'GET', headers });
  }

  post(endpoint, body, headers = {}) {
    return this.request(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(body), 
      headers 
    });
  }

  put(endpoint, body, headers = {}) {
    return this.request(endpoint, { 
      method: 'PUT', 
      body: JSON.stringify(body), 
      headers 
    });
  }

  delete(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'DELETE', headers });
  }
}

const api = new ApiClient(API_BASE_URL);

// Request interceptor to attach JWT token
api.interceptors.request = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
};

export default api;
