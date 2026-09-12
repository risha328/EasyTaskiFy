import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token and Active Organization ID
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('taskflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const activeOrgId = localStorage.getItem('taskflow_active_org_id');
    if (activeOrgId) {
      config.headers['x-organization-id'] = activeOrgId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiry / 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
        localStorage.removeItem('taskflow_token');
      }
    }
    return Promise.reject(error);
  }
);

export const fetchHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

// Auth API Methods
export const registerApi = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

export const loginApi = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const fetchMeApi = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

export const logoutApi = async () => {
  const response = await apiClient.post('/auth/logout');
  return response.data;
};

// Organization API Methods
export const createOrgApi = async (name, adminEmail) => {
  const response = await apiClient.post('/organizations', { name, adminEmail });
  return response.data;
};

export const fetchMyOrgsApi = async () => {
  const response = await apiClient.get('/organizations/my');
  return response.data;
};

export const fetchOrgMembersApi = async (orgId) => {
  const response = await apiClient.get(`/organizations/${orgId}/members`);
  return response.data;
};

export const addOrgMemberApi = async (orgId, email, role) => {
  const response = await apiClient.post(`/organizations/${orgId}/members`, { email, role });
  return response.data;
};

export const removeOrgMemberApi = async (orgId, userId) => {
  const response = await apiClient.delete(`/organizations/${orgId}/members/${userId}`);
  return response.data;
};
