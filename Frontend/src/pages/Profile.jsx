import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  // Kiểm tra đăng nhập và lấy thông tin User
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!storedUser || !token) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  // Tự động ẩn thông báo sau 3 giây
  useEffect(() => {
    if (msg.text) {
      const timer = setTimeout(() => setMsg({ type: "", text: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!oldPassword || !newPassword || !confirmPassword) {
      setMsg({ type: "error", text: "Vui lòng điền đầy đủ thông tin." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMsg({ type: "error", text: "Mật khẩu xác nhận không khớp." });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/v1/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          old_password: oldPassword, // Format chung snake_case cho database
          new_password: newPassword,
          oldPassword: oldPassword,  // Format dự phòng camelCase
          newPassword: newPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMsg({ type: "success", text: "Đổi mật khẩu thành công!" });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMsg({ type: "error", text: data.message || "Đổi mật khẩu thất bại. Kiểm tra lại mật khẩu cũ." });
        if (res.status === 401) {
           localStorage.removeItem("token");
           localStorage.removeItem("user");
           window.dispatchEvent(new Event("authChange"));
           navigate("/login");
        }
      }
    } catch (error) {
      setMsg({ type: "error", text: "Lỗi kết nối đến máy chủ." });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      {/* Animations và CSS nội tuyến */}
      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .toast-slide-in { animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* Khối Thông báo Nổi (Toast) */}
      {msg.text && (
        <div className={`fixed top-20 right-4 md:right-8 z-[9999] bg-white border-l-4 p-4 rounded-lg shadow-2xl min-w-[280px] max-w-sm toast-slide-in flex items-start justify-between gap-4 ${msg.type === 'error' ? 'border-red-500' : 'border-green-500'}`}>
          <div>
            <p className={`font-bold text-base mb-1 ${msg.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
              {msg.type === 'error' ? 'Lưu ý' : 'Thành công'}
            </p>
            <p className="text-gray-600 text-sm font-medium">{msg.text}</p>
          </div>
          <button onClick={() => setMsg({ type: "", text: "" })} className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none">&times;</button>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Hồ sơ cá nhân</h1>
        <p className="text-base md:text-lg text-gray-600">Quản lý thông tin tài khoản và bảo mật</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cột trái: Hiển thị thông tin cơ bản */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center border-t-4 border-blue-500">
            <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4 shadow-inner">
              {(user.full_name || user.username || "U")[0].toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">{user.full_name || user.username || "Chưa có tên"}</h2>
            <p className="text-gray-500 text-sm mb-4">{user.email}</p>
            <span className={`inline-block px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${String(user.role).toLowerCase() === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
              {user.role || 'User'}
            </span>
          </div>
        </div>

        {/* Cột phải: Form đổi mật khẩu */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span>🔒</span> Đổi mật khẩu
            </h3>
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu hiện tại</label>
                <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} disabled={isLoading} placeholder="Nhập mật khẩu hiện tại" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={isLoading} placeholder="Nhập mật khẩu mới" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} placeholder="Nhập lại mật khẩu mới" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors" />
              </div>
              <div className="pt-2">
                <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg w-full sm:w-auto">
                  {isLoading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;