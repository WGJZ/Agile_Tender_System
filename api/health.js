// 健康检查API端点
export default async function handler(req, res) {
  res.status(200).json({ 
    status: 'healthy',
    time: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
} 