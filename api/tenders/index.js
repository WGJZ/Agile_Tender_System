// 获取所有投标API
export default function handler(req, res) {
  // 允许跨域请求
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 返回模拟数据
  res.status(200).json({
    tenders: [
      {
        id: 1,
        title: "城市公园绿化项目",
        description: "为城市中心公园提供绿化和景观设计服务",
        budget: 150000,
        deadline: "2024-12-31",
        status: "open",
        is_public: true,
        category: "landscaping",
        location: "北京市",
        created_at: "2024-10-01"
      },
      {
        id: 2,
        title: "智慧交通系统升级",
        description: "对城市交通灯系统进行智能化升级，包括安装传感器和控制系统",
        budget: 500000,
        deadline: "2024-11-30",
        status: "open",
        is_public: true,
        category: "technology",
        location: "上海市",
        created_at: "2024-10-05"
      },
      {
        id: 3,
        title: "公共图书馆翻新工程",
        description: "对市中心公共图书馆进行内部装修和设施更新",
        budget: 300000,
        deadline: "2025-01-15",
        status: "open",
        is_public: true,
        category: "construction",
        location: "广州市",
        created_at: "2024-10-10"
      },
      {
        id: 4,
        title: "市政垃圾处理厂建设",
        description: "建设一座现代化垃圾处理厂，包括分类、回收和无害化处理设施",
        budget: 1200000,
        deadline: "2025-03-20",
        status: "open",
        is_public: false,
        category: "environment",
        location: "深圳市",
        created_at: "2024-10-15"
      }
    ]
  });
} 