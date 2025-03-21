// Serverless function for handling public tenders API
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET method is supported' });
  }

  // Return mock data
  res.status(200).json({
    tenders: [
      {
        id: 1,
        title: "City Park Green Project",
        description: "Providing landscaping and design services for the city center park",
        budget: 150000,
        deadline: "2024-12-31",
        status: "open",
        is_public: true,
        category: "landscaping",
        location: "Beijing",
        created_at: "2024-10-01"
      },
      {
        id: 2,
        title: "Smart Traffic System Upgrade",
        description: "Upgrading city traffic light systems with intelligent technology, including sensors and control systems",
        budget: 500000,
        deadline: "2024-11-30",
        status: "open",
        is_public: true,
        category: "technology",
        location: "Shanghai",
        created_at: "2024-10-05"
      },
      {
        id: 3,
        title: "Public Library Renovation",
        description: "Interior renovation and facility updates for the downtown public library",
        budget: 300000,
        deadline: "2025-01-15",
        status: "open",
        is_public: true,
        category: "construction",
        location: "Guangzhou",
        created_at: "2024-10-10"
      }
    ]
  });
} 