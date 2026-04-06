import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginRequest, googleAuth } from "../services/authService";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const googleBtnRef = useRef(null);
  const navigate = useNavigate();

  // Tự động ẩn thông báo lỗi sau 3 giây
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const handleGoogleCredential = async (credentialResponse) => {
    try {
      if (!credentialResponse?.credential) {
        setErrorMsg("Không lấy được Google token.");
        return;
      }

      setErrorMsg("");
      setSuccessMsg("");
      setIsGoogleLoading(true);

      const res = await googleAuth(credentialResponse.credential);
      const data = res.data || {};

      const actualToken =
        data.token ||
        data.access_token ||
        data.data?.token ||
        data.data?.access_token;

      const userInfo = data.user || data.data?.user || data.data || {};

      if (actualToken) localStorage.setItem("token", actualToken);
      localStorage.setItem("user", JSON.stringify(userInfo));

      window.dispatchEvent(new Event("authChange"));
      setSuccessMsg("Đăng nhập Google thành công!");

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (error) {
      console.error("Google login error:", error);
      setErrorMsg(error?.response?.data?.message || "Đăng nhập Google thất bại.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const renderGoogleButton = () => {
      if (!window.google?.accounts?.id || !googleBtnRef.current) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
      });

      googleBtnRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
        width: 320,
      });
    };

    if (window.google?.accounts?.id) {
      renderGoogleButton();
      return;
    }

    const existingScript = document.getElementById("google-identity-script");
    if (existingScript) {
      existingScript.addEventListener("load", renderGoogleButton);
      return () => existingScript.removeEventListener("load", renderGoogleButton);
    }

    const script = document.createElement("script");
    script.id = "google-identity-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, []);

  const handleLogin = async () => {
    setErrorMsg(""); // Reset lỗi mỗi lần bấm đăng nhập
    setSuccessMsg(""); // Reset cả thông báo thành công

    // Kiểm tra không được để trống email hoặc mật khẩu
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Hãy điền đầy đủ thông tin.");
      return; // Dừng hàm lại, không gọi API nữa
    }

    const cleanEmail = email.trim(); // Bỏ đi các dấu cách thừa ở đầu và cuối

    // Kiểm tra định dạng Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMsg("Email không đúng định dạng (VD: ten@gmail.com).");
      return;
    }

    setIsLoading(true);

    try {

      const res = await loginRequest({ email: cleanEmail, password });
      const data = res.data || {};

      if (res.status >= 200 && res.status < 300) {
        setSuccessMsg("Đăng nhập thành công!");
        
        // Tìm token linh hoạt theo nhiều cấu trúc API thường gặp
        const actualToken = data.token || data.access_token || data.data?.token || data.data?.access_token;
        if (actualToken) localStorage.setItem("token", actualToken);
        
        // 1. Giải mã Token để lấy quyền thật sự (bỏ qua dữ liệu rác bên ngoài của API)
        let tokenRole = null;
        if (actualToken) {
          try {
            // Tự động chuẩn hoá chuỗi Base64Url và bù dấu đệm '=' nếu thiếu
            const base64Url = actualToken.split('.')[1];
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
        setTimeout(() => {
          navigate("/");
        }, 1500); // Đợi 1.5 giây để hiện thông báo trước khi chuyển trang
      }

    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg(error?.response?.data?.message || "Lỗi kết nối đến máy chủ.");
      setIsLoading(false);
    }

  };

  return (

    <div className="min-h-screen flex flex-row bg-gray-950">

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

      {/* LEFT SIDE - Hidden on small screens */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-teal-400 via-teal-500 to-green-400 flex-col justify-center items-center text-white px-12 py-16">

        <h1 className="text-5xl font-bold mb-6 text-center">
          Tra cứu địa chỉ hành chính
        </h1>

        <p className="text-xl text-center mb-12 max-w-md leading-relaxed">
          Hệ thống giúp tra cứu và chuyển đổi địa chỉ hành chính 
          cũ và mới nhanh chóng, chính xác.
        </p>

        <img
          src="https://cdn-icons-png.flaticon.com/512/3213/3213071.png"
          alt="rocket"
          className="w-72 opacity-95 drop-shadow-lg"
        />

      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-4 sm:p-8 bg-gray-900">

        <div className="w-full max-w-md">

          <h2 className="text-3xl font-bold text-white mb-2">Đăng nhập</h2>
          <p className="text-gray-400 text-sm mb-8">Nhập thông tin tài khoản của bạn</p>

          <div className="mb-5">
            <label className="text-gray-300 text-sm font-medium block mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              placeholder="Nhập email"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 hover:border-gray-600 focus:border-teal-400 focus:ring-2 focus:ring-teal-400 focus:ring-opacity-20 outline-none transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-300 text-sm font-medium block mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              placeholder="Nhập mật khẩu"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 hover:border-gray-600 focus:border-teal-400 focus:ring-2 focus:ring-teal-400 focus:ring-opacity-20 outline-none transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="mt-3 text-right">
              <Link to="/forgot-password" className="text-sm text-teal-400 hover:text-teal-300 transition-colors">
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          <button
            onClick={handleLogin}
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
              "Đăng nhập"
            )}
          </button>

          <div className="my-4 text-center text-gray-500 text-sm">hoặc</div>

          {GOOGLE_CLIENT_ID ? (
            <div className="flex justify-center min-h-[44px]">
              {isGoogleLoading ? (
                <p className="text-sm text-gray-400">Đang xử lý Google...</p>
              ) : (
                <div ref={googleBtnRef} />
              )}
            </div>
          ) : (
            <p className="text-xs text-red-400 text-center mb-2">
              Thiếu cấu hình VITE_GOOGLE_CLIENT_ID
            </p>
          )}

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