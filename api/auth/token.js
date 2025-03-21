// JWT认证API端点
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // CORS头
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  // 简单的认证逻辑
  try {
    const { username, password } = req.body;
    
    // 这里只是演示用，实际项目应该检查数据库中的凭证
    if (username === 'admin' && password === 'password') {
      // 创建JWT token
      const token = jwt.sign(
        { 
          user_id: 1,
          username: username,
          user_type: 'CITY'
        },
        process.env.DJANGO_SECRET_KEY || 'your-secret-key',
        { expiresIn: '1d' }
      );
      
      return res.status(200).json({
        access: token,
        refresh: jwt.sign(
          { user_id: 1 },
          process.env.DJANGO_SECRET_KEY || 'your-secret-key',
          { expiresIn: '7d' }
        ),
        user: {
          id: 1,
          username: username,
          user_type: 'CITY',
          organization_name: 'Demo City'
        }
      });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ error: "Authentication failed" });
  }
} 