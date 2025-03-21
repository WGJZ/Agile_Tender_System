// API endpoint for handling authentication requests
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method is supported' });
  }

  try {
    // In a real application, this would validate user credentials and generate JWT token
    // Here we use mock data for quick demonstration
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

    // Get request body
    const { username, password } = req.body || {};

    // Simple validation
    const user = mockUsers.find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Success response, return mock token
    return res.status(200).json({
      token: 'mock_jwt_token_' + user.role.toLowerCase() + '_' + Date.now(),
      user: {
        id: user.user_id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 