// 模拟我的投标数据
export default function handler(req, res) {
  // 允许跨域请求
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 返回模拟数据
  res.status(200).json([
    {
      id: 1,
      tender_id: 1,
      company: 1,
      bidding_price: "145000",
      status: "pending",
      submission_date: "2024-10-15",
      tender_title: "城市公园绿化项目"
    },
    {
      id: 2,
      tender_id: 3,
      company: 1,
      bidding_price: "290000",
      status: "accepted",
      submission_date: "2024-10-12",
      tender_title: "公共图书馆翻新工程"
    }
  ]);
} 