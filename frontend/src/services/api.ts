import axios from 'axios';

// 获取当前环境的URL
const getBaseUrl = () => {
  // 在开发环境中使用本地服务器
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8000';
  }
  
  // 在生产环境中使用Vercel无服务器API
  return '';  // 空字符串表示相对路径，将使用当前域名
};

const baseURL = getBaseUrl();

// 创建axios实例
const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器，添加认证token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API服务
const api = {
  auth: {
    login: async (username: string, password: string) => {
      const response = await apiClient.post('/api/auth/token', { username, password });
      return response.data;
    },
    register: async (userData: any) => {
      const response = await apiClient.post('/api/auth/register', userData);
      return response.data;
    },
  },
  tenders: {
    getAll: async () => {
      const response = await apiClient.get('/api/tenders');
      return response.data;
    },
    getPublic: async () => {
      const response = await apiClient.get('/api/tenders/public');
      return response.data;
    },
    getById: async (id: string, isPublic = false) => {
      const endpoint = isPublic ? `/api/tenders/public/${id}` : `/api/tenders/${id}`;
      const response = await apiClient.get(endpoint);
      return response.data;
    },
    create: async (tenderData: any) => {
      const response = await apiClient.post('/api/tenders', tenderData);
      return response.data;
    },
    update: async (id: string, tenderData: any) => {
      const response = await apiClient.put(`/api/tenders/${id}`, tenderData);
      return response.data;
    },
    delete: async (id: string) => {
      const response = await apiClient.delete(`/api/tenders/${id}`);
      return response.data;
    },
    getBids: async (tenderId: string) => {
      const response = await apiClient.get(`/api/tenders/${tenderId}/bids`);
      return response.data;
    },
  },
  bids: {
    create: async (tenderId: string, bidData: any) => {
      const response = await apiClient.post(`/api/tenders/${tenderId}/bids`, bidData);
      return response.data;
    },
    getAll: async () => {
      const response = await apiClient.get('/api/bids');
      return response.data;
    },
  },
  users: {
    getProfile: async () => {
      const response = await apiClient.get('/api/users/profile');
      return response.data;
    },
    updateProfile: async (profileData: any) => {
      const response = await apiClient.put('/api/users/profile', profileData);
      return response.data;
    },
  },
};

export default api; 