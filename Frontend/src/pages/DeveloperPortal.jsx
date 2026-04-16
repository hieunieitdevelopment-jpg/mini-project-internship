import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listApiKeys, createApiKey, revokeApiKey, getUsageStats, getDailyStats } from "../services/apiKeyService";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

function DeveloperPortal() {
  const [keys, setKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState(null);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [usageStats, setUsageStats] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [chartKeyName, setChartKeyName] = useState("");
  const navigate = useNavigate();

  // Kiểm tra đăng nhập
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      return;
    }
    fetchKeys();
    fetchUsage();
  }, [navigate]);

  const fetchUsage = async () => {
    try {
      const res = await getUsageStats();
      if (res.success) setUsageStats(res.data);
    } catch (e) {
      // Không cần báo lỗi nếu chưa có dữ liệu
    }
  };

  const fetchKeys = async () => {
    try {
      setIsLoading(true);
      const res = await listApiKeys();
      if (res.success) {
        setKeys(res.data);
      }
    } catch (error) {
      setMsg({ type: "error", text: error.response?.data?.message || "Lỗi tải danh sách API Key" });
    } finally {
      setIsLoading(false);
    }
  };

  const currentCount = keys.filter(k => k.status === "active").length;
  const limitCount = 3;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      setMsg({ type: "error", text: "Vui lòng nhập tên ứng dụng" });
      return;
    }
    
    try {
      setIsLoading(true);
      const res = await createApiKey(newKeyName);
      if (res.success) {
        setNewKeyName("");
        // Show newly generated FULL key explicitly for the user to copy
        setGeneratedKey(res.data.api_key); 
        fetchKeys();
      }
    } catch (error) {
       setMsg({ type: "error", text: error.response?.data?.message || "Lỗi khi tạo API Key mới" });
    } finally {
       setIsLoading(false);
    }
  };

  const handleRevoke = async (id) => {
    if (!window.confirm("Thao tác này là vĩnh viễn và không thể khôi phục. Ứng dụng đang dùng API Key này sẽ bị ngắt kết nối. Bạn có chắc chắn muốn Xóa?")) return;
    try {
      const res = await revokeApiKey(id);
      if (res.success) {
        setMsg({ type: "success", text: "Đã thu hồi API Key thành công" });
        fetchKeys();
        fetchUsage();
      }
    } catch (error) {
      setMsg({ type: "error", text: error.response?.data?.message || "Lỗi thu hồi API Key" });
    }
  };

  const handleOpenChart = async (keyId, keyName) => {
    try {
      const res = await getDailyStats(keyId);
      if (res.success) {
        // Đảo ngược dữ liệu để ngày cũ đứng trước (cho biểu đồ)
        const sortedData = res.data.daily.reverse().map(d => ({
          ...d,
          date: new Date(d.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
        }));
        setChartData(sortedData);
        setChartKeyName(keyName);
        setIsChartOpen(true);
      }
    } catch (err) {
      setMsg({ type: "error", text: "Không tải được dữ liệu biểu đồ" });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setMsg({ type: "success", text: "Đã sao chép vào bộ nhớ đệm (Clipboard)" });
  };

  // Tự động ẩn message sau 4s
  useEffect(() => {
    if (msg.text) {
      const timer = setTimeout(() => setMsg({ type: "", text: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      
      {/* Toast Messages */}
      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .toast-slide-in { animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
      
      {msg.text && (
        <div className={`fixed top-24 right-4 md:right-8 z-[9999] bg-white border-l-4 p-4 rounded-lg shadow-2xl min-w-[280px] max-w-sm toast-slide-in flex items-start justify-between gap-4 ${msg.type === 'error' ? 'border-red-500' : 'border-green-500'}`}>
          <div>
            <p className={`font-bold text-base mb-1 ${msg.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
              {msg.type === 'error' ? 'Lưu ý' : '✅ Thành công'}
            </p>
            <p className="text-gray-600 text-sm font-medium">{msg.text}</p>
          </div>
          <button onClick={() => setMsg({ type: "", text: "" })} className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none">&times;</button>
        </div>
      )}

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <span className="text-blue-600">⚙️</span>
          Developer Portal
        </h1>
        <p className="text-base md:text-lg text-gray-600">
          Tạo và quản lý các API Key để tích hợp máy chủ của bạn với hệ thống Tra Cứu Địa Giới.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Khối Tạo mới Key */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-28">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Tạo API Key mới</h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Các khóa truy cập này hoàn toàn bí mật. Đừng chia sẻ cho bất kỳ ai hoặc upload công khai (như Github).
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tên định danh (App Name)</label>
                <input 
                  type="text" 
                  value={newKeyName} 
                  onChange={(e) => setNewKeyName(e.target.value)} 
                  disabled={isLoading || currentCount >= limitCount} 
                  placeholder="Ví dụ: App Giao Hàng X..." 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm" 
                />
              </div>

              {/* Progress bar minh hoạ số lượng */}
              <div className="pt-2">
                 <div className="flex justify-between items-center text-xs text-gray-500 mb-1 font-semibold">
                   <span>Hạn mức:</span>
                   <span className={`${currentCount >= limitCount ? 'text-red-500' : 'text-blue-600'}`}>
                     {currentCount} / {limitCount} Keys
                   </span>
                 </div>
                 <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${currentCount >= limitCount ? 'bg-red-500' : 'bg-blue-600'}`} 
                      style={{ width: `${(currentCount / limitCount) * 100}%` }}
                    ></div>
                 </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isLoading || currentCount >= limitCount || !newKeyName.trim()} 
                  className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-300 text-white px-5 py-3 rounded-[12px] font-semibold transition-all shadow-md transform hover:-translate-y-0.5 flex justify-center items-center gap-2"
                >
                  {isLoading ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  ) : (
                    <><span>🚀</span> Generate Secret Key</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Khối Hiển thị và Cảnh báo */}
        <div className="lg:col-span-2 space-y-8">

          {/* Hộp Thông báo Secret Key vừa tạo mới */}
          {generatedKey && (
            <div className="bg-emerald-50 border-2 border-emerald-500 rounded-[16px] p-6 shadow-xl animate-[pulse_2s_ease-in-out_1]">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🎉</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-emerald-800 mb-2">Thành công! Khóa bí mật đã được sinh ra.</h3>
                  <p className="text-sm text-emerald-700 mb-4 font-semibold p-2 bg-emerald-100 rounded inline-block">
                    Vui lòng Copy và Lưu trữ mã Key này ngay. Nó sẽ không bao giờ được hiển thị đầy đủ lần thứ 2 vì lý do bảo mật hệ thống.
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={generatedKey} 
                      className="flex-1 bg-white border border-emerald-300 text-emerald-900 text-sm md:text-base font-mono font-bold px-4 py-3 rounded-lg outline-none" 
                    />
                    <button 
                      onClick={() => copyToClipboard(generatedKey)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-lg font-bold shadow transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Danh sách Key hiện tại */}
          <div className="bg-white rounded-[16px] shadow-lg border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
               <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                 <span>🔑</span> Quản lý Access Keys
               </h2>
               <span className="text-sm font-semibold bg-gray-200 text-gray-700 px-3 py-1 rounded-full">{keys.length} API Keys total</span>
             </div>

             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-white border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider font-semibold">
                     <th className="p-4 pl-6">Identifier Tên APP</th>
                     <th className="p-4">Secret Key (Mã hoá ẩn)</th>
                     <th className="p-4 text-center">Tình Trạng</th>
                     <th className="p-4 text-center">Tạo Ngày</th>
                     <th className="p-4 pr-6 text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50 text-sm">
                   {keys.length === 0 ? (
                     <tr>
                       <td colSpan="5" className="p-8 text-center text-gray-400 italic">
                         Chưa có API Key nào được tạo. Hãy tạo mới một Key để tích hợp nhé!
                       </td>
                     </tr>
                   ) : (
                     keys.map((key) => (
                       <tr key={key.id} className="hover:bg-blue-50 transition-colors">
                         <td className="p-4 pl-6 font-bold text-gray-800">{key.name}</td>
                         <td className="p-4 font-mono text-gray-600 font-medium">
                           <div className="flex items-center gap-2">
                             <code className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-800 blur-[1px] hover:blur-none transition-all">
                               {key.masked_key || key.api_key}
                             </code>
                           </div>
                         </td>
                         <td className="p-4 text-center">
                           <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                             key.status === "active" ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200 line-through"
                           }`}>
                             {key.status}
                           </span>
                         </td>
                         <td className="p-4 text-center text-gray-500">
                           {new Date(key.created_at).toLocaleDateString('vi-VN')}
                         </td>
                          <td className="p-4 pr-6 text-right flex gap-2 justify-end">
                            <button 
                               onClick={() => handleOpenChart(key.id, key.name)}
                               className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1.5 rounded font-bold transition-all"
                            >
                               Biểu đồ
                            </button>
                            {key.status === "active" ? (
                              <button 
                                onClick={() => handleRevoke(key.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded font-bold transition-all"
                              >
                                Xóa
                              </button>
                            ) : (
                              <span className="text-gray-400 italic font-medium px-3 py-1.5">Vô hiệu</span>
                            )}
                          </td>
                       </tr>
                     ))
                   )}
                 </tbody>
               </table>
             </div>
          </div>
        </div>

      </div>

      {/* Khối Thống kê Usage Analytics */}
      {usageStats.length > 0 && (
        <div className="mt-10 bg-white rounded-[16px] shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span>📊</span> Usage Analytics
            </h2>
            <p className="text-sm text-gray-500 mt-1">Thống kê lượt gọi API theo từng Key</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="p-4 pl-6">API Key</th>
                  <th className="p-4 text-center">Tổng Requests</th>
                  <th className="p-4 text-center">24h qua</th>
                  <th className="p-4 text-center">7 ngày qua</th>
                  <th className="p-4 text-center">Avg Response</th>
                  <th className="p-4 pr-6 text-center">Lần cuối sử dụng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {usageStats.map((stat) => (
                  <tr key={stat.key_id} className="hover:bg-indigo-50 transition-colors">
                    <td className="p-4 pl-6">
                      <span className="font-bold text-gray-800">{stat.key_name}</span>
                      <span className={`ml-2 inline-block px-2 py-0.5 rounded text-xs font-bold ${
                        stat.status === "active" ? "bg-green-100 text-green-700" : "bg-red-50 text-red-600"
                      }`}>{stat.status}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-2xl font-bold text-indigo-600">{stat.total_requests.toLocaleString()}</span>
                    </td>
                    <td className="p-4 text-center font-semibold text-gray-700">{stat.requests_24h.toLocaleString()}</td>
                    <td className="p-4 text-center font-semibold text-gray-700">{stat.requests_7d.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <span className={`font-mono font-bold ${
                        stat.avg_response_ms < 100 ? "text-green-600" : stat.avg_response_ms < 500 ? "text-yellow-600" : "text-red-600"
                      }`}>{stat.avg_response_ms}ms</span>
                    </td>
                    <td className="p-4 pr-6 text-center text-gray-500">
                      {stat.last_used_at ? new Date(stat.last_used_at).toLocaleString('vi-VN') : 'Chưa sử dụng'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Biểu Đồ */}
      {isChartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-4xl p-6 relative">
            <button 
              onClick={() => setIsChartOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              📉 Biểu đồ sử dụng: <span className="text-indigo-600">{chartKeyName}</span>
            </h2>

            {chartData.length > 0 ? (
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="requests" 
                      name="Số lượt Request" 
                      stroke="#4f46e5" 
                      strokeWidth={3} 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="py-20 text-center text-gray-500 bg-gray-50 rounded-xl">
                Chưa có dữ liệu gọi API để vẽ biểu đồ.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DeveloperPortal;
