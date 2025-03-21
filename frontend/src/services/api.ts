import { API_URL } from '../api/config';

// Helper function to get auth token
const getToken = () => localStorage.getItem('token');

// Base fetch function with auth headers
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Token ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    console.log('Fetching:', `${API_URL}${endpoint}`);
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      // 避免使用credentials，因为跨域代理不支持
      // credentials: 'same-origin',
    });

    // Handle 401 Unauthorized
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      window.location.href = '/login';
      throw new Error('Authentication expired. Please login again.');
    }

    return response;
  } catch (error) {
    console.error('API调用错误:', error);
    
    // 如果是CORS错误，尝试提供更多诊断信息
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.log('可能是CORS错误。请检查以下内容:');
      console.log('- 后端CORS配置是否正确');
      console.log('- 后端是否已重新部署');
      console.log('- API地址是否正确:', `${API_URL}${endpoint}`);
    }
    
    throw error;
  }
};

// API functions for different endpoints
export const api = {
  // Auth endpoints
  auth: {
    login: async (username: string, password: string, userType: string) => {
      const response = await apiFetch('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({
          username,
          password,
          user_type: userType.toUpperCase()
        }),
      });
      return response.json();
    },
    register: async (userData: any) => {
      const response = await apiFetch('/auth/register/', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      return response.json();
    },
  },

  // Tenders endpoints
  tenders: {
    getAll: async (includePrivate = true) => {
      const endpoint = includePrivate ? '/tenders/' : '/tenders/public/';
      const response = await apiFetch(endpoint);
      return response.json();
    },
    getById: async (tenderId: string, isPublic = false) => {
      const endpoint = isPublic ? `/tenders/public/${tenderId}/` : `/tenders/${tenderId}/`;
      const response = await apiFetch(endpoint);
      return response.json();
    },
    create: async (tenderData: any) => {
      const response = await apiFetch('/tenders/', {
        method: 'POST',
        body: JSON.stringify(tenderData),
      });
      return response.json();
    },
    update: async (tenderId: string, tenderData: any) => {
      const response = await apiFetch(`/tenders/${tenderId}/`, {
        method: 'PUT',
        body: JSON.stringify(tenderData),
      });
      return response.json();
    },
    delete: async (tenderId: string) => {
      const response = await apiFetch(`/tenders/${tenderId}/`, {
        method: 'DELETE',
      });
      return response;
    },
    updateStatus: async (tenderId: string, status: string) => {
      const response = await apiFetch(`/tenders/${tenderId}/update-status/`, {
        method: 'POST',
        body: JSON.stringify({ status }),
      });
      return response.json();
    },
    getBids: async (tenderId: string) => {
      const response = await apiFetch(`/tenders/${tenderId}/bids/`);
      return response.json();
    },
  },

  // Bids endpoints
  bids: {
    getMyBids: async () => {
      const response = await apiFetch('/bids/my_bids/');
      return response.json();
    },
    getAllBids: async () => {
      const response = await apiFetch('/bids/all/');
      return response.json();
    },
    getById: async (bidId: string) => {
      const response = await apiFetch(`/bids/${bidId}/`);
      return response.json();
    },
    create: async (bidData: any) => {
      const response = await apiFetch('/bids/', {
        method: 'POST',
        body: JSON.stringify(bidData),
      });
      return response.json();
    },
    update: async (bidId: string, bidData: any) => {
      const response = await apiFetch(`/bids/${bidId}/`, {
        method: 'PUT',
        body: JSON.stringify(bidData),
      });
      return response.json();
    },
    delete: async (bidId: string) => {
      const response = await apiFetch(`/bids/${bidId}/`, {
        method: 'DELETE',
      });
      return response;
    },
    selectWinner: async (bidId: string) => {
      const response = await apiFetch(`/bids/${bidId}/select_winner/`, {
        method: 'POST',
      });
      return response.json();
    },
  },
};

export default api; 