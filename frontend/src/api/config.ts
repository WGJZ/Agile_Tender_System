// API 基础 URL，直接使用后端API，依赖于后端CORS设置
// 放弃使用CORS代理，因为它在处理嵌套路径时有问题

// 直接使用后端API URL，确保后端CORS配置正确
export const API_BASE_URL = 'https://agile-tender.up.railway.app/api';

// API_URL同样指向基础URL
export const API_URL = API_BASE_URL;

// 存储 URL
export const STORAGE_URL = 'https://ktkwobkdvelxwwvarwcx.supabase.co/storage/v1/object/public/bid_documents';

// 添加调试日志
console.log('Environment:', process.env.NODE_ENV);
console.log('API Base URL:', API_BASE_URL);
console.log('API URL:', API_URL);
console.log('Storage URL:', STORAGE_URL); 