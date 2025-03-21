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

// API配置和请求函数
const API_URL = '/api';

// 基本HTTP请求函数
const get = async (url: string) => {
  try {
    console.log(`发送GET请求到: ${API_URL}${url}`);
    const response = await fetch(`${API_URL}${url}`);
    
    // 检查响应状态
    if (!response.ok) {
      throw new Error(`API返回错误: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`请求失败: ${error}`);
    throw error;
  }
};

const post = async (url: string, data: any) => {
  try {
    console.log(`发送POST请求到: ${API_URL}${url}`);
    const response = await fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    // 检查响应状态
    if (!response.ok) {
      throw new Error(`API返回错误: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`请求失败: ${error}`);
    throw error;
  }
};

// API接口
const api = {
  tenders: {
    getAll: () => get('/tenders/'),
    getById: (id: string, isPublic?: boolean) => {
      const url = isPublic 
        ? `/tenders/public/${id}/` 
        : `/tenders/${id}/`;
      return get(url);
    },
    getBids: (tenderId: string) => get(`/tenders/${tenderId}/bids/`),
    create: (tenderData: any) => post('/tenders/create/', tenderData),
    update: (id: string, tenderData: any) => post(`/tenders/${id}/update/`, tenderData),
    delete: (id: string) => post(`/tenders/${id}/delete/`, {}),
    toggleVisibility: (id: string, isPublic: boolean) => post(`/tenders/${id}/toggle-visibility/`, { is_public: isPublic }),
  },
  bids: {
    create: (tenderId: string, bidData: any) => post(`/bids/create/${tenderId}/`, bidData),
    getAll: () => get('/bids/'),
    getMyBids: () => get('/bids/my-bids/')
  },
  auth: {
    login: (credentials: { username: string, password: string }) => 
      post('/auth/token/', credentials),
    register: (userData: any) => post('/auth/register/', userData),
  },
  public: {
    getTenders: () => {
      console.log('使用公开API路径');
      return get('/tenders/public/');
    }
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