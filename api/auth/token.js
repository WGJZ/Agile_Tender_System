// 处理认证请求的API端点
export default function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 仅允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持POST方法' });
  }

  try {
    // 在实际应用中，这里应该验证用户凭据并生成JWT令牌
    // 这里使用模拟数据进行快速演示
    const mockUsers = [
      { 
        username: 'city_admin', 
        password: 'password123',
        role: 'CITY_ADMIN',
        user_id: 1
      },
      { 
        username: 'company_user', 
        password: 'password123',
        role: 'COMPANY',
        user_id: 2
      }
    ];

    // 获取请求体
    const { username, password } = req.body || {};

    // 简单验证
    const user = mockUsers.find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      return res.status(401).json({
        error: '无效的凭据'
      });
    }

    // 成功响应，返回模拟令牌
    return res.status(200).json({
      token: 'mock_jwt_token_' + user.role.toLowerCase() + '_' + Date.now(),
      user: {
        id: user.user_id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('认证错误:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
} 