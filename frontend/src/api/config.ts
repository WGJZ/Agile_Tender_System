// API 基础 URL，使用CORS代理解决CORS问题
// 开发环境使用本地API，生产环境使用CORS代理
// 添加注释触发重新部署
const CORS_PROXY = 'https://corsproxy.io/?';

export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? `${CORS_PROXY}${encodeURIComponent('https://agile-tender.up.railway.app')}` 
  : (process.env.REACT_APP_API_URL || 'https://agile-tender.up.railway.app');

// 确保 API 路径包含 /api
export const API_URL = `${API_BASE_URL}/api`;

// 存储 URL
export const STORAGE_URL = process.env.REACT_APP_SUPABASE_URL + '/storage/v1/object/public/bid_documents';

// 添加调试日志
console.log('Environment:', process.env.NODE_ENV);
console.log('API Base URL:', API_BASE_URL);
console.log('API URL with path:', API_URL);
console.log('Storage URL:', STORAGE_URL); 