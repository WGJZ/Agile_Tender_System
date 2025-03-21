// 处理投标创建请求
export default function handler(req, res) {
  // 允许跨域请求
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // 在实际应用中，这里会保存数据到数据库
  // 现在我们只返回成功响应
  res.status(201).json({
    message: 'Bid created successfully',
    id: Math.floor(Math.random() * 1000) + 10, // 随机ID
    created_at: new Date().toISOString()
  });
} 