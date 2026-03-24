import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Tự động ẩn thông báo lỗi sau 3 giây
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const handleRegister = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMsg("Hãy điền đầy đủ thông tin.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Mật khẩu nhập lại không khớp.");
      return;
    }

    const cleanEmail = email.trim();

    // Kiểm tra định dạng Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMsg("Email không đúng định dạng (VD: ten@gmail.com).");
      return;
    }

    setIsLoading(true);

    try {

      const res = await fetch("http://44.202.66.188/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: cleanEmail, 
          password 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg("Đăng ký thành công!");
        
        // Tìm token linh hoạt
        const actualToken = data.token || data.access_token || data.data?.token || data.data?.access_token;
        
        // Kiểm tra xem API đăng ký có trả về token luôn không (Tính năng Auto-login)
        if (actualToken) {
          localStorage.setItem("token", actualToken);
          
          let tokenRole = null;
          try {
            const base64Url = actualToken.split('.')[1];
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
          setTimeout(() => {
            navigate("/"); // Đăng nhập luôn và về trang chủ
          }, 1500);
        } else {
          setTimeout(() => {
            navigate("/login"); // Nếu không có token, chuyển sang trang Login
          }, 1500);
        }
      } else {
        setErrorMsg(data.message || "Đăng ký thất bại. Vui lòng thử lại.");
        setIsLoading(false);
      }
      
    } catch (error) {
      console.error("Register error:", error);
      setErrorMsg("Lỗi kết nối đến máy chủ.");
      setIsLoading(false);
    }

  };

  return (

    <div className="min-h-screen flex flex-col md:flex-row">

      {/* Định nghĩa CSS Animation cho hiệu ứng trượt từ phải sang */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .toast-slide-in {
          animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Toast Notification hiển thị nổi (Fixed) ở góc trên bên phải */}
      {errorMsg && (
        <div className="fixed top-20 right-4 md:right-8 z-[9999] bg-white border-l-4 border-red-500 p-4 rounded-lg shadow-2xl min-w-[280px] max-w-sm toast-slide-in flex items-start justify-between gap-4">
          <div>
            <p className="font-bold text-red-600 text-base mb-1">Lưu ý</p>
            <p className="text-gray-600 text-sm font-medium">{errorMsg}</p>
          </div>
          <button onClick={() => setErrorMsg("")} className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none">
            &times;
          </button>
        </div>
      )}

      {/* Toast Notification hiển thị nổi (Fixed) cho trường hợp Thành công */}
      {successMsg && (
        <div className="fixed top-20 right-4 md:right-8 z-[9999] bg-white border-l-4 border-green-500 p-4 rounded-lg shadow-2xl min-w-[280px] max-w-sm toast-slide-in flex items-start justify-between gap-4">
          <div>
            <p className="font-bold text-green-600 text-base mb-1">Thành công</p>
            <p className="text-gray-600 text-sm font-medium">{successMsg}</p>
          </div>
          <button onClick={() => setSuccessMsg("")} className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none">
            &times;
          </button>
        </div>
      )}

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
              Email
            </label>

            <input
              type="email"
              value={email}
              disabled={isLoading}
              placeholder="Nhập email"
              className={`w-full p-3 mt-1 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-teal-400 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>

          <div className="mb-4">

            <label className="text-gray-400 text-sm">
              Mật khẩu
            </label>

            <input
              type="password"
              value={password}
              disabled={isLoading}
              placeholder="Nhập mật khẩu"
              className={`w-full p-3 mt-1 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-teal-400 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>

          <div className="mb-6">

            <label className="text-gray-400 text-sm">
              Nhập lại mật khẩu
            </label>

            <input
              type="password"
              value={confirmPassword}
              disabled={isLoading}
              placeholder="Nhập lại mật khẩu"
              className={`w-full p-3 mt-1 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-teal-400 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

          </div>

          <button
            onClick={handleRegister}
            disabled={isLoading}
            className={`w-full bg-teal-400 hover:bg-teal-500 text-black font-semibold py-3 rounded-lg transition flex items-center justify-center ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </>
            ) : (
              "Đăng ký"
            )}
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