// 公开tender的API端点
export default async function handler(req, res) {
  // CORS头
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  // 公开的tenders数据
  const publicTenders = [
    {
      id: 1,
      title: "城市公园改造项目",
      description: "对市中心公园进行现代化改造，增加休闲设施和绿化区域",
      budget: 500000,
      category: "ENVIRONMENT",
      status: "OPEN",
      notice_date: "2023-04-01T10:00:00Z",
      submission_deadline: "2023-05-01T18:00:00Z",
    },
    {
      id: 2,
      title: "智慧交通系统建设",
      description: "为城市主要道路安装智能交通信号系统，优化交通流量",
      budget: 1200000,
      category: "TECHNOLOGY",
      status: "OPEN",
      notice_date: "2023-03-15T08:00:00Z",
      submission_deadline: "2023-04-20T17:00:00Z",
    },
    {
      id: 3,
      title: "社区医疗中心扩建工程",
      description: "对现有社区医疗中心进行扩建，增加专科诊室和医疗设备",
      budget: 800000,
      category: "HEALTHCARE",
      status: "CLOSED",
      notice_date: "2023-02-10T09:00:00Z",
      submission_deadline: "2023-03-10T16:00:00Z",
    }
  ];

  return res.status(200).json({ results: publicTenders });
} 