import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const AUTH_API_BASE_URL =
  import.meta.env.VITE_AUTH_API_BASE_URL || "/api/v1";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const token = searchParams.get("token") || "";

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const handleSubmit = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!token) {
      setErrorMsg("Link reset không hợp lệ hoặc thiếu token.");
      return;
    }

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setErrorMsg("Hãy điền đầy đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${AUTH_API_BASE_URL}/api/v1/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (res.ok) {
        setSuccessMsg("Đổi MK thành công");
        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        setErrorMsg("Token không hợp lệ hoặc đã hết hạn.");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setErrorMsg("Lỗi kết nối đến máy chủ.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 p-6">
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-xl p-6 md:p-8 shadow-xl">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">Đặt lại mật khẩu</h1>
        <p className="text-gray-400 text-sm mb-6">
          Nhập mật khẩu mới cho tài khoản của bạn.
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

        <div className="mb-4">
          <label className="text-gray-300 text-sm">Mật khẩu mới</label>
          <input
            type="password"
            value={newPassword}
            disabled={isLoading}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
            className={`w-full p-3 mt-1 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-teal-400 ${
              isLoading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div className="mb-5">
          <label className="text-gray-300 text-sm">Xác nhận mật khẩu</label>
          <input
            type="password"
            value={confirmPassword}
            disabled={isLoading}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu"
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
          {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
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

export default ResetPassword;
