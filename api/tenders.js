// 简单的无服务器函数用于处理tender请求
export default async function handler(req, res) {
  // CORS头
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // 为了快速部署，我们直接返回预设的tenders数据
  // 在真实实现中，这里会连接到Supabase数据库
  const tenders = [
    {
      id: 1,
      title: "城市公园改造项目",
      description: "对市中心公园进行现代化改造，增加休闲设施和绿化区域",
      budget: 500000,
      category: "ENVIRONMENT",
      requirements: "需要有景观设计经验，能够在保护现有生态的同时进行创新设计",
      status: "OPEN",
      notice_date: "2023-04-01T10:00:00Z",
      submission_deadline: "2023-05-01T18:00:00Z",
      created_at: "2023-03-25T09:30:00Z"
    },
    {
      id: 2,
      title: "智慧交通系统建设",
      description: "为城市主要道路安装智能交通信号系统，优化交通流量",
      budget: 1200000,
      category: "TECHNOLOGY",
      requirements: "需要有智能交通系统集成经验，能够与现有城市管理系统对接",
      status: "OPEN",
      notice_date: "2023-03-15T08:00:00Z",
      submission_deadline: "2023-04-20T17:00:00Z",
      created_at: "2023-03-10T14:00:00Z"
    },
    {
      id: 3,
      title: "社区医疗中心扩建工程",
      description: "对现有社区医疗中心进行扩建，增加专科诊室和医疗设备",
      budget: 800000,
      category: "HEALTHCARE",
      requirements: "需要有医疗建筑设计和施工经验，符合最新医疗建筑标准",
      status: "CLOSED",
      notice_date: "2023-02-10T09:00:00Z",
      submission_deadline: "2023-03-10T16:00:00Z",
      created_at: "2023-02-05T11:30:00Z"
    }
  ];

  return res.status(200).json({ results: tenders });
} 