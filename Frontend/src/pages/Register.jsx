import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {

    try {

      const res = await fetch("http://44.202.66.188:3000/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, full_name: fullName, email, password, phone }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Đăng ký thành công");
        
        // Kiểm tra xem API đăng ký có trả về token luôn không (Tính năng Auto-login)
        if (data.token) {
          localStorage.setItem("token", data.token);
          
          let tokenRole = null;
          try {
            const base64Url = data.token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const pad = base64.length % 4;
            const paddedBase64 = pad ? base64 + '='.repeat(4 - pad) : base64;
            const jsonPayload = decodeURIComponent(
              atob(paddedBase64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
            );
            const decoded = JSON.parse(jsonPayload);
            tokenRole = decoded.role;
          } catch (e) {
            console.error("Lỗi giải mã token:", e);
          }

          const userInfo = data.user || data.data || {};
          const userData = {
            ...userInfo,
            username: userInfo.username || data.username,
            full_name: userInfo.full_name || data.full_name || userInfo.username || email.split("@")[0],
            role: String(tokenRole || userInfo.role || data.role || "user").toLowerCase()
          };
          
          localStorage.setItem("user", JSON.stringify(userData));
          window.dispatchEvent(new Event("authChange"));
          navigate("/"); // Đăng nhập luôn và về trang chủ
        } else {
          navigate("/login"); // Nếu không có token, chuyển sang trang Login
        }
      } else {
        alert(data.message || "Đăng ký thất bại. Vui lòng thử lại.");
      }
      
    } catch (error) {
      console.error("Register error:", error);
      alert("Lỗi kết nối đến máy chủ.");
    }

  };

  return (

    <div className="min-h-screen flex flex-col md:flex-row">

      {/* LEFT SIDE */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-teal-400 to-green-300 flex flex-col justify-center items-center text-white p-8 md:p-10 min-h-[30vh] md:min-h-screen">

        <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-center">
          Tạo tài khoản mới
        </h1>

        <p className="text-base md:text-lg text-center mb-8 md:mb-10 max-w-md">
          Đăng ký để sử dụng hệ thống tra cứu địa chỉ hành chính 
          và chuyển đổi địa chỉ cũ sang mới một cách nhanh chóng.
        </p>

        <img
          src="https://cdn-icons-png.flaticon.com/512/942/942748.png"
          alt="register"
          className="w-40 md:w-64 opacity-90 hidden sm:block"
        />

      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex-1 bg-gray-900 flex justify-center items-center p-6 md:p-10">

        <div className="w-full max-w-sm md:w-96">

          <h2 className="text-3xl font-bold text-white mb-8">
            Đăng ký
          </h2>

          <div className="mb-4">

            <label className="text-gray-400 text-sm">
              Username
            </label>

            <input
              type="text"
              placeholder="Nhập username (chỉ chữ và số)"
              className="w-full p-3 mt-1 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-teal-400"
              onChange={(e) => setUsername(e.target.value)}
            />

          </div>

          <div className="mb-4">

            <label className="text-gray-400 text-sm">
              Số điện thoại
            </label>

            <input
              type="tel"
              placeholder="Nhập số điện thoại"
              className="w-full p-3 mt-1 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-teal-400"
              onChange={(e) => setPhone(e.target.value)}
            />

          </div>

          <div className="mb-4">

            <label className="text-gray-400 text-sm">
              Tên đầy đủ
            </label>

            <input
              type="text"
              placeholder="Nhập tên đầy đủ"
              className="w-full p-3 mt-1 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-teal-400"
              onChange={(e) => setFullName(e.target.value)}
            />

          </div>

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
            onClick={handleRegister}
            className="w-full bg-teal-400 hover:bg-teal-500 text-black font-semibold py-3 rounded-lg transition"
          >
            Đăng ký
          </button>

          <p className="text-gray-400 text-sm mt-6 text-center">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-teal-400 hover:underline">
              Đăng nhập
            </Link>
          </p>

        </div>

      </div>

    </div>

  );
}

export default Register;