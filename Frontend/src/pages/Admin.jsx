import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats, getAllUsers, toggleUserStatus, getAllApiKeys, revokeKeyGlobal, deleteUser } from "../services/adminService";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from "recharts";

function Admin() {
    const navigate = useNavigate();
    
    // States
    const [activeTab, setActiveTab] = useState("overview");
    const [isLoading, setIsLoading] = useState(true);
    const [msg, setMsg] = useState({ type: "", text: "" });

    // Data states
    const [stats, setStats] = useState({ totalUsers: 0, activeApiKeys: 0, requests24h: 0, requests7d: 0 });
    const [traffic, setTraffic] = useState([]);
    const [topConsumers, setTopConsumers] = useState([]);
    const [users, setUsers] = useState([]);
    const [apiKeys, setApiKeys] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const role = String(user.role || user.user?.role || user.data?.role || '').toLowerCase();
        if (!user.email || role !== "admin") {
            navigate("/");
            return;
        }
        
        loadData();
    }, [navigate, activeTab]);

    const loadData = async () => {
        setIsLoading(true);
        setMsg({ type: "", text: "" });
        try {
            if (activeTab === "overview") {
                const res = await getDashboardStats();
                if (res.success) {
                    setStats(res.data.stats);
                    const sortedTraffic = res.data.traffic.reverse().map(d => ({
                        date: new Date(d.date).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit' }),
                        requests: parseInt(d.total_requests)
                    }));
                    setTraffic(sortedTraffic);
                    setTopConsumers(res.data.topConsumers);
                }
            } else if (activeTab === "users") {
                const res = await getAllUsers();
                if (res.success) setUsers(res.data);
            } else if (activeTab === "apikeys") {
                const res = await getAllApiKeys();
                if (res.success) setApiKeys(res.data);
            }
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                navigate("/");
            } else {
                setMsg({ type: "error", text: "Lỗi kết nối tới máy chủ" });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleBan = async (userId, currentStatus) => {
        if (!window.confirm(`Bạn có chắc chắn muốn ${currentStatus ? 'KHOÁ' : 'MỞ KHÓA'} người dùng này không?`)) return;
        try {
            const res = await toggleUserStatus(userId, !currentStatus);
            if (res.success) {
                setMsg({ type: "success", text: res.message });
                loadData();
            }
        } catch (err) {
            setMsg({ type: "error", text: err.response?.data?.message || "Lỗi thao tác" });
        }
    };

    const handleRevokeKey = async (keyId) => {
        if (!window.confirm("CẢNH BÁO: Thao tác này sẽ VĨNH VIỄN làm hỏng kết nối của người dùng. Bạn chắc chứ?")) return;
        try {
            const res = await revokeKeyGlobal(keyId);
            if (res.success) {
                setMsg({ type: "success", text: res.message });
                loadData();
            }
        } catch (err) {
            setMsg({ type: "error", text: err.response?.data?.message || "Lỗi thao tác" });
        }
    };

    const handleDeleteUser = async (userId, email) => {
        if (!window.confirm(`⚠️ CẢNH BÁO: Bạn sắp XÓA VĨNH VIỄN tài khoản "${email}"!\nMọi API Keys và dữ liệu liên quan sẽ bị mất.\n\nBạn chắc chắn chứ?`)) return;
        try {
            const res = await deleteUser(userId);
            if (res.success) {
                setMsg({ type: "success", text: res.message });
                loadData();
            }
        } catch (err) {
            setMsg({ type: "error", text: err.response?.data?.message || "Lỗi xóa tài khoản" });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-slate-900 text-white min-h-screen flex-shrink-0">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                        Admin SaaS
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Control Panel</p>
                </div>
                <nav className="p-4 flex flex-col gap-2">
                    <button 
                        onClick={() => setActiveTab("overview")}
                        className={`text-left px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                    >
                        📊 Tổng Quan
                    </button>
                    <button 
                        onClick={() => setActiveTab("users")}
                        className={`text-left px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                    >
                        👥 Người Dùng
                    </button>
                    <button 
                        onClick={() => setActiveTab("apikeys")}
                        className={`text-left px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'apikeys' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                    >
                        🔑 API Keys Global
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto w-full">
                {msg.text && (
                    <div className={`mb-6 p-4 rounded-xl ${msg.type === "success" ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"}`}>
                        {msg.text}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <>
                        {/* TAB: OVERVIEW */}
                        {activeTab === "overview" && (
                            <div className="space-y-8 animate-fade-in">
                                <h1 className="text-3xl font-bold text-gray-800 mb-6">Tổng Quan Hệ Thống</h1>
                                
                                {/* 3 Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                                        <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Tổng User</span>
                                        <span className="text-4xl font-black text-indigo-600 mt-2">{stats.totalUsers}</span>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                                        <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">API Keys Hoạt Động</span>
                                        <span className="text-4xl font-black text-blue-600 mt-2">{stats.activeApiKeys}</span>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                                        <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Traffic (24h Qua)</span>
                                        <span className="text-4xl font-black text-emerald-600 mt-2">{stats.requests24h.toLocaleString()} <span className="text-lg text-gray-400 font-medium">reqs</span></span>
                                    </div>
                                </div>

                                {/* Chart & Top Consumers */}
                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                    {/* Chart */}
                                    <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-800 mb-6">Lưu Lượng API (30 Ngày)</h3>
                                        <div className="h-80">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={traffic}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                    <XAxis dataKey="date" />
                                                    <YAxis />
                                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                    <Line type="monotone" dataKey="requests" name="Hits" stroke="#4f46e5" strokeWidth={3} activeDot={{ r: 6 }} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Top Consumers */}
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-800 mb-6">🏆 Top Consumers</h3>
                                        <div className="space-y-4">
                                            {topConsumers.map((c, idx) => (
                                                <div key={idx} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors">
                                                    <div>
                                                        <div className="font-bold text-gray-800 truncate w-40">{c.key_name}</div>
                                                        <div className="text-xs text-gray-500 truncate w-40">{c.email}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-black text-indigo-600">{parseInt(c.total_requests).toLocaleString()}</div>
                                                        <div className="text-[10px] text-gray-400">reqs</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: USERS */}
                        {activeTab === "users" && (
                            <div className="animate-fade-in">
                                <h1 className="text-3xl font-bold text-gray-800 mb-6">Danh Sách Người Dùng</h1>
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50 border-b border-gray-100">
                                                <tr className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                                    <th className="p-4">Email</th>
                                                    <th className="p-4">Tham gia</th>
                                                    <th className="p-4 text-center">Số Keys</th>
                                                    <th className="p-4 text-center">Tổng API Hits</th>
                                                    <th className="p-4 text-center">Trạng Thái</th>
                                                    <th className="p-4 text-center">Hành Động</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {users.map(u => (
                                                    <tr key={u.id} className="hover:bg-slate-50">
                                                        <td className="p-4">
                                                            <div className="font-bold text-gray-800">{u.username || 'N/A'}</div>
                                                            <div className="text-gray-500 text-sm">{u.email} {u.role === 'admin' && <span className="ml-2 bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded">Admin</span>}</div>
                                                        </td>
                                                        <td className="p-4 text-sm text-gray-600">{new Date(u.created_at).toLocaleDateString('vi-VN')}</td>
                                                        <td className="p-4 text-center font-bold">{u.total_api_keys}</td>
                                                        <td className="p-4 text-center font-bold text-blue-600">{parseInt(u.total_requests).toLocaleString()}</td>
                                                        <td className="p-4 text-center">
                                                            <span className={`px-3 py-1 rounded text-xs font-bold ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                {u.is_active ? 'Bình thường' : 'Bị Khóa'}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            {u.role !== 'admin' && (
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <button 
                                                                        onClick={() => handleToggleBan(u.id, u.is_active)}
                                                                        className={`px-3 py-1.5 rounded font-bold text-sm transition-colors ${u.is_active ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                                                                    >
                                                                        {u.is_active ? 'Ban' : 'Unban'}
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleDeleteUser(u.id, u.email)}
                                                                        className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded font-bold text-sm transition-colors"
                                                                    >
                                                                        Xóa
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: API KEYS */}
                        {activeTab === "apikeys" && (
                            <div className="animate-fade-in">
                                <h1 className="text-3xl font-bold text-gray-800 mb-6">Kiểm Soát API Keys Toàn Cầu</h1>
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50 border-b border-gray-100">
                                                <tr className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                                    <th className="p-4">Project Name & Key</th>
                                                    <th className="p-4">Sở hữu (Email)</th>
                                                    <th className="p-4 text-center">Total Traffic</th>
                                                    <th className="p-4 text-center">Trạng Thái</th>
                                                    <th className="p-4 text-center">Danger Zone</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {apiKeys.map(k => (
                                                    <tr key={k.id} className="hover:bg-slate-50">
                                                        <td className="p-4">
                                                            <div className="font-bold text-gray-800">{k.name}</div>
                                                            <div className="font-mono text-xs text-gray-400 mt-1">{k.masked_key}</div>
                                                        </td>
                                                        <td className="p-4 text-sm text-gray-600">{k.user_email}</td>
                                                        <td className="p-4 text-center font-black text-indigo-600">{parseInt(k.total_requests).toLocaleString()}</td>
                                                        <td className="p-4 text-center">
                                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${k.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                {k.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            {k.status === 'active' && (
                                                                <button 
                                                                    onClick={() => handleRevokeKey(k.id)}
                                                                    className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded font-bold text-sm transition-colors"
                                                                >
                                                                    Revoke Khẩn Cấp
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

export default Admin;