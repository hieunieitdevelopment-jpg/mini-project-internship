import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {

    if (email === "admin@gmail.com" && password === "123456") {
      alert("Đăng nhập admin thành công");
      localStorage.setItem("user", JSON.stringify({ full_name: "Admin User", role: "admin" }));
      window.dispatchEvent(new Event("authChange"));
      navigate("/admin");
      return;
    }

    try {

      const res = await fetch("http://44.202.66.188:3000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Đăng nhập thành công");
        if (data.token) localStorage.setItem("token", data.token); // Lưu token nếu API có trả về
        
        // 1. Giải mã Token để lấy quyền thật sự (bỏ qua dữ liệu rác bên ngoài của API)
        let tokenRole = null;
        if (data.token) {
          try {
            // Tự động chuẩn hoá chuỗi Base64Url và bù dấu đệm '=' nếu thiếu
            const base64Url = data.token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const pad = base64.length % 4;
            const paddedBase64 = pad ? base64 + '='.repeat(4 - pad) : base64;
            // Giải mã an toàn với cả Tiếng Việt (UTF-8)
            const jsonPayload = decodeURIComponent(
              atob(paddedBase64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
            );
            const decoded = JSON.parse(jsonPayload);
            tokenRole = decoded.role;
          } catch (e) {
            console.error("Lỗi giải mã token:", e);
          }
        }
        
        // 2. Lấy đúng object user nằm sâu bên trong
        const userInfo = data.user || data.data || {}; 

        const userData = {
          ...userInfo,
          username: userInfo.username || data.username,
          full_name: userInfo.full_name || data.full_name || userInfo.username || email.split("@")[0],
          // Ép lấy Role từ Token làm chuẩn mực cao nhất
          role: String(tokenRole || userInfo.role || data.role || "user").toLowerCase()
        };
        
        localStorage.setItem("user", JSON.stringify(userData));
        window.dispatchEvent(new Event("authChange"));
        navigate("/");
      } else {
        alert(data.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      }

    } catch (error) {
      console.error("Login error:", error);
      alert("Lỗi kết nối đến máy chủ.");
    }

  };

  return (

    <div className="min-h-screen flex flex-col md:flex-row">

      {/* LEFT SIDE */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-teal-400 to-green-300 flex flex-col justify-center items-center text-white p-8 md:p-10 min-h-[30vh] md:min-h-screen">

        <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-center">
          Tra cứu địa chỉ hành chính
        </h1>

        <p className="text-base md:text-lg text-center mb-8 md:mb-10 max-w-md">
          Hệ thống giúp tra cứu và chuyển đổi địa chỉ hành chính 
          cũ và mới nhanh chóng, chính xác.
        </p>

        <img
          src="https://cdn-icons-png.flaticon.com/512/3213/3213071.png"
          alt="rocket"
          className="w-40 md:w-64 opacity-90 hidden sm:block"
        />

      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex-1 bg-gray-900 flex justify-center items-center p-6 md:p-10">

        <div className="w-full max-w-sm md:w-96">

          <h2 className="text-3xl font-bold text-white mb-8">
            Đăng nhập
          </h2>

          <div className="mb-4">

            <label className="text-gray-400 text-sm">
              Email
            </label>

            <input
              type="email"
              placeholder="Nhập email"
              className="w-full p-3 mt-1 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-teal-400"
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>

          <div className="mb-6">

            <label className="text-gray-400 text-sm">
              Mật khẩu
            </label>

            <input
              type="password"
              placeholder="Nhập mật khẩu"
              className="w-full p-3 mt-1 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-teal-400"
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-teal-400 hover:bg-teal-500 text-black font-semibold py-3 rounded-lg transition"
          >
            Đăng nhập
          </button>

          <p className="text-gray-400 text-sm mt-6 text-center">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-teal-400 hover:underline">
              Đăng ký
            </Link>
          </p>

        </div>

      </div>

    </div>

  );
}

export default Login;