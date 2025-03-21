// API 基础 URL，使用CORS代理解决CORS问题
// 开发环境使用本地API，生产环境使用AllOrigins CORS代理
// 添加注释触发重新部署
// 由于直接请求和corsproxy.io存在问题，改用AllOrigins代理

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

export const API_BASE_URL = `${CORS_PROXY}${encodeURIComponent('https://agile-tender.up.railway.app')}`;

// 确保 API 路径包含 /api
export const API_URL = `${API_BASE_URL}/api`;

// 存储 URL
export const STORAGE_URL = process.env.REACT_APP_SUPABASE_URL + '/storage/v1/object/public/bid_documents';

// 添加调试日志
console.log('Environment:', process.env.NODE_ENV);
console.log('API Base URL:', API_BASE_URL);
console.log('API URL with path:', API_URL);
console.log('Storage URL:', STORAGE_URL); 