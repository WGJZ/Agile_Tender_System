import axios from 'axios';

// Get current environment URL
const getBaseUrl = () => {
  // Use local server in development environment
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8000';
  }
  
  // Use Vercel serverless API in production
  return '';  // Empty string means relative path, will use current domain
};

const baseURL = getBaseUrl();

// Create axios instance
const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor, add authentication token
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

// API configuration and request functions
const API_URL = '';  // Changed to empty string, use relative path

// Basic HTTP request functions
const get = async (url: string) => {
  try {
    console.log(`Sending GET request to: ${url}`);
    const response = await fetch(`${url}`);
    
    // Check response status
    if (!response.ok) {
      throw new Error(`API returned error: ${response.status}`);
    }
    
    // Check content type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Log non-JSON response for debugging
      const text = await response.text();
      console.error('Received non-JSON response:', text.substring(0, 150) + '...');
      throw new Error('API did not return JSON data');
    }
    
    const data = await response.json();
    
    // Handle empty response or unexpected format
    if (!data) {
      throw new Error('API returned empty data');
    }
    
    return data;
  } catch (error: any) {
    console.error(`Request failed: ${error}`);
    // Rethrow with more specific error message
    throw new Error(`API request failed: ${error.message || 'Unknown error'}`);
  }
};

const post = async (url: string, data: any) => {
  try {
    console.log(`Sending POST request to: ${url}`);
    const response = await fetch(`${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data),
    });
    
    // Check response status
    if (!response.ok) {
      throw new Error(`API returned error: ${response.status}`);
    }
    
    // Check content type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Log non-JSON response for debugging
      const text = await response.text();
      console.error('Received non-JSON response:', text.substring(0, 150) + '...');
      throw new Error('API did not return JSON data');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Request failed: ${error}`);
    throw error;
  }
};

// API interfaces
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
      console.log('Using public API path');
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