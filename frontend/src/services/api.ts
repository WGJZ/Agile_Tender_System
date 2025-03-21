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
const API_URL = '';  // 修改为空字符串，使用相对路径

// 基本HTTP请求函数
const get = async (url: string) => {
  try {
    console.log(`发送GET请求到: ${url}`);
    const response = await fetch(`${url}`);
    
    // 检查响应状态
    if (!response.ok) {
      throw new Error(`API返回错误: ${response.status}`);
    }
    
    // 检查内容类型
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // 记录非JSON响应以便调试
      const text = await response.text();
      console.error('收到非JSON响应:', text.substring(0, 150) + '...');
      throw new Error('API未返回JSON数据');
    }
    
    const data = await response.json();
    
    // 处理空响应或预期格式错误
    if (!data) {
      throw new Error('API返回空数据');
    }
    
    // 针对不同API返回格式的处理
    // 如果是tenders API，确保返回tenders数组，即使是空的
    if (url.includes('/tenders') && 'tenders' in data) {
      return data.tenders;
    }
    
    return data;
  } catch (error: any) {
    console.error(`请求失败: ${error}`);
    // 重新抛出错误，但提供更具体的错误消息
    throw new Error(`API请求失败: ${error.message || '未知错误'}`);
  }
};

const post = async (url: string, data: any) => {
  try {
    console.log(`发送POST请求到: ${url}`);
    const response = await fetch(`${url}`, {
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
    getAll: (onlyPublic?: boolean) => {
      const url = onlyPublic ? '/api/tenders/public' : '/api/tenders/';
      return get(url);
    },
    getById: (id: string, isPublic?: boolean) => {
      const url = isPublic 
        ? `/api/tenders/public/${id}` 
        : `/api/tenders/${id}/`;
      return get(url);
    },
    getBids: (tenderId: string) => get(`/api/tenders/${tenderId}/bids/`),
    create: (tenderData: any) => post('/api/tenders/create/', tenderData),
    update: (id: string, tenderData: any) => post(`/api/tenders/${id}/update/`, tenderData),
    delete: (id: string) => post(`/api/tenders/${id}/delete/`, {}),
    toggleVisibility: (id: string, isPublic: boolean) => post(`/api/tenders/${id}/toggle-visibility/`, { is_public: isPublic }),
  },
  bids: {
    create: (tenderId: string, bidData: any) => post(`/api/bids/create/${tenderId}/`, bidData),
    getAll: () => get('/api/bids/'),
    getMyBids: () => get('/api/bids/my-bids/'),
    selectWinner: (bidId: string) => post(`/api/bids/${bidId}/select-winner/`, {})
  },
  auth: {
    login: (credentials: { username: string, password: string }) => 
      post('/api/auth/token/', credentials),
    register: (userData: any) => post('/api/auth/register/', userData),
  },
  public: {
    getTenders: () => {
      console.log('使用公开API路径');
      return get('/api/tenders/public');
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