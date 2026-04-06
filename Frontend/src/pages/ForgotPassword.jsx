import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AUTH_API_BASE_URL =
  import.meta.env.VITE_AUTH_API_BASE_URL || "/api/v1";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const handleSubmit = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg("Hãy nhập email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMsg("Email không đúng định dạng (VD: ten@gmail.com).");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${AUTH_API_BASE_URL}/api/v1/auth/request-password-reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: cleanEmail }),
      });

      let responseData = null;
      try {
        responseData = await res.json();
      } catch {
        responseData = null;
      }

      if (res.ok) {
        setSuccessMsg("Vui lòng kiểm tra email");
      } else {
        const backendMessage = responseData?.message;
        if (res.status === 404) {
          setErrorMsg("Email không tồn tại");
        } else if (res.status >= 500) {
          setErrorMsg("Máy chủ đang bận, vui lòng thử lại sau.");
        } else {
          setErrorMsg(backendMessage || "Không thể gửi link reset. Vui lòng thử lại.");
        }
      }
    } catch (error) {
      console.error("Request reset password error:", error);
      setErrorMsg("Lỗi kết nối đến máy chủ.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 p-6">
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-xl p-6 md:p-8 shadow-xl">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">Quên mật khẩu</h1>
        <p className="text-gray-400 text-sm mb-6">
          Nhập email để nhận link đặt lại mật khẩu.
        </p>

        {errorMsg && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
            {successMsg}
          </div>
        )}

        <div className="mb-5">
          <label className="text-gray-300 text-sm">Email</label>
          <input
            type="email"
            value={email}
            disabled={isLoading}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
            className={`w-full p-3 mt-1 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-teal-400 ${
              isLoading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full bg-teal-400 hover:bg-teal-500 text-black font-semibold py-3 rounded-lg transition ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Đang xử lý..." : "Gửi link reset"}
        </button>

        <p className="text-gray-400 text-sm mt-5 text-center">
          <Link to="/login" className="text-teal-400 hover:underline">
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
