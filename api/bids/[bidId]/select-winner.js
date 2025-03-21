// 处理选择投标赢家的API
export default function handler(req, res) {
  const { bidId } = req.query;
  
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
  
  // 在实际应用中，这里会更新数据库中的投标状态
  // 现在我们只返回成功响应
  res.status(200).json({
    message: `Bid ${bidId} has been selected as winner`,
    updated_at: new Date().toISOString()
  });
} 