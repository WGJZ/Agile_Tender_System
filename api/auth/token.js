// JWT认证API端点
import jwt from 'jsonwebtoken';

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
  
  // 简单的用户验证 - 在生产中应使用真实的认证系统
  const { username, password } = req.body;
  
  // 测试凭据
  if (username === 'admin' && password === 'password') {
    return res.status(200).json({
      access: 'mock-jwt-token-for-testing-purposes',
      refresh: 'mock-refresh-token',
      user: {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin'
      }
    });
  } else if (username === 'user' && password === 'password') {
    return res.status(200).json({
      access: 'mock-jwt-token-for-testing-purposes',
      refresh: 'mock-refresh-token',
      user: {
        id: 2,
        username: 'user',
        email: 'user@example.com',
        role: 'user'
      }
    });
  }
  
  // 认证失败
  return res.status(401).json({
    error: 'Invalid credentials'
  });
} 