// API 基础 URL，优先使用环境变量，否则使用生产环境 URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://agile-tender.up.railway.app';

// 确保 API 路径包含 /api
export const API_URL = `${API_BASE_URL}/api`;

// 存储 URL
export const STORAGE_URL = process.env.REACT_APP_SUPABASE_URL + '/storage/v1/object/public/bid_documents';

// 添加调试日志
console.log('Environment:', process.env.NODE_ENV);
console.log('API Base URL:', API_BASE_URL);
console.log('API URL with path:', API_URL);
console.log('Storage URL:', STORAGE_URL); 